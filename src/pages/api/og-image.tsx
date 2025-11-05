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
    const hasHalfStar = rating % 1 >= 0.5
    const stars = '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(5 - Math.ceil(rating))
    
    // Truncate overview to fit
    const truncatedOverview = overview.length > 120 ? overview.substring(0, 120) + '...' : overview
    
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#4f46e5;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Background -->
        <rect width="100%" height="100%" fill="url(#grad)"/>
        
        <!-- Pattern overlay -->
        <rect width="100%" height="100%" fill="url(#pattern)" opacity="0.1"/>
        
        <!-- Content container -->
        <rect x="60" y="60" width="1080" height="510" rx="20" fill="white" opacity="0.95" filter="url(#shadow)"/>
        
        <!-- Tool name -->
        <text x="600" y="180" text-anchor="middle" fill="#1e293b" font-size="72" font-weight="bold" font-family="system-ui, -apple-system, sans-serif">
          ${toolName}
        </text>
        
        <!-- Overview -->
        <text x="600" y="260" text-anchor="middle" fill="#475569" font-size="28" font-family="system-ui, sans-serif">
          <tspan x="600" dy="0">${truncatedOverview.substring(0, 60)}</tspan>
          ${truncatedOverview.length > 60 ? `<tspan x="600" dy="35">${truncatedOverview.substring(60)}</tspan>` : ''}
        </text>
        
        <!-- Rating -->
        <text x="600" y="380" text-anchor="middle" fill="#fbbf24" font-size="56" font-family="system-ui, sans-serif">
          ${stars}
        </text>
        <text x="600" y="420" text-anchor="middle" fill="#64748b" font-size="32" font-family="system-ui, sans-serif">
          ${rating.toFixed(1)} / 5.0
        </text>
        
        <!-- Site name -->
        <text x="600" y="510" text-anchor="middle" fill="#3b82f6" font-size="36" font-weight="600" font-family="system-ui, sans-serif">
          SaaSPilot.com
        </text>
      </svg>
    `

    res.setHeader('Content-Type', 'image/svg+xml')
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
    return res.status(200).send(svg)
  } catch (error) {
    console.error('OG Image generation error:', error)
    return res.status(500).json({ error: 'Failed to generate image' })
  }
}
