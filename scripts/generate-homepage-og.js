#!/usr/bin/env node

/**
 * Generate Homepage OG Image
 * Simple script to create ONE preview image for your homepage
 */

const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path')

// Your site details
const SITE_NAME = 'SaaSPilot'
const SITE_TAGLINE = 'Discover Top SaaS Tools & Reviews'
const SITE_DESCRIPTION = 'Find, compare, and review the best software tools for your business'

// Image dimensions (social media standard)
const WIDTH = 1200
const HEIGHT = 630

console.log('🎨 Generating homepage OG image...\n')

// Create canvas
const canvas = createCanvas(WIDTH, HEIGHT)
const ctx = canvas.getContext('2d')

// Draw gradient background
const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
gradient.addColorStop(0, '#3b82f6')
gradient.addColorStop(0.5, '#4f46e5')
gradient.addColorStop(1, '#1e40af')
ctx.fillStyle = gradient
ctx.fillRect(0, 0, WIDTH, HEIGHT)

// Draw white card with shadow
ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
ctx.shadowBlur = 20
ctx.shadowOffsetX = 0
ctx.shadowOffsetY = 10
ctx.fillStyle = 'rgba(255, 255, 255, 0.97)'
roundRect(ctx, 60, 60, 1080, 510, 20)
ctx.shadowColor = 'transparent'

// Draw site name
ctx.fillStyle = '#1e293b'
ctx.font = 'bold 72px Arial, sans-serif'
ctx.textAlign = 'center'
ctx.fillText(SITE_NAME, 600, 200)

// Draw tagline
ctx.fillStyle = '#3b82f6'
ctx.font = 'bold 42px Arial, sans-serif'
ctx.fillText(SITE_TAGLINE, 600, 280)

// Draw description
ctx.fillStyle = '#475569'
ctx.font = '32px Arial, sans-serif'
wrapText(ctx, SITE_DESCRIPTION, 600, 360, 1000, 50)

// Draw footer
ctx.fillStyle = '#94a3b8'
ctx.font = '28px Arial, sans-serif'
ctx.fillText('Your trusted SaaS discovery platform', 600, 500)

// Save image
const outputPath = path.join(process.cwd(), 'public', 'og-image.png')
const buffer = canvas.toBuffer('image/png')
fs.writeFileSync(outputPath, buffer)

console.log('✅ Homepage OG image generated!')
console.log(`📁 Saved to: ${outputPath}`)
console.log(`📊 Size: ${(buffer.length / 1024).toFixed(2)} KB`)
console.log(`📐 Dimensions: ${WIDTH}x${HEIGHT}px`)
console.log('\n🎉 Done! Add this to your homepage meta tags:')
console.log('<meta property="og:image" content="https://yourdomain.com/og-image.png" />\n')

// Helper functions
function roundRect(ctx, x, y, width, height, radius) {
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

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' '
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, y)
      line = words[i] + ' '
      y += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, y)
}
