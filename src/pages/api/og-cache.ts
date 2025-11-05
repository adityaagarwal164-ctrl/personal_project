import { NextApiRequest, NextApiResponse } from 'next'
import { ogImageGenerator } from '@/lib/ogImageGenerator'

/**
 * OG Image Cache Management API
 * 
 * GET /api/og-cache - List all cached images
 * GET /api/og-cache?action=clear - Clear all cached images
 * GET /api/og-cache?action=check&id={id} - Check if specific image exists
 * DELETE /api/og-cache?id={id} - Delete specific cached image
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { action, id } = req.query

    // DELETE: Remove specific image
    if (req.method === 'DELETE' && id && typeof id === 'string') {
      const deleted = ogImageGenerator.deleteImage(id)
      return res.status(200).json({
        success: deleted,
        message: deleted ? `Deleted image: ${id}` : `Image not found: ${id}`,
        id
      })
    }

    // GET: Various actions
    if (req.method === 'GET') {
      // Clear all cache
      if (action === 'clear') {
        const count = ogImageGenerator.clearCache()
        return res.status(200).json({
          success: true,
          message: `Cleared ${count} cached images`,
          count
        })
      }

      // Check specific image
      if (action === 'check' && id && typeof id === 'string') {
        const exists = ogImageGenerator.imageExists(id)
        return res.status(200).json({
          success: true,
          id,
          exists,
          url: exists ? `/previews/${id}.png` : null
        })
      }

      // List all cached images
      const cachedImages = ogImageGenerator.getCachedImages()
      return res.status(200).json({
        success: true,
        count: cachedImages.length,
        images: cachedImages.map(filename => ({
          filename,
          id: filename.replace('.png', ''),
          url: `/previews/${filename}`
        }))
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('[OG Cache API] Error:', error)
    return res.status(500).json({
      error: 'Failed to manage cache',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
