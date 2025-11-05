import { NextApiRequest, NextApiResponse } from 'next'
import { ogImageGenerator } from '@/lib/ogImageGenerator'

/**
 * Dynamic Open Graph Image Generator API
 * 
 * Endpoint: /api/og
 * 
 * Query Parameters:
 * - id: Unique identifier for caching (required)
 * - title: Page/Post title (required)
 * - desc: Description text (optional)
 * - author: Author name (optional)
 * - category: Category tag (optional)
 * - siteName: Site name (default: "SaaSPilot")
 * - regenerate: Force regeneration (optional, "true" to regenerate)
 * 
 * Example:
 * /api/og?id=blog-1&title=My Blog Post&desc=This is a great post&author=John Doe
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { 
      id, 
      title, 
      desc, 
      author, 
      category, 
      siteName,
      regenerate 
    } = req.query

    // Validate required parameters
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ 
        error: 'Missing required parameter: id',
        usage: '/api/og?id={id}&title={title}&desc={description}'
      })
    }

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ 
        error: 'Missing required parameter: title',
        usage: '/api/og?id={id}&title={title}&desc={description}'
      })
    }

    // Check if we should force regeneration
    const shouldRegenerate = regenerate === 'true'
    
    if (shouldRegenerate) {
      ogImageGenerator.deleteImage(id)
    }

    // Check if cached image exists
    if (ogImageGenerator.imageExists(id) && !shouldRegenerate) {
      const imageUrl = `/previews/${id}.png`
      return res.status(200).json({ 
        success: true,
        url: imageUrl,
        cached: true 
      })
    }

    // Generate and save the image
    const imageUrl = await ogImageGenerator.generateAndSave(id, {
      title,
      description: typeof desc === 'string' ? desc : undefined,
      author: typeof author === 'string' ? author : undefined,
      category: typeof category === 'string' ? category : undefined,
      siteName: typeof siteName === 'string' ? siteName : 'SaaSPilot',
    })

    return res.status(200).json({ 
      success: true,
      url: imageUrl,
      cached: false,
      generated: new Date().toISOString()
    })
  } catch (error) {
    console.error('[OG API] Error generating image:', error)
    
    return res.status(500).json({ 
      error: 'Failed to generate Open Graph image',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

/**
 * API Configuration
 * Disable body parser for this API route
 */
export const config = {
  api: {
    bodyParser: false,
  },
}
