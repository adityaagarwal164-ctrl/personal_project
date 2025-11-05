#!/usr/bin/env node

/**
 * Test OG Image Generation Script
 * 
 * This script tests the OG image generation system to ensure it's working correctly.
 * 
 * Usage:
 *   node scripts/test-og-generation.js
 *   npm run test-og (if added to package.json scripts)
 */

const http = require('http')
const fs = require('fs')
const path = require('path')

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const previewsDir = path.join(process.cwd(), 'public', 'previews')

console.log('🧪 Testing OG Image Generation System\n')
console.log(`Base URL: ${BASE_URL}\n`)

// Test cases
const testCases = [
  {
    name: 'Simple Blog Post',
    params: {
      id: 'test-blog-1',
      title: 'Test Blog Post',
      desc: 'This is a test description for the blog post',
      author: 'Test Author',
      category: 'Testing'
    }
  },
  {
    name: 'Tool Page',
    params: {
      id: 'test-tool-slack',
      title: 'Slack',
      desc: 'Team collaboration platform',
      category: 'Communication'
    }
  },
  {
    name: 'Simple Page',
    params: {
      id: 'test-page',
      title: 'Simple Test Page',
      desc: 'Testing basic functionality'
    }
  },
  {
    name: 'Long Title',
    params: {
      id: 'test-long',
      title: 'This is a very long title that should be wrapped across multiple lines to test the word wrapping functionality',
      desc: 'Testing word wrap'
    }
  },
  {
    name: 'Special Characters',
    params: {
      id: 'test-special',
      title: 'Test & Special <Characters>',
      desc: 'Testing "quotes" and \'apostrophes\' & ampersands'
    }
  }
]

async function testOGGeneration(testCase) {
  const { name, params } = testCase
  
  console.log(`📝 Test: ${name}`)
  console.log(`   ID: ${params.id}`)
  
  try {
    // Build URL
    const queryParams = new URLSearchParams(params)
    const url = `${BASE_URL}/api/og?${queryParams.toString()}`
    
    console.log(`   Requesting: /api/og?${queryParams.toString()}`)
    
    // Make request
    const response = await fetch(url)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error || 'Unknown error'}`)
    }
    
    if (!data.success) {
      throw new Error(data.error || 'API returned success: false')
    }
    
    // Check if file exists
    const imagePath = path.join(previewsDir, `${params.id}.png`)
    const fileExists = fs.existsSync(imagePath)
    
    if (!fileExists) {
      throw new Error('Image file was not created')
    }
    
    // Get file size
    const stats = fs.statSync(imagePath)
    const fileSizeKB = (stats.size / 1024).toFixed(2)
    
    console.log(`   ✅ Success!`)
    console.log(`   URL: ${data.url}`)
    console.log(`   Cached: ${data.cached ? 'Yes' : 'No'}`)
    console.log(`   File size: ${fileSizeKB} KB`)
    console.log(`   Path: ${imagePath}`)
    console.log('')
    
    return { success: true, testCase: name, data }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`)
    console.log('')
    return { success: false, testCase: name, error: error.message }
  }
}

async function testCacheAPI() {
  console.log('📦 Testing Cache Management API\n')
  
  try {
    // List cached images
    console.log('   Listing cached images...')
    const listResponse = await fetch(`${BASE_URL}/api/og-cache`)
    const listData = await listResponse.json()
    
    if (!listData.success) {
      throw new Error('Failed to list cached images')
    }
    
    console.log(`   ✅ Found ${listData.count} cached images`)
    
    // Check specific image
    if (listData.images && listData.images.length > 0) {
      const firstImage = listData.images[0]
      console.log(`   Checking image: ${firstImage.id}`)
      
      const checkResponse = await fetch(`${BASE_URL}/api/og-cache?action=check&id=${firstImage.id}`)
      const checkData = await checkResponse.json()
      
      if (checkData.success && checkData.exists) {
        console.log(`   ✅ Image exists: ${firstImage.id}`)
      } else {
        console.log(`   ❌ Image check failed`)
      }
    }
    
    console.log('')
    return { success: true }
  } catch (error) {
    console.log(`   ❌ Cache API test failed: ${error.message}`)
    console.log('')
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('━'.repeat(60))
  console.log('\n🚀 Starting OG Image Generation Tests\n')
  console.log('━'.repeat(60))
  console.log('')
  
  // Check if server is running
  console.log('🔍 Checking if server is running...')
  try {
    const response = await fetch(BASE_URL)
    if (response.ok) {
      console.log(`✅ Server is running at ${BASE_URL}\n`)
    } else {
      console.log(`⚠️  Server responded with status ${response.status}\n`)
    }
  } catch (error) {
    console.log(`❌ Cannot connect to server at ${BASE_URL}`)
    console.log(`   Please start the server with: npm run dev\n`)
    process.exit(1)
  }
  
  // Check previews directory
  console.log('📁 Checking previews directory...')
  if (!fs.existsSync(previewsDir)) {
    console.log(`❌ Previews directory does not exist: ${previewsDir}`)
    console.log('   Creating directory...')
    fs.mkdirSync(previewsDir, { recursive: true })
    console.log('   ✅ Directory created\n')
  } else {
    console.log(`✅ Previews directory exists\n`)
  }
  
  console.log('━'.repeat(60))
  console.log('\n🎨 Running Image Generation Tests\n')
  console.log('━'.repeat(60))
  console.log('')
  
  // Run all test cases
  const results = []
  for (const testCase of testCases) {
    const result = await testOGGeneration(testCase)
    results.push(result)
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log('━'.repeat(60))
  console.log('\n📊 Test Cache Management\n')
  console.log('━'.repeat(60))
  console.log('')
  
  const cacheResult = await testCacheAPI()
  
  console.log('━'.repeat(60))
  console.log('\n📈 Test Results Summary\n')
  console.log('━'.repeat(60))
  console.log('')
  
  const passed = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  
  console.log(`Total Tests: ${results.length}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  
  if (failed > 0) {
    console.log('\nFailed Tests:')
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • ${r.testCase}: ${r.error}`)
    })
  }
  
  console.log('')
  console.log('━'.repeat(60))
  console.log('')
  
  if (failed === 0 && cacheResult.success) {
    console.log('🎉 All tests passed! OG image generation is working correctly.\n')
    process.exit(0)
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.\n')
    process.exit(1)
  }
}

// Polyfill fetch for Node.js if needed
if (typeof fetch === 'undefined') {
  global.fetch = async (url, options = {}) => {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url)
      const protocol = urlObj.protocol === 'https:' ? require('https') : http
      
      const req = protocol.request(url, options, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            statusText: res.statusMessage,
            json: async () => JSON.parse(data),
            text: async () => data
          })
        })
      })
      
      req.on('error', reject)
      req.end()
    })
  }
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test runner error:', error)
  process.exit(1)
})
