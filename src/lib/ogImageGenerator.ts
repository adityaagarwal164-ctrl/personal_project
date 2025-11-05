import { createCanvas, loadImage, registerFont, CanvasRenderingContext2D as NodeCanvasRenderingContext2D } from 'canvas'
import fs from 'fs'
import path from 'path'

export interface OGImageOptions {
  title: string
  description?: string
  author?: string
  category?: string
  siteName?: string
  logoPath?: string
  backgroundColor?: string
  textColor?: string
}

export class OGImageGenerator {
  private readonly width = 1200
  private readonly height = 630
  private readonly previewsDir: string

  constructor() {
    // Set previews directory path
    this.previewsDir = path.join(process.cwd(), 'public', 'previews')
    
    // Ensure previews directory exists
    if (!fs.existsSync(this.previewsDir)) {
      fs.mkdirSync(this.previewsDir, { recursive: true })
    }
  }

  /**
   * Generate OG image and return the buffer
   */
  async generateImage(options: OGImageOptions): Promise<Buffer> {
    const {
      title,
      description = '',
      author = '',
      category = '',
      siteName = 'SaaSPilot',
      backgroundColor = '#3b82f6',
      textColor = '#ffffff',
    } = options

    // Create canvas
    const canvas = createCanvas(this.width, this.height)
    const ctx = canvas.getContext('2d')

    // Draw gradient background
    this.drawGradientBackground(ctx, backgroundColor)

    // Draw white content card with shadow
    this.drawContentCard(ctx)

    // Draw text content
    await this.drawContent(ctx, {
      title,
      description,
      author,
      category,
      siteName,
      textColor,
    })

    // Convert to PNG buffer
    return canvas.toBuffer('image/png')
  }

  /**
   * Generate and save OG image to file system
   */
  async generateAndSave(id: string, options: OGImageOptions): Promise<string> {
    const filename = `${id}.png`
    const filepath = path.join(this.previewsDir, filename)

    // Check if file already exists (caching)
    if (fs.existsSync(filepath)) {
      console.log(`[OG Image] Using cached image: ${filename}`)
      return `/previews/${filename}`
    }

    console.log(`[OG Image] Generating new image: ${filename}`)
    
    // Generate image
    const buffer = await this.generateImage(options)

    // Save to file system
    fs.writeFileSync(filepath, buffer)

    return `/previews/${filename}`
  }

  /**
   * Check if cached image exists
   */
  imageExists(id: string): boolean {
    const filepath = path.join(this.previewsDir, `${id}.png`)
    return fs.existsSync(filepath)
  }

  /**
   * Delete cached image
   */
  deleteImage(id: string): boolean {
    const filepath = path.join(this.previewsDir, `${id}.png`)
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
      return true
    }
    return false
  }

  /**
   * Draw gradient background
   */
  private drawGradientBackground(ctx: NodeCanvasRenderingContext2D, baseColor: string) {
    const gradient = ctx.createLinearGradient(0, 0, this.width, this.height)
    gradient.addColorStop(0, '#3b82f6')
    gradient.addColorStop(0.5, '#4f46e5')
    gradient.addColorStop(1, '#1e40af')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, this.width, this.height)
  }

  /**
   * Draw white content card with shadow
   */
  private drawContentCard(ctx: NodeCanvasRenderingContext2D) {
    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = 20
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 10

    // Card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.97)'
    this.roundRect(ctx, 60, 60, 1080, 510, 20)

    // Reset shadow
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
  }

  /**
   * Draw content (text, category, etc.)
   */
  private async drawContent(
    ctx: NodeCanvasRenderingContext2D,
    content: {
      title: string
      description: string
      author: string
      category: string
      siteName: string
      textColor: string
    }
  ) {
    const { title, description, author, category, siteName } = content

    // Set text properties
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    // Draw category badge if provided
    if (category) {
      ctx.fillStyle = '#dbeafe'
      this.roundRect(ctx, 500, 100, 200, 40, 20)
      ctx.fillStyle = '#1e40af'
      ctx.font = 'bold 20px Arial, sans-serif'
      ctx.fillText(category, 600, 110)
    }

    // Draw title (word wrap)
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 58px Arial, sans-serif'
    const titleY = category ? 170 : 130
    this.wrapText(ctx, title, 600, titleY, 1000, 70)

    // Draw description (word wrap)
    if (description) {
      ctx.fillStyle = '#475569'
      ctx.font = '28px Arial, sans-serif'
      const descY = category ? 300 : 280
      this.wrapText(ctx, description, 600, descY, 1000, 40, 2)
    }

    // Draw author if provided
    if (author) {
      ctx.fillStyle = '#64748b'
      ctx.font = '24px Arial, sans-serif'
      ctx.fillText(`By ${author}`, 600, 420)
    }

    // Draw site name/logo at bottom
    ctx.fillStyle = '#3b82f6'
    ctx.font = 'bold 36px Arial, sans-serif'
    ctx.fillText(siteName, 600, 500)
  }

  /**
   * Helper to draw rounded rectangle
   */
  private roundRect(
    ctx: NodeCanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    ctx.fill()
  }

  /**
   * Helper to wrap text across multiple lines
   */
  private wrapText(
    ctx: NodeCanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number = 3
  ) {
    const words = text.split(' ')
    let line = ''
    let lineCount = 0

    for (let i = 0; i < words.length && lineCount < maxLines; i++) {
      const testLine = line + words[i] + ' '
      const metrics = ctx.measureText(testLine)
      const testWidth = metrics.width

      if (testWidth > maxWidth && i > 0) {
        // Check if this is the last line we'll draw
        if (lineCount === maxLines - 1) {
          // Add ellipsis if there are more words
          const remainingWords = words.slice(i).join(' ')
          if (remainingWords.length > 0) {
            line = line.trim() + '...'
          }
          ctx.fillText(line, x, y)
          break
        }
        
        ctx.fillText(line, x, y)
        line = words[i] + ' '
        y += lineHeight
        lineCount++
      } else {
        line = testLine
      }
    }

    // Draw the last line if we haven't exceeded maxLines
    if (lineCount < maxLines && line.trim()) {
      ctx.fillText(line.trim(), x, y)
    }
  }

  /**
   * Get all cached images
   */
  getCachedImages(): string[] {
    if (!fs.existsSync(this.previewsDir)) {
      return []
    }
    return fs.readdirSync(this.previewsDir).filter(file => file.endsWith('.png'))
  }

  /**
   * Clear all cached images
   */
  clearCache(): number {
    const files = this.getCachedImages()
    files.forEach(file => {
      fs.unlinkSync(path.join(this.previewsDir, file))
    })
    return files.length
  }
}

// Export singleton instance
export const ogImageGenerator = new OGImageGenerator()
