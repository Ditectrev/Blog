import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import type { MDXComponents } from 'mdx/types'
import siteMetadata from '@/data/siteMetadata'
import Image from './Image'
import CustomLink from './Link'
import NewsletterForm from './NewsletterForm'
import TableWrapper from './TableWrapper'

const newsletterConfig = (siteMetadata.newsletter || {}) as {
  externalUrl?: string
  emailFieldName?: string
  hiddenFieldName?: string
}

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm: (props) => (
    <NewsletterForm
      {...props}
      action={newsletterConfig.externalUrl || ''}
      emailFieldName={newsletterConfig.emailFieldName || 'EMAIL'}
      hiddenFieldName={newsletterConfig.hiddenFieldName || ''}
    />
  ),
}
