/**
 * OG Image Helper Utilities
 * 
 * These utilities help generate OG image URLs for use in meta tags.
 * Can be used in both client and server contexts.
 */

export interface GenerateOGImageParams {
  id: string
  title: string
  description?: string
  author?: string
  category?: string
  siteName?: string
  regenerate?: boolean
}

/**
 * Generate an OG image URL for a given page/post
 * This returns a URL to the API endpoint that will generate the image
 */
export function getOGImageUrl(params: GenerateOGImageParams): string {
  const queryParams = new URLSearchParams()
  
  queryParams.set('id', params.id)
  queryParams.set('title', params.title)
  
  if (params.description) {
    queryParams.set('desc', params.description)
  }
  
  if (params.author) {
    queryParams.set('author', params.author)
  }
  
  if (params.category) {
    queryParams.set('category', params.category)
  }
  
  if (params.siteName) {
    queryParams.set('siteName', params.siteName)
  }
  
  if (params.regenerate) {
    queryParams.set('regenerate', 'true')
  }
  
  return `/api/og?${queryParams.toString()}`
}

/**
 * Get the direct path to a cached OG image (if it exists)
 * This is useful for server-side rendering
 */
export function getCachedOGImagePath(id: string): string {
  return `/previews/${id}.png`
}

/**
 * Prefetch/pre-generate an OG image by calling the API
 * Useful in getServerSideProps or getStaticProps
 */
export async function prefetchOGImage(
  params: GenerateOGImageParams,
  baseUrl?: string
): Promise<string> {
  const url = getOGImageUrl(params)
  const fullUrl = baseUrl ? `${baseUrl}${url}` : url
  
  try {
    const response = await fetch(fullUrl)
    const data = await response.json()
    
    if (data.success && data.url) {
      return data.url
    }
    
    throw new Error('Failed to generate OG image')
  } catch (error) {
    console.error('[OG Helper] Error prefetching image:', error)
    // Return the API URL as fallback
    return url
  }
}

/**
 * Helper for blog posts
 */
export function getBlogOGImageUrl(blogId: number | string, title: string, excerpt?: string, author?: string, category?: string): string {
  return getOGImageUrl({
    id: `blog-${blogId}`,
    title,
    description: excerpt,
    author,
    category,
  })
}

/**
 * Helper for tool pages
 */
export function getToolOGImageUrl(slug: string, toolName: string, description?: string): string {
  return getOGImageUrl({
    id: `tool-${slug}`,
    title: toolName,
    description,
  })
}

/**
 * Helper for generic pages
 */
export function getPageOGImageUrl(pageId: string, title: string, description?: string): string {
  return getOGImageUrl({
    id: `page-${pageId}`,
    title,
    description,
  })
}
