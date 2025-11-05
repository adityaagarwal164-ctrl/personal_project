#!/usr/bin/env node

/**
 * Clear OG Image Cache Script
 * 
 * Usage:
 *   node scripts/clear-og-cache.js
 *   npm run clear-og-cache (if added to package.json scripts)
 */

const fs = require('fs')
const path = require('path')

const previewsDir = path.join(process.cwd(), 'public', 'previews')

console.log('🧹 Clearing OG Image Cache...\n')
console.log(`Directory: ${previewsDir}\n`)

if (!fs.existsSync(previewsDir)) {
  console.log('❌ Previews directory does not exist.')
  process.exit(1)
}

const files = fs.readdirSync(previewsDir)
const pngFiles = files.filter(file => file.endsWith('.png'))

if (pngFiles.length === 0) {
  console.log('✅ No cached images found. Cache is already empty.')
  process.exit(0)
}

console.log(`Found ${pngFiles.length} cached images:\n`)
pngFiles.forEach((file, index) => {
  console.log(`  ${index + 1}. ${file}`)
})

console.log('\n🗑️  Deleting...\n')

let deletedCount = 0
pngFiles.forEach(file => {
  try {
    fs.unlinkSync(path.join(previewsDir, file))
    deletedCount++
    console.log(`  ✓ Deleted: ${file}`)
  } catch (error) {
    console.error(`  ✗ Failed to delete: ${file}`, error.message)
  }
})

console.log(`\n✅ Successfully deleted ${deletedCount} of ${pngFiles.length} images.`)
console.log('🎉 Cache cleared!\n')
