---
name: ditectrev-blog
description: Write Ditectrev Blog MDX posts in this repo’s nested data/blog layout with SEO, GEO, AI, LLM, and chatbot-friendly structure, a required post graphic, and Medium Import a story after the post is live. Use when creating or updating a Ditectrev blog post, infographic, MDX article, or opening a post PR.
---

# Ditectrev Blog Posts

Follow this skill whenever the task is a new or updated **Ditectrev Blog** post. Do not invent a generic Medium/Substack layout. Posts live as MDX under `data/blog/`. The post graphic lives under `public/static/images/`. Copy structure, frontmatter, tone, and file names from the existing posts below.

## Source posts (copy, don't reinvent)

| Flavor | Path | Role |
| --- | --- | --- |
| Comparison | [`data/blog/software-development/web-services/graphql-vs-rest.mdx`](../../../data/blog/software-development/web-services/graphql-vs-rest.mdx) | Canonical vs-guide: two stacks, tables, takeaways |
| API / method deep-dive | [`data/blog/software-development/web-development/frontend/javascript/slice-vs-substring-vs-substr-complete-javascript-string-methods-comparison.mdx`](../../../data/blog/software-development/web-development/frontend/javascript/slice-vs-substring-vs-substr-complete-javascript-string-methods-comparison.mdx) | Canonical long comparison + syntax/examples/pitfalls |
| How-to | [`data/blog/software-development/operating-systems/runtime-environment/node-js/how-to-add-a-npmrc-file.mdx`](../../../data/blog/software-development/operating-systems/runtime-environment/node-js/how-to-add-a-npmrc-file.mdx) | Canonical step-by-step config guide |
| Complete guide | [`data/blog/software-development/web-development/frontend/cascading-style-sheets-css/combining-border-top-border-right-border-left-border-bottom-in-css-a-complete-guide.mdx`](../../../data/blog/software-development/web-development/frontend/cascading-style-sheets-css/combining-border-top-border-right-border-left-border-bottom-in-css-a-complete-guide.mdx) | Canonical CSS/property guide + shorthand |
| Migration | [`data/blog/software-development/mobile-development/native/android/jetifier-androidx-migration-guide.mdx`](../../../data/blog/software-development/mobile-development/native/android/jetifier-androidx-migration-guide.mdx) | Canonical migration + troubleshooting |

Pick **one flavor** before writing anything:

- **Comparison** if the title is `X vs Y` (GraphQL vs REST, `slice()` vs `substring()`).
- **How-to** if the reader must do a concrete task (`How to Add a .npmrc File?`).
- **Complete guide** if the topic is one feature family (CSS borders).
- **Migration** if the reader is moving between libraries/platforms (Jetifier / AndroidX).

## When to use

Use this skill when the user asks to:

- Create a new Ditectrev blog post
- Add or expand an MDX file under `data/blog/`
- Generate the required blog post graphic / infographic / social image
- Make a post SEO, GEO, AI, LLM, or chatbot friendly
- Match existing frontmatter, nested folders, tags, TOC, or “Further Learning Resources”
- Open a PR that publishes a post
- Cross-post a **live** article to Medium via **Import a story** (after merge/deploy; no Medium API)

Do **not** use this skill for the books/courses README layout, reveal.js slides, CodeSandboxes, marketing landing pages, or edits that are only site chrome (`app/`, `layouts/`) with no post content.

## Canonical post layout

```text
data/blog/{domain}/{topic-path}/{kebab-slug}.mdx
public/static/images/{graphic-slug}.avif
```

Every published post in this repo uses **all** of:

1. YAML frontmatter (fields below)
2. Hero graphic as the first MDX node
3. `<TOCInline toc={props.toc} asDisclosure={true} />`
4. `## Introduction` then teaching `##` / `###` sections
5. `## Further Learning Resources` (or `## Learning Resources for …`)
6. `## Conclusion` (sometimes `## Conclusion: {Topic}`)
7. Optional close: `## Key Takeaways`, `## Quick Comparison Table`, `### Additional Resources`

There are **no** per-post `docs/` trees. One MDX file is the article.

### Nested folder rules that actually appear in the repo

Keep the taxonomy. Do not dump new posts in `data/blog/` root.

| Topic | Directory |
| --- | --- |
| JavaScript language | `software-development/web-development/frontend/javascript/` |
| CSS | `software-development/web-development/frontend/cascading-style-sheets-css/` |
| Web APIs / GraphQL / REST | `software-development/web-services/` (short) **or** a deeper path when the topic is nested like Node |
| Node.js / npm / runtime | `software-development/operating-systems/runtime-environment/node-js/` |
| Android native | `software-development/mobile-development/native/android/` |

Extend the tree the same way: `software-development/{area}/{stack}/{tool}/`. Spell CSS as `cascading-style-sheets-css`. Spell Node as `node-js`.

Filename = kebab-case slug, no date prefix:

| Post | File |
| --- | --- |
| GraphQL vs REST | `graphql-vs-rest.mdx` |
| How to Add a `.npmrc` File? | `how-to-add-a-npmrc-file.mdx` |
| Jetifier guide | `jetifier-androidx-migration-guide.mdx` |
| Long JS comparison | `slice-vs-substring-vs-substr-complete-javascript-string-methods-comparison.mdx` |

URL is `https://blog.ditectrev.com/blog/{flattened-path-without-data}` e.g. `https://blog.ditectrev.com/blog/software-development/web-services/graphql-vs-rest`.

### Graphic file rules

| Piece | Rule |
| --- | --- |
| Format | **AVIF** (every current post graphic is `.avif`) |
| Pixel size | **1400×788** (existing infographics) |
| Aspect | 16:9 |
| Path on disk | `public/static/images/{graphic-slug}.avif` |
| Path in MDX / frontmatter | `/static/images/{graphic-slug}.avif` (no `public/`) |
| Naming | Short kebab topic, not the full title: `graphql-vs-rest.avif`, `nodejs-npmrc.avif`, `borders-in-css.avif`, `slice-substring-substr.avif` |
| Alt | `{Exact Post Title} Infographics` or `{Exact Post Title} infographics` |

Do not hotlink Unsplash/Wikimedia/CDN URLs in the post. Host the final graphic in this repo.

## Shared constants (copy verbatim)

- Site: `https://blog.ditectrev.com`
- Repo: `https://github.com/Ditectrev/Blog` (`siteMetadata.siteRepo` currently uses `https://github.com/ditectrev/blog`)
- Brand color: `#3f51b5` (Tailwind primary-500)
- Tagline: `#Build Your Digital Future.`
- Author file: `data/authors/default.mdx` → frontmatter `authors: ['default']` unless the user names someone else
- Default layout: `PostLayout`
- Discord: `https://discord.gg/RFjtXKfJy3`
- Shop: `https://shop.ditectrev.com/`
- Education: `https://education.ditectrev.com`
- Educative affiliate suffix: `?aff=VALz`
- Coursera impact host used in existing posts: `https://imp.i384100.net/...`
- Brand logos on disk: `public/static/images/logoBlack.svg`, `logoWhite.svg`
- Medium: official **Import a story** of the live URL `https://blog.ditectrev.com/blog/{slug-path}` (creates a private draft with canonical + original date)

Schema.org `BlogPosting` JSON-LD is already emitted from `contentlayer.config.ts` + `app/blog/[...slug]/page.tsx`. Do **not** paste a second JSON-LD block into the MDX.

## Frontmatter (do not reorder, do not skip required fields)

Use this exact field set, matching live posts:

```yaml
---
title: '{Keyword-rich title}'
date: 'YYYY-MM-DD'
tags: ['lowercase', 'multi word ok', 'software development']
draft: false
summary: '{1–2 sentences that include the primary query and the outcome.}'
authors: ['default']
images: ['/static/images/{graphic-slug}.avif']
layout: PostLayout
---
```

Optional (supported by Contentlayer, unused on most live posts):

- `lastmod` — set when updating an existing post
- `canonicalUrl` — only for cross-posts; otherwise the App Router canonical is enough
- `bibliography` — only if citing via `rehype-citation`

Rules:

- `title` is sentence case or technical case, quoted. Include the primary keyword. Questions keep `?` (`How to Add a .npmrc File?`).
- `date` is ISO `YYYY-MM-DD` (publish date, not now-if-the-post-is-backdated by the user).
- `tags` are **lowercase**. Multi-word tags stay spaced (`web development`, `software development`, `operating system`). Reuse existing tags when they fit; add specific ones (`graphql`, `npm`, `jetifier`). Typical count: 4–10.
- `draft: false` on the PR unless the user asked to hide the post. Live posts are all `false`.
- `summary` is the meta description / Open Graph description. ~150–180 characters. Repeat the main entities (`REST`, `GraphQL`, `.npmrc`) in plain language.
- `images` is a **list** with the hero graphic first. That file is also the Article `image` in JSON-LD.

Immediately after the closing `---`:

```mdx
![GraphQL vs REST: Choosing the Right API Architecture for Your Project Infographics](/static/images/graphql-vs-rest.avif)

<TOCInline toc={props.toc} asDisclosure={true} />
```

No extra blank-section chrome. No HTML `<img>`. Markdown image → `remarkImgToJsx` → `next/image`.

## Repeatable workflow (new post)

Work in this order. **Do not generate the graphic until step 5 is answered.**

1. **Choose flavor** — comparison / how-to / complete guide / migration.
2. **Lock title, slug, nested folder, tags, primary keyword, and search intent** from the source-post tables. Confirm with the user if more than one folder could fit.
3. **Outline** H2/H3 strings first (the TOC contract). Mirror likely queries. See [SEO, GEO, AI, LLM, chatbot](#seo-geo-ai-llm-and-chatbot-friendly-writing).
4. **Draft body** against that outline. Heading text in the file must equal the outline strings.
5. **Ask what to put in the graphic** — hard gate. See [Ask before every graphic](#ask-before-every-graphic-hard-gate).
6. **Source assets from the internet** (when the spec needs a real icon, logo, screenshot, or photo). Record license + attribution. See [Internet-sourced assets](#internet-sourced-assets-used-in-the-generated-graphic).
7. **Generate the post graphic**, convert to 1400×788 AVIF, wire `images:` + hero alt.
8. **GEO/LLM pass** — first-sentence answers, FAQ, tables, key takeaways, credits.
9. **Local check** — frontmatter, links, graphic path, `yarn lint` on touched files if JS/MDX lint applies.
10. **Open a PR** with the MDX + AVIF (and credits). Default draft unless the user says otherwise.
11. **Medium Import a story** — after the PR **merges to `main` and the post is live**, import `https://blog.ditectrev.com/blog/{path}` with Medium’s official Import a story tool. Review the private draft, then publish on Medium. See [Medium: Import a story](#medium-import-a-story-after-the-post-is-live).

When editing an existing post: keep folder + slug stable unless the user asks to move it; update `lastmod`; regenerate the graphic only if the user wants a new one (still ask what to include). Do **not** re-import on Medium unless the user asks; Import a story is for the first live publish.

## SEO, GEO, AI, LLM, and chatbot friendly writing

Optimize for three retrieval surfaces at once: classic search (SEO), generative engines (GEO), and assistants that quote or chunk the page (AI / LLM / chatbots). Do this with **concrete page structure**, not a keyword dump.

### Search intent and title

- One primary query per post (`graphql vs rest`, `how to add npmrc`, `slice vs substring vs substr`).
- Title includes that query and a qualifier (`Complete … Comparison`, `A Complete Guide`, `Choosing the Right …`).
- Summary repeats the query in a full sentence a featured snippet could lift.
- Slug is the query in kebab-case, not a witty metaphor.

### On-page SEO (this codebase)

- Unique `title` + `summary`; they become `<title>`, `og:description`, and Twitter `summary_large_image`.
- Hero AVIF in `images:` so OG/Twitter/JSON-LD are not the site-wide `twitter-card.png`.
- `tags` that match the folder + extra entities (feeds and `/tags/{slug}` pages).
- Descriptive filename + nested path (the public URL is the path).
- `##` / `###` that look like queries (`What is REST API?`, `How to Create a .npmrc File Manually?`).
- Internal links to other `data/blog` posts when relevant; otherwise canonical docs (MDN, spec, vendor).
- Descriptive link text, never “click here”.
- Image `alt` = title + “Infographics”.
- Live `date` / `lastmod` (JSON-LD `datePublished` / `dateModified`).
- Do not mark `draft: true` on a post you intend to rank.

### GEO (generative engine optimization)

Generative engines cite pages that **answer clearly, name entities, and are extractable**.

- **Answer first.** The opening 40–80 words of every `##` state the fact, then evidence. Do not wind up with “In the ever-evolving landscape…” except as a short intro after the lede (existing intros are 1–2 paragraphs then a “you will learn” list).
- **Spell the entity once, then the acronym:** `Representational State Transfer (REST)`, `HyperText Markup Language (HTML)` — same pattern as the books skill.
- **Stable nouns** in headings (`AndroidX`, `Jetifier`, `String.prototype.slice()`), not “this method” / “the former”.
- **Comparison tables** for vs-posts (see the JS string table and GraphQL vs REST sections).
- **Numbered procedures** for how-tos (`### Step 1: …`).
- **FAQ block** with question headings. Use `## Frequently Asked Questions` then `### {Full question}?`. First sentence under each `###` is the direct answer.
- **Key takeaways** as a bullet list near the end (`## Key Takeaways: REST vs GraphQL` on the comparison post).
- **Citations** to primary docs with the vendor name in the link text (`[MDN Web Docs on CSS Borders](https://developer.mozilla.org/…)`).
- **Author is a Person** (already injected). Do not write anonymous “we at a blog”. Instructor **we**, reader **you**, same as Ditectrev books.

### AI / LLM / chatbot chunking

Assume an assistant will embed one H2 at a time.

- Each `##` section is self-contained: define terms in that section, do not rely on “as mentioned above” without restating the name.
- Prefer lists, tables, and fenced code over 400-word walls.
- Code fences include a language tag (`javascript`, `css`, `ini`, `kotlin`, `bash`).
- Show **input → output** in comments for APIs (`// "Java"`).
- Call out deprecated/wrong paths explicitly (`substr()` is deprecated; `substring()` swaps arguments).
- Add a **Quick Comparison Table** or **Quick Debug Checklist** when the topic is a choice or a failure mode.
- Keep a `## Conclusion` that restates the recommendation in 3–6 sentences a model can quote.
- Avoid emoji in the body (live posts do not use them in chapters; save emoji for the site chrome).

### Minimum required sections for discoverability

Every new post must include:

| Section | Purpose |
| --- | --- |
| `## Introduction` | Intent + “you will learn” bullets |
| Teaching `##` / `###` matching the outline | Rank + chunk |
| `## Frequently Asked Questions` | GEO / People Also Ask / chatbot Q&A |
| `## Further Learning Resources` | Existing Ditectrev pattern (Educative `?aff=VALz` + Coursera impact link when a real course fits; do not invent URLs) |
| `## Conclusion` | Quotable close |
| At least one of: takeaways, comparison table, additional official-doc links | Extractable recap |

If the user forbids affiliates, keep official docs only and skip the paid-course paragraph.

## Ask before every graphic (hard gate)

**Every post gets a blog post graphic.** There is no text-only exception.

**Before creating, generating, compositing, or converting that graphic, ask the user what to include.** Do not silently pick a concept. Do not reuse another post’s AVIF.

Ask in one message, then **wait**:

1. **Subject** — what is in the center? (two-logo split, one wordmark, a titled box, an icon, a screenshot)
2. **Must-include** — logos, code glyphs, product names, `#Build Your Digital Future.`, Ditectrev wordmark, constellation motif, brand `#3f51b5`
3. **Must-exclude** — clutter, extra slogans, photoreal people, unreadable micro-text
4. **Text in the image** — exact strings (existing posts use little type: `GraphQL` / `REST` / `VS`, `npm`, `Borders in CSS`)
5. **Source assets** — may we pull a real icon/photo/logo from the internet and composite it? Any preferred URL?
6. **Style** — default = live **blog** infographics (white canvas, indigo constellation corners, 1400×788). The SEO book `images/promotional.png` is the **sourcing + composite** reference, not the default blog layout (that file also adds DITECTREV + tagline banners and is 3000×1688).

If the user says “you decide”, still send a 5-line spec (subject, includes, excludes, text, source plan) and wait for yes / edits.

Only after they answer, run [Internet-sourced assets](#internet-sourced-assets-used-in-the-generated-graphic) and [Generate and save](#generate-and-save).

## Internet-sourced assets (used in the generated graphic)

Learn this step from the SEO book promotional graphic ([commit `3852909`](https://github.com/Ditectrev/Awesome-SEO-Book-Course-Search-Engine-Optimization/commit/38529095c3d90ce0b5ce01e0f8e2f17f97546913)): a **real, topic-relevant glyph** (there, a search-on-document icon) is placed on a **generated Ditectrev frame** (white field, indigo geometric network). Do not generate a fake “stock photo of a laptop” and call it done when a licensed icon would be clearer.

### What to source

| Need | Where to look first |
| --- | --- |
| Generic topic icon (search, cloud, gear, document) | [Wikimedia Commons](https://commons.wikimedia.org/) — SVG/PNG, filter by license |
| Brand logo the post is about (`npm`, GraphQL, Android) | Official brand/press kit or Simple Icons **if** the license allows redistribution in a composite. Follow trademark rules (don’t warp the mark). Live posts already show `npm` and GraphQL marks. |
| Photograph | Wikimedia Commons, Unsplash, Pexels — still attribute |
| UI screenshot | Capture from official docs only when ToS allows; crop PII |

Search the web for the named asset. Prefer SVG. Download to a **working path outside git** (e.g. `/tmp/ditectrev-blog-graphic/source-*`). Do not commit the raw download unless the license requires shipping the source.

### License allow-list (use) vs block-list (skip)

**Allow** (with the matching duty):

| License | Duty |
| --- | --- |
| CC0 / Public Domain / Unsplash / Pexels | Credit is optional legally; **still record** source URL in the MDX comment + PR |
| CC BY | Name, title, source URL, license link |
| CC BY-SA | Same as BY, plus the composite must be share-alike if the license applies to the adaptation |
| Official brand guidelines that permit educational/nominative use | Don’t imply sponsorship; don’t recolor a mark if the kit forbids it |

**Skip:**

- All rights reserved, unknown license, “found on Google Images”
- CC BY-NC / NC-ND for this commercial-friendly open blog unless the user explicitly accepts NC
- Watermarked stock, random GitHub READMEs without a license, AI-image sites with no grant
- Hotlinked third-party URLs as the live `images:` entry

If a needed logo cannot be licensed, ask the user whether to use a **generic** icon (the SEO promotional pattern) instead of the mark.

### Attribution record (required whenever something was sourced)

Keep this block in an MDX HTML comment under the hero (agents and future editors need it even when the visible caption is short):

```mdx
{/* Graphic assets:
  - {file or role}: {page URL}
    Author: {name}
    License: {SPDX or CC name} {license URL}
    Retrieved: {YYYY-MM-DD}
    Notes: used as reference / composited into 1400x788 AVIF
*/}
```

If the license requires visible credit, add a closing subsection:

```mdx
### Graphic credits

Hero infographic includes “{Title}” by {Author}, via [Wikimedia Commons]({page-url}), [{License}]({license-url}).
```

Never strip credits in a “cleanup” pass.

## Generate and save

Default look (from live AVIF infographics):

- White background
- Indigo / `#3f51b5` geometry: faint constellation / network in one or both corners (see `borders-in-css.avif`, `nodejs-npmrc.avif`)
- One idea in the middle; lots of padding
- Comparison posts: diagonal or 50/50 split + round `VS` badge (`graphql-vs-rest.avif`)
- No walls of infographic bullet text (unreadable at OG size)
- No DITECTREV ribbon unless the user asked for book-style promo banners

Use the image tool with:

- A concrete description (subject, layout, colors, exact text, “no extra slogans”)
- `aspect_ratio: "16:9"`
- `reference_image_paths`: the **downloaded source asset** plus, when helpful, an existing post graphic and/or `public/static/images/logoBlack.svg` so the constellation/brand match
- `filename`: `{graphic-slug}.png`

Then convert and place (libaom is available in typical agent images):

```bash
ffmpeg -y -i /tmp/{graphic-slug}.png \
  -vf "scale=1400:788:force_original_aspect_ratio=decrease,pad=1400:788:(ow-iw)/2:(oh-ih)/2:white" \
  -c:v libaom-av1 -still-picture 1 -crf 30 \
  public/static/images/{graphic-slug}.avif
```

Wire the same path in frontmatter `images` and the hero `![…]()`. Open Graph reads `images[0]`; skipping this breaks social cards.

If generation distorts a trademarked logo, prefer compositing the official SVG with code (ImageMagick/ffmpeg overlay) onto the generated frame instead of a hallucinated mark.

## Post body recipes

Tone: instructor **we**, reader **you**. Direct, practical, no academic fluff. Teach with real commands and code. Match the source post of the same flavor.

### Fixed opening

1. Hero image
2. `TOCInline`
3. `## Introduction` — what the thing is, why it matters, bullet list of what the reader will learn

### Comparison recipe (GraphQL vs REST / slice vs substring)

For each side: definition → syntax/principles → examples → advantages → limitations. Then a `## Detailed Comparison` (or `## Side-by-Side Comparison`) with subheadings, a recap table, pitfalls, and `## Key Takeaways: {Topic}`.

### How-to recipe (`.npmrc`)

What it is → why it matters → locations/options → numbered create steps → common settings → debug checklist (`### npm Seems to Ignore .npmrc`) → conclusion.

### Complete-guide recipe (CSS borders)

Concept → shorthand vs longhand → examples → use cases (cards, alerts, buttons) → performance → troubleshooting → official additional resources.

### Migration recipe (Jetifier)

Old vs new packages → flags → scenarios (new vs existing apps) → errors and fixes → validation checklist → vendor docs.

### Code and MDX

- Fence with a language. Keep examples copy-pasteable.
- Inline code for identifiers (`.npmrc`, `slice()`, `androidx.*`).
- Do not invent custom MDX components beyond what `components/MDXComponents.tsx` exports (`TOCInline`, `Image`, `BlogNewsletterForm`, GitHub alerts via `remark-github-blockquote-alert`).
- GitHub-style alerts are allowed (`> [!NOTE]`) if they help; live posts mostly use plain prose.

### Closing

`## Further Learning Resources` — one short paragraph, then **at most** one Coursera impact link and one Educative `?aff=VALz` link when they honestly match the topic. Then `## Conclusion`. Then optional takeaways / table / `### Additional Resources` (MDN, spec, caniuse, AndroidX).

## Medium: Import a story (after the post is live)

Cross-posting is part of creating a blog post. Do it **after** the article is live on `main` (PR merged and Firebase hosting deployed). Do **not** use the Medium API, integration tokens, GitHub Actions, or `scripts/publish-medium.mjs`. There is no API fallback.

Official help: [Importing a post to Medium](https://help.medium.com/hc/en-us/articles/214550207-Importing-a-post-to-Medium). Import automatically **backdates** to the original publish date and sets a **canonical URL** to the source so SEO stays on the blog.

### Steps (required)

1. **Wait until live.** Confirm a `200` for `https://blog.ditectrev.com/blog/{nested-path}`  
   Example: `https://blog.ditectrev.com/blog/software-development/web-services/graphql-vs-rest`  
   If hosting is still deploying, wait and retry. Do not import a 404.
2. **Open Import a story.** Signed in to the Ditectrev Medium account: homepage → **Stories** (left rail) → **Import a story** (top-right). Direct URL: [https://medium.com/p/import](https://medium.com/p/import).
3. **Paste the live blog URL** (the same path as step 1). Click **Import**.
4. **Open the draft.** Click **See your story**. Medium creates a **private draft** with:
   - Canonical URL = the blog URL you imported
   - Story date = the original `date` on the live post
5. **Review the draft** (agent and/or user): title, hero, images, code fences, lists, missing sections, leftover TOC chrome. Fix anything Import mangled. Do not change the canonical away from the blog URL.
6. **Publish on Medium** only after that review. The user publishes if the agent cannot click Publish in a signed-in session; otherwise the agent publishes with the user’s OK.

If Import fails (blocked page, empty body), tell the user. Do **not** paste into a new Medium story as a substitute unless they ask — a manual paste would **not** backdate and would need a hand-set canonical.

### Agent rules for Medium

- Never call `api.medium.com`, never ask for `MEDIUM_INTEGRATION_TOKEN`, never add a Medium GitHub Action.
- Do not add Medium-only HTML or a second canonical to the MDX; Import reads the live page.
- Keep blog `tags` as they are (4–10). Medium tags can be adjusted in the draft UI after import.
- After merge, give the user the live URL and these Import steps if they will click through themselves.

## Checklists

### Path / GitHub

- [ ] File is `data/blog/{nested-taxonomy}/{kebab-slug}.mdx`
- [ ] Graphic is `public/static/images/{graphic-slug}.avif` at 1400×788
- [ ] PR includes both files (and does not add a root license or a `docs/` article tree)
- [ ] Default branch target `main`

### Frontmatter / chrome

- [ ] `title`, `date`, `tags`, `draft`, `summary`, `authors`, `images`, `layout: PostLayout`
- [ ] Hero alt uses the post title + Infographics
- [ ] `<TOCInline toc={props.toc} asDisclosure={true} />` is present
- [ ] `authors: ['default']` unless another `data/authors/*.mdx` exists

### SEO / GEO / AI

- [ ] Title + summary + H2s contain the primary query and named entities
- [ ] Every `##` leads with a direct answer
- [ ] FAQ with question `###` headings
- [ ] Table or takeaways list for extractable recap
- [ ] Official documentation links are live
- [ ] No second JSON-LD blob in MDX
- [ ] FAQ and conclusion are quotable without the rest of the page

### Graphic

- [ ] User was asked what to include **before** any generate/composite step
- [ ] Internet-sourced files are licensed on the allow-list
- [ ] Attribution comment (and visible credits if required)
- [ ] Final asset is repo-hosted AVIF, not a hotlink
- [ ] `images:` frontmatter matches the hero path

### Body

- [ ] Flavor recipe followed (comparison / how-to / guide / migration)
- [ ] Heading strings = TOC strings
- [ ] Further Learning Resources + Conclusion present
- [ ] No leftover `TODO` in student-facing body unless the user asked for stubs

### Medium

- [ ] Post is live at `https://blog.ditectrev.com/blog/{nested-path}` (`draft: false`, hosting deployed)
- [ ] Imported via Medium → Stories → **Import a story** (or https://medium.com/p/import) using that URL
- [ ] Draft reviewed (canonical still the blog URL; date is the original publish date)
- [ ] Published on Medium after review
- [ ] No Medium API, token, or GitHub Action involved

## Agent operating rules

- Read at least one **same-flavor** source post before writing. Prefer GraphQL vs REST for vs-guides, `.npmrc` for how-tos, CSS borders for property guides, Jetifier for migrations, JS string methods for long API comparisons.
- Preserve Ditectrev post chrome (frontmatter keys, TOCInline, nested folders, AVIF heroes). Do not “simplify” into a flat `data/blog/my-post.mdx`.
- **Never** generate the graphic before the user answers the include/exclude questions.
- **Never** paste a copyrighted image into the graphic without a recorded license.
- Do not add a post-level `LICENSE`. The repo is MIT; third-party graphic licenses still need attribution.
- Do not restructure the article into multiple markdown files.
- Do not change `contentlayer.config.ts` or layouts just to fit a new field; use existing fields.
- When the user asks for “just the graphic” or “just the outline”, still keep filenames, `images:`, and headings aligned with the other artifact if it already exists.
- Default to opening a **draft PR** on `main` with the MDX + AVIF when the user wants the post landed in GitHub.
- After merge and deploy, **Import a story** the live blog URL on Medium, review the private draft, then publish. Never call `api.medium.com` or use an integration token.
