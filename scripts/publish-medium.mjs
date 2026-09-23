#!/usr/bin/env node
/**
 * Convert new Ditectrev Blog MDX posts to Medium markdown and create drafts.
 *
 * Used by .github/workflows/medium-publish.yml on merge to main.
 * Medium publishStatus is always "draft". canonicalUrl is the live blog URL.
 *
 *   node scripts/publish-medium.mjs
 *   node scripts/publish-medium.mjs --dry-run --files data/blog/.../post.mdx
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import siteMetadata from '../data/siteMetadata.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SITE_URL = (process.env.BLOG_SITE_URL || siteMetadata.siteUrl).replace(/\/$/, '')
const MEDIUM_API = 'https://api.medium.com/v1'
const EMPTY_SHA = '0000000000000000000000000000000000000000'
const PUBLISH_STATUS = 'draft'
const MAX_MEDIUM_TAGS = 3
const MAX_TAG_LENGTH = 25

const MEDIUM_IMAGE_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
}

const CONVERT_TO_JPEG = new Set(['.avif', '.svg', '.webp', '.bmp'])

export function mdxPathToCanonicalUrl(filePath, siteUrl = SITE_URL) {
  const posix = filePath.split(path.sep).join('/').replace(/^\.\//, '')
  const withoutData = posix.replace(/^data\//, '')
  const withoutExt = withoutData.replace(/\.mdx?$/, '')
  return `${siteUrl.replace(/\/$/, '')}/${withoutExt}`
}

export function mediumTagsFromFrontmatter(tags) {
  if (!Array.isArray(tags)) return []
  return tags
    .map((tag) => String(tag).trim())
    .filter((tag) => tag.length > 0 && tag.length <= MAX_TAG_LENGTH)
    .slice(0, MAX_MEDIUM_TAGS)
}

function unquote(value) {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function parseYamlScalar(value) {
  const trimmed = value.trim()
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed === 'null' || trimmed === '~' || trimmed === '') return null
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed)
  return unquote(trimmed)
}

function parseYamlFlowSequence(value) {
  const inner = value.trim().replace(/^\[/, '').replace(/\]$/, '')
  if (!inner.trim()) return []
  return inner
    .split(',')
    .map((item) => parseYamlScalar(item))
    .filter((item) => item !== null && item !== '')
}

/** Parse this repo’s post frontmatter (quoted scalars + flow or block lists). */
export function parsePostFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  const yaml = match[1]
  const content = match[2]
  const data = {}
  const lines = yaml.split(/\r?\n/)
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const blockList = line.match(/^([A-Za-z0-9_]+):\s*$/)
    const flowList = line.match(/^([A-Za-z0-9_]+):\s*(\[.*\])\s*$/)
    const pair = line.match(/^([A-Za-z0-9_]+):\s*(.+)$/)
    if (flowList) {
      data[flowList[1]] = parseYamlFlowSequence(flowList[2])
    } else if (blockList) {
      const key = blockList[1]
      const items = []
      i += 1
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        items.push(parseYamlScalar(lines[i].replace(/^\s*-\s+/, '')))
        i += 1
      }
      data[key] = items
      continue
    } else if (pair) {
      data[pair[1]] = parseYamlScalar(pair[2])
    }
    i += 1
  }
  return { data, content }
}

function mapOutsideCode(markdown, fn) {
  const parts = markdown.split(/(```[\s\S]*?```)/g)
  return parts.map((part, i) => (i % 2 === 1 ? part : fn(part))).join('')
}

function stripMdxChrome(markdown) {
  return mapOutsideCode(markdown, (text) =>
    text
      .replace(/<TOCInline[\s\S]*?\/>/g, '')
      .replace(/<TOCInline[\s\S]*?<\/TOCInline>/g, '')
      .replace(/<BlogNewsletterForm[\s\S]*?\/>/g, '')
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
      .replace(/^import\s+.+;?\s*$/gm, '')
      .replace(/^> \[!(\w+)\]\s*$/gm, (_m, kind) => `> **${kind.charAt(0) + kind.slice(1).toLowerCase()}:**`)
  )
}

function collectMarkdownImages(markdown) {
  const images = []
  const re = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
  let match
  while ((match = re.exec(markdown))) {
    images.push({ alt: match[1], src: match[2], raw: match[0] })
  }
  return images
}

export function localPublicPathForSrc(src) {
  if (!src || /^(https?:|data:|mailto:)/i.test(src)) return null
  const pathname = src.split('?')[0].split('#')[0]
  if (!pathname.startsWith('/static/')) return null
  return path.join(ROOT, 'public', pathname.replace(/^\//, ''))
}

export function absoluteBlogAssetUrl(src, siteUrl = SITE_URL) {
  if (/^https?:\/\//i.test(src)) return src
  const pathname = src.startsWith('/') ? src : `/${src}`
  return `${siteUrl}${pathname}`
}

function jpegFallbackUrl(src, siteUrl = SITE_URL) {
  const abs = absoluteBlogAssetUrl(src, siteUrl)
  if (!/\.(avif|svg|webp)(\?|$)/i.test(abs)) return abs
  const hostPath = abs.replace(/^https?:\/\//, '')
  return `https://wsrv.nl/?url=${encodeURIComponent(hostPath)}&output=jpg`
}

function runFfmpeg(inputPath, outputPath) {
  const result = spawnSync(
    'ffmpeg',
    ['-y', '-hide_banner', '-loglevel', 'error', '-i', inputPath, '-frames:v', '1', '-q:v', '3', outputPath],
    { encoding: 'utf8' }
  )
  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || '').trim()
    throw new Error(`ffmpeg failed converting ${inputPath}: ${err || `exit ${result.status}`}`)
  }
}

function prepareImageForMedium(src) {
  const localPath = localPublicPathForSrc(src)
  if (!localPath || !existsSync(localPath)) {
    return { filePath: null, url: jpegFallbackUrl(src), contentType: null }
  }
  const ext = path.extname(localPath).toLowerCase()
  if (MEDIUM_IMAGE_TYPES[ext]) {
    return { filePath: localPath, url: absoluteBlogAssetUrl(src), contentType: MEDIUM_IMAGE_TYPES[ext] }
  }
  if (CONVERT_TO_JPEG.has(ext)) {
    const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'medium-img-'))
    const jpegPath = path.join(tmpDir, `${path.basename(localPath, ext)}.jpg`)
    runFfmpeg(localPath, jpegPath)
    return { filePath: jpegPath, url: jpegFallbackUrl(src), contentType: 'image/jpeg', tmpDir }
  }
  return { filePath: null, url: absoluteBlogAssetUrl(src), contentType: null }
}

export function convertMdxToMediumMarkdown(raw, { canonicalUrl, title } = {}) {
  const parsed = parsePostFrontmatter(raw)
  const data = parsed.data || {}
  const postTitle = title || data.title || 'Untitled'
  let body = stripMdxChrome(parsed.content || '')
  body = body.replace(/\n{3,}/g, '\n\n').trim()
  const heading = `# ${postTitle}`
  const origin = `*Originally published at [${canonicalUrl}](${canonicalUrl}).*`
  const markdown = `${heading}\n\n${origin}\n\n${body}\n`
  return { frontmatter: data, title: postTitle, markdown }
}

async function mediumRequest(token, url, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Accept-Charset': 'utf-8',
      ...headers,
    },
    body,
  })
  const text = await res.text()
  let json
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    json = { raw: text }
  }
  if (!res.ok) {
    const message = json.errors?.[0]?.message || json.message || text || res.statusText
    const error = new Error(`Medium API ${method} ${url} → ${res.status}: ${message}`)
    error.status = res.status
    error.body = json
    throw error
  }
  return json
}

async function getMediumUserId(token) {
  const json = await mediumRequest(token, `${MEDIUM_API}/me`)
  const id = json.data?.id
  if (!id) throw new Error('Medium /me did not return data.id')
  return id
}

async function uploadMediumImage(token, filePath, contentType) {
  const buffer = readFileSync(filePath)
  const form = new FormData()
  form.append(
    'image',
    new Blob([new Uint8Array(buffer)], { type: contentType }),
    path.basename(filePath)
  )
  const json = await mediumRequest(token, `${MEDIUM_API}/images`, { method: 'POST', body: form })
  const url = json.data?.url
  if (!url) throw new Error('Medium image upload did not return data.url')
  return url
}

async function rewriteImages(markdown, { token, dryRun }) {
  const images = collectMarkdownImages(markdown)
  const replacements = new Map()
  const tmpDirs = []
  try {
    for (const image of images) {
      if (replacements.has(image.src)) continue
      const prepared = prepareImageForMedium(image.src)
      if (prepared.tmpDir) tmpDirs.push(prepared.tmpDir)
      let url = prepared.url
      if (!dryRun && token && prepared.filePath) {
        try {
          url = await uploadMediumImage(token, prepared.filePath, prepared.contentType)
        } catch (err) {
          console.warn(
            `Image upload failed for ${image.src} (${err.message}); using hosted URL ${url}`
          )
        }
      }
      replacements.set(image.src, url)
    }
    return mapOutsideCode(markdown, (text) =>
      text.replace(/!\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/g, (_m, alt, src, titlePart = '') => {
        const next = replacements.get(src) || src
        return `![${alt}](${next}${titlePart || ''})`
      })
    )
  } finally {
    for (const dir of tmpDirs) {
      rmSync(dir, { recursive: true, force: true })
    }
  }
}

function gitAddedMdxFiles(beforeSha, afterSha) {
  if (!beforeSha || beforeSha === EMPTY_SHA) {
    return { files: [], skipped: 'no previous commit SHA; refusing to publish the whole history' }
  }
  const result = spawnSync(
    'git',
    ['diff', '--name-only', '--diff-filter=A', beforeSha, afterSha, '--', 'data/blog'],
    { cwd: ROOT, encoding: 'utf8' }
  )
  if (result.status !== 0) {
    throw new Error(result.stderr || `git diff failed with status ${result.status}`)
  }
  const files = result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.endsWith('.mdx'))
  return { files, skipped: null }
}

async function publishPost(token, filePath, { dryRun }) {
  const abs = path.isAbsolute(filePath) ? filePath : path.join(ROOT, filePath)
  const raw = readFileSync(abs, 'utf8')
  const canonicalUrl = mdxPathToCanonicalUrl(path.relative(ROOT, abs))
  const converted = convertMdxToMediumMarkdown(raw, { canonicalUrl })
  const draft = converted.frontmatter.draft === true
  if (draft) {
    return { skipped: true, reason: 'frontmatter draft: true', filePath }
  }
  const markdown = await rewriteImages(converted.markdown, { token, dryRun })
  const payload = {
    title: converted.title,
    contentFormat: 'markdown',
    content: markdown,
    tags: mediumTagsFromFrontmatter(converted.frontmatter.tags),
    canonicalUrl,
    publishStatus: PUBLISH_STATUS,
    notifyFollowers: false,
  }
  if (dryRun) {
    return { skipped: false, dryRun: true, filePath, payload }
  }
  const userId = await getMediumUserId(token)
  const json = await mediumRequest(token, `${MEDIUM_API}/users/${userId}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return {
    skipped: false,
    filePath,
    canonicalUrl,
    mediumUrl: json.data?.url,
    mediumId: json.data?.id,
    publishStatus: json.data?.publishStatus || PUBLISH_STATUS,
  }
}

function parseArgs(argv) {
  const args = { dryRun: false, files: [] }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--dry-run') args.dryRun = true
    else if (arg === '--files') {
      while (argv[i + 1] && !argv[i + 1].startsWith('--')) {
        i += 1
        args.files.push(argv[i])
      }
    } else if (arg.startsWith('--files=')) {
      args.files.push(...arg.slice('--files='.length).split(',').filter(Boolean))
    }
  }
  return args
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const token = process.env.MEDIUM_INTEGRATION_TOKEN
  let files = args.files
  if (files.length === 0) {
    const beforeSha = process.env.MEDIUM_BEFORE_SHA || ''
    const afterSha = process.env.MEDIUM_AFTER_SHA || process.env.GITHUB_SHA || 'HEAD'
    const detected = gitAddedMdxFiles(beforeSha, afterSha)
    if (detected.skipped) {
      console.log(detected.skipped)
      return
    }
    files = detected.files
  }
  if (files.length === 0) {
    console.log('No new data/blog/**/*.mdx files to publish.')
    return
  }
  if (!args.dryRun && !token) {
    throw new Error(
      'Missing MEDIUM_INTEGRATION_TOKEN. Add it as a GitHub Actions repository secret (Medium Settings → Integration tokens).'
    )
  }
  const results = []
  for (const filePath of files) {
    console.log(`Processing ${filePath}`)
    const result = await publishPost(token, filePath, { dryRun: args.dryRun })
    results.push(result)
    if (result.skipped) {
      console.log(`Skipped ${filePath}: ${result.reason}`)
    } else if (result.dryRun) {
      console.log(
        JSON.stringify(
          {
            filePath,
            canonicalUrl: result.payload.canonicalUrl,
            tags: result.payload.tags,
            publishStatus: result.payload.publishStatus,
          },
          null,
          2
        )
      )
      console.log('--- markdown preview ---')
      console.log(result.payload.content.slice(0, 1200))
      if (result.payload.content.length > 1200) console.log('…')
    } else {
      console.log(
        `Created Medium ${result.publishStatus} for ${filePath}: ${result.mediumUrl} (canonical ${result.canonicalUrl})`
      )
    }
  }
  const published = results.filter((r) => !r.skipped && !r.dryRun)
  const skipped = results.filter((r) => r.skipped)
  console.log(
    `Done. ${args.dryRun ? 'Dry-run' : 'Published'} ${args.dryRun ? results.filter((r) => !r.skipped).length : published.length} post(s); skipped ${skipped.length}.`
  )
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (invokedDirectly) {
  main().catch((err) => {
    console.error(err.message || err)
    process.exit(1)
  })
}
