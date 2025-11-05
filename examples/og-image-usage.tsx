/**
 * OG Image Generator - Usage Examples
 * 
 * This file contains various examples of how to use the OG Image Generator
 * in different scenarios throughout your Next.js application.
 */

import SEO from '@/components/SEO'
import { getBlogOGImageUrl, getToolOGImageUrl, getPageOGImageUrl } from '@/lib/ogImageHelper'

// ============================================================================
// Example 1: Simple Blog Post Page
// ============================================================================

export function BlogPostExample({ post }: any) {
  return (
    <div>
      <SEO 
        title={`${post.title} - Blog`}
        description={post.excerpt}
        ogImageId={`blog-${post.id}`}
        ogImageAuthor={post.author}
        ogImageCategory={post.category}
      />
      
      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    </div>
  )
}

// ============================================================================
// Example 2: Product/Tool Page
// ============================================================================

export function ToolPageExample({ tool }: any) {
  return (
    <div>
      <SEO 
        title={`${tool.name} - Review & Pricing`}
        description={tool.description}
        ogImageId={`tool-${tool.slug}`}
        ogImageCategory={tool.category}
      />
      
      <div>
        <h1>{tool.name}</h1>
        <p>{tool.description}</p>
      </div>
    </div>
  )
}

// ============================================================================
// Example 3: Category/Collection Page
// ============================================================================

export function CategoryPageExample({ category, toolCount }: any) {
  return (
    <div>
      <SEO 
        title={`${category.name} Tools`}
        description={`Discover ${toolCount} ${category.name} tools`}
        ogImageId={`category-${category.slug}`}
        ogImageCategory={category.name}
      />
      
      <div>
        <h1>{category.name} Tools</h1>
        {/* Tool list */}
      </div>
    </div>
  )
}

// ============================================================================
// Example 4: Static Page (About, Contact, etc.)
// ============================================================================

export function AboutPageExample() {
  return (
    <div>
      <SEO 
        title="About Us - Our Mission"
        description="Learn about our journey to help teams find the best SaaS tools"
        ogImageId="page-about"
      />
      
      <div>
        <h1>About Us</h1>
        <p>Our story...</p>
      </div>
    </div>
  )
}

// ============================================================================
// Example 5: Using Helper Functions for URL Generation
// ============================================================================

export function HelperFunctionExample({ blog, tool }: any) {
  // Generate OG image URLs without the SEO component
  const blogImageUrl = getBlogOGImageUrl(
    blog.id,
    blog.title,
    blog.excerpt,
    blog.author,
    blog.category
  )
  
  const toolImageUrl = getToolOGImageUrl(
    tool.slug,
    tool.name,
    tool.description
  )
  
  const aboutImageUrl = getPageOGImageUrl(
    'about',
    'About Us',
    'Learn more about our mission'
  )
  
  return (
    <div>
      <img src={blogImageUrl} alt="Blog OG" />
      <img src={toolImageUrl} alt="Tool OG" />
      <img src={aboutImageUrl} alt="Page OG" />
    </div>
  )
}

// ============================================================================
// Example 6: Server-Side Pre-generation (getServerSideProps)
// ============================================================================

export async function getServerSidePropsExample(context: any) {
  const post = await fetchPost(context.params.id)
  
  // Pre-generate the OG image on the server
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      const ogUrl = getBlogOGImageUrl(
        post.id,
        post.title,
        post.excerpt,
        post.author,
        post.category
      )
      
      // Trigger generation
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}${ogUrl}`)
    } catch (error) {
      console.error('Failed to pre-generate OG image:', error)
    }
  }
  
  return {
    props: { post }
  }
}

async function fetchPost(id: string) {
  // Fetch post logic
  return {} as any
}

// ============================================================================
// Example 7: Dynamic Route with Multiple Variables
// ============================================================================

export function DynamicRouteExample({ category, slug, tool }: any) {
  // Composite ID for complex routes
  const ogImageId = `tool-${category}-${slug}`
  
  return (
    <div>
      <SEO 
        title={`${tool.name} in ${category}`}
        description={tool.shortDesc}
        ogImageId={ogImageId}
        ogImageCategory={category}
      />
      
      <div>
        <h1>{tool.name}</h1>
      </div>
    </div>
  )
}

// ============================================================================
// Example 8: Programmatic Image Generation (API Route or Server Action)
// ============================================================================

export async function generateOGImageProgrammatically() {
  const params = new URLSearchParams({
    id: 'custom-promo',
    title: 'Limited Time Offer',
    desc: 'Get 50% off all premium tools this week',
    category: 'Promotion',
    siteName: 'SaaSPilot Deals'
  })
  
  const response = await fetch(`/api/og?${params.toString()}`)
  const data = await response.json()
  
  if (data.success) {
    console.log('Image generated:', data.url)
    return data.url
  }
  
  return null
}

// ============================================================================
// Example 9: Cache Management
// ============================================================================

export async function cacheManagementExample() {
  // Check if image exists
  const checkResponse = await fetch('/api/og-cache?action=check&id=blog-1')
  const checkData = await checkResponse.json()
  console.log('Image exists:', checkData.exists)
  
  // List all cached images
  const listResponse = await fetch('/api/og-cache')
  const listData = await listResponse.json()
  console.log('Cached images:', listData.images)
  
  // Clear all cache
  const clearResponse = await fetch('/api/og-cache?action=clear')
  const clearData = await clearResponse.json()
  console.log('Cleared images:', clearData.count)
  
  // Delete specific image
  const deleteResponse = await fetch('/api/og-cache?id=blog-1', {
    method: 'DELETE'
  })
  const deleteData = await deleteResponse.json()
  console.log('Deleted:', deleteData.success)
}

// ============================================================================
// Example 10: Fallback to Manual Image
// ============================================================================

export function FallbackExample({ post, hasCustomImage }: any) {
  return (
    <div>
      <SEO 
        title={post.title}
        description={post.excerpt}
        // Use manual image if available, otherwise generate
        {...(hasCustomImage 
          ? { image: post.customOGImage }
          : { 
              ogImageId: `blog-${post.id}`,
              ogImageAuthor: post.author,
              ogImageCategory: post.category
            }
        )}
      />
      
      <article>
        <h1>{post.title}</h1>
      </article>
    </div>
  )
}

// ============================================================================
// Example 11: Force Regeneration
// ============================================================================

export async function forceRegenerateExample(postId: number) {
  // Method 1: Via API with regenerate flag
  const params = new URLSearchParams({
    id: `blog-${postId}`,
    title: 'Updated Title',
    desc: 'Updated description',
    regenerate: 'true'  // Force regeneration
  })
  
  const response = await fetch(`/api/og?${params.toString()}`)
  const data = await response.json()
  console.log('Regenerated:', data.url)
  
  // Method 2: Delete cache first, then regenerate
  await fetch(`/api/og-cache?id=blog-${postId}`, { method: 'DELETE' })
  
  // Then generate new one
  const newParams = new URLSearchParams({
    id: `blog-${postId}`,
    title: 'New Title',
    desc: 'New description'
  })
  
  const newResponse = await fetch(`/api/og?${newParams.toString()}`)
  const newData = await newResponse.json()
  console.log('Fresh image:', newData.url)
}

// ============================================================================
// Example 12: Batch Generation
// ============================================================================

export async function batchGenerateExample(posts: any[]) {
  console.log(`Generating OG images for ${posts.length} posts...`)
  
  const results = await Promise.all(
    posts.map(async (post) => {
      try {
        const params = new URLSearchParams({
          id: `blog-${post.id}`,
          title: post.title,
          desc: post.excerpt,
          author: post.author,
          category: post.category
        })
        
        const response = await fetch(`/api/og?${params.toString()}`)
        const data = await response.json()
        
        return {
          postId: post.id,
          success: data.success,
          url: data.url,
          cached: data.cached
        }
      } catch (error) {
        return {
          postId: post.id,
          success: false,
          error: error
        }
      }
    })
  )
  
  console.log('Batch generation complete:', results)
  return results
}

// ============================================================================
// Example 13: Custom Styling (would require updating ogImageGenerator.ts)
// ============================================================================

/**
 * To create custom styled images, you would modify the ogImageGenerator.ts
 * file or create a separate generator. Here's the concept:
 */

export async function customStyledExample() {
  // This would require extending ogImageGenerator.ts with theme support
  const params = new URLSearchParams({
    id: 'custom-dark',
    title: 'Dark Theme Example',
    desc: 'Using custom colors',
    // These would need to be added to the API
    // backgroundColor: '#1e293b',
    // textColor: '#f1f5f9'
  })
  
  const response = await fetch(`/api/og?${params.toString()}`)
  const data = await response.json()
  return data.url
}

// ============================================================================
// Utility: Get OG image URL for sharing
// ============================================================================

export function getFullOGImageUrl(imageUrl: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${imageUrl}`
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  return `${baseUrl}${imageUrl}`
}
