import Head from 'next/head'
import { useRouter } from 'next/router'

type Props = {
  title?: string
  description?: string
  urlPath?: string
  image?: string
  schema?: object
}

export default function SEO({ title, description, urlPath, image, schema }: Props) {
  const router = useRouter()
  const envBase = process.env.NEXT_PUBLIC_SITE_URL || ''
  const baseUrl = envBase.endsWith('/') ? envBase.slice(0, -1) : envBase
  const path = urlPath || router.asPath || '/'
  const url = baseUrl ? `${baseUrl}${path}` : path
  const metaTitle = title || 'SaaS Reviews and Discovery'
  const metaDesc = description || 'Find, compare, and review software tools.'
  const ogImage = image || '/next.svg'
  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage} />
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}
    </Head>
  )
}
