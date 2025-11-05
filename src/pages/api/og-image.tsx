import { NextApiRequest, NextApiResponse } from 'next'
import { SEED_TOOLS } from '@/lib/seedData'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { slug } = req.query

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ error: 'Slug is required' })
    }

    // Get tool data from seed data  
    const tool = SEED_TOOLS.find(t => t.slug === slug)
    
    const width = 1200
    const height = 630
    const toolName = tool?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    const rating = tool?.averageRating || 0
    const overview = tool?.overview || 'Discover and review SaaS tools'
    
    // Generate star rating display
    const fullStars = Math.floor(rating)
    const emptyStars = 5 - fullStars
    const stars = '★'.repeat(fullStars) + '☆'.repeat(emptyStars)
    
    // Escape special characters for SVG
    const escapeXml = (str: string) => str.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case '&': return '&amp;'
        case "'": return '&apos;'
        case '"': return '&quot;'
        default: return c
      }
    })
    
    // Split overview into lines (max 90 chars per line)
    const maxCharsPerLine = 90
    const words = overview.split(' ')
    const lines: string[] = []
    let currentLine = ''
    
    for (const word of words) {
      if ((currentLine + ' ' + word).length > maxCharsPerLine && currentLine) {
        lines.push(currentLine.trim())
        currentLine = word
        if (lines.length >= 2) break // Max 2 lines
      } else {
        currentLine += (currentLine ? ' ' : '') + word
      }
    }
    if (currentLine && lines.length < 2) {
      lines.push(currentLine.trim())
    }
    if (lines.length === 2 && words.length > lines.join(' ').split(' ').length) {
      lines[1] = lines[1].substring(0, maxCharsPerLine - 3) + '...'
    }
    
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#4f46e5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="10"/>
          <feOffset dx="0" dy="10" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#grad)"/>
      
      <!-- Content container -->
      <rect x="60" y="60" width="1080" height="510" rx="20" fill="white" opacity="0.97" filter="url(#shadow)"/>
      
      <!-- Tool name -->
      <text x="600" y="160" text-anchor="middle" fill="#1e293b" font-size="68" font-weight="bold" font-family="Arial, -apple-system, BlinkMacSystemFont, sans-serif">
        ${escapeXml(toolName)}
      </text>
      
      <!-- Overview line 1 -->
      ${lines[0] ? `<text x="600" y="260" text-anchor="middle" fill="#475569" font-size="26" font-family="Arial, sans-serif">
        ${escapeXml(lines[0])}
      </text>` : ''}
      
      <!-- Overview line 2 -->
      ${lines[1] ? `<text x="600" y="295" text-anchor="middle" fill="#475569" font-size="26" font-family="Arial, sans-serif">
        ${escapeXml(lines[1])}
      </text>` : ''}
      
      <!-- Star rating -->
      <text x="600" y="400" text-anchor="middle" fill="#fbbf24" font-size="54" font-family="Arial, sans-serif">
        ${stars}
      </text>
      
      <!-- Rating number -->
      <text x="600" y="455" text-anchor="middle" fill="#64748b" font-size="30" font-family="Arial, sans-serif">
        ${rating.toFixed(1)} / 5.0
      </text>
      
      <!-- Site name -->
      <text x="600" y="530" text-anchor="middle" fill="#3b82f6" font-size="34" font-weight="bold" font-family="Arial, sans-serif">
        SaaSPilot.com
      </text>
    </svg>`
    
    res.setHeader('Content-Type', 'image/svg+xml')
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
    return res.status(200).send(svg)
  } catch (error) {
    console.error('OG Image generation error:', error)
    return res.status(500).json({ error: 'Failed to generate image' })
  }
}
