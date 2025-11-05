import { NextApiRequest, NextApiResponse } from 'next'
import { SEED_TOOLS } from '@/lib/seedData'
import { createCanvas, registerFont } from 'canvas'

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
    
    // Create canvas
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#3b82f6')
    gradient.addColorStop(0.5, '#4f46e5')
    gradient.addColorStop(1, '#1e40af')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // White content box with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
    ctx.shadowBlur = 20
    ctx.shadowOffsetY = 10
    ctx.fillStyle = 'rgba(255, 255, 255, 0.97)'
    ctx.beginPath()
    ctx.roundRect(60, 60, 1080, 510, 20)
    ctx.fill()
    ctx.shadowColor = 'transparent'
    
    // Tool name
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 72px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(toolName, width / 2, 160)
    
    // Overview (wrap text)
    ctx.fillStyle = '#475569'
    ctx.font = '28px Arial, sans-serif'
    const maxWidth = 1000
    const words = overview.split(' ')
    let line = ''
    let y = 240
    const lineHeight = 40
    let lineCount = 0
    const maxLines = 3
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' '
      const metrics = ctx.measureText(testLine)
      
      if (metrics.width > maxWidth && i > 0) {
        if (lineCount < maxLines - 1) {
          ctx.fillText(line, width / 2, y)
          line = words[i] + ' '
          y += lineHeight
          lineCount++
        } else {
          ctx.fillText(line.trim() + '...', width / 2, y)
          break
        }
      } else {
        line = testLine
      }
    }
    if (lineCount < maxLines) {
      ctx.fillText(line, width / 2, y)
    }
    
    // Star rating
    ctx.fillStyle = '#fbbf24'
    ctx.font = '56px Arial, sans-serif'
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = '★'.repeat(fullStars) + (hasHalfStar ? '⯨' : '') + '☆'.repeat(5 - Math.ceil(rating))
    ctx.fillText(stars, width / 2, 400)
    
    // Rating number
    ctx.fillStyle = '#64748b'
    ctx.font = '32px Arial, sans-serif'
    ctx.fillText(`${rating.toFixed(1)} / 5.0`, width / 2, 450)
    
    // Site name
    ctx.fillStyle = '#3b82f6'
    ctx.font = 'bold 36px Arial, sans-serif'
    ctx.fillText('SaaSPilot.com', width / 2, 530)
    
    // Convert to PNG buffer
    const buffer = canvas.toBuffer('image/png')
    
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    return res.status(200).send(buffer)
  } catch (error) {
    console.error('OG Image generation error:', error)
    return res.status(500).json({ error: 'Failed to generate image' })
  }
}
