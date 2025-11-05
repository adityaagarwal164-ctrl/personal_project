import Head from 'next/head'
import { useRouter } from 'next/router'

type Props = {
  title?: string
  description?: string
  urlPath?: string
  image?: string
  schema?: object
  // New OG image generation props
  ogImageId?: string
  ogImageAuthor?: string
  ogImageCategory?: string
}

export default function SEO({ 
  title, 
  description, 
  urlPath, 
  image, 
  schema,
  ogImageId,
  ogImageAuthor,
  ogImageCategory
}: Props) {
  const router = useRouter()
  
  // Get base URL - use window location in browser, fallback to env or default
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    const envBase = process.env.NEXT_PUBLIC_SITE_URL || ''
    return envBase.endsWith('/') ? envBase.slice(0, -1) : envBase
  }
  
  const baseUrl = getBaseUrl()
  const path = urlPath || router.asPath || '/'
  const url = baseUrl ? `${baseUrl}${path}` : path
  const metaTitle = title || 'SaaSPilot - Discover Top SaaS Tools & Reviews'
  const metaDesc = description || 'Find, compare, and review the best software tools for your business. Honest reviews and ratings from real users.'
  
  // Generate OG image URL
  const getOGImageUrl = (): string => {
    // If manual image is provided, use it
    if (image) {
      return image.startsWith('http') ? image : `${baseUrl}${image}`
    }
    
    // If ogImageId is provided, generate dynamic OG image
    if (ogImageId && metaTitle) {
      const params = new URLSearchParams({
        id: ogImageId,
        title: metaTitle,
      })
      
      if (metaDesc) {
        params.set('desc', metaDesc)
      }
      
      if (ogImageAuthor) {
        params.set('author', ogImageAuthor)
      }
      
      if (ogImageCategory) {
        params.set('category', ogImageCategory)
      }
      
      // For cached images, try to use the direct path first
      // The API will generate it on first request
      return `${baseUrl}/previews/${ogImageId}.png`
    }
    
    // Fallback to default
    return `${baseUrl}/next.svg`
  }
  
  const ogImage = getOGImageUrl()
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
