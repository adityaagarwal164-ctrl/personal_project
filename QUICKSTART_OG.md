# OG Image Generator - Quick Start Guide

Get started with automatic Open Graph image generation in 3 minutes.

## 🚀 Quick Start

### Step 1: Use in Your Components

Simply add these props to the `SEO` component:

```tsx
import SEO from '@/components/SEO'

function MyPage() {
  return (
    <>
      <SEO 
        title="My Awesome Page"
        description="This page is amazing"
        ogImageId="my-page"  // 👈 Add this
      />
      {/* Your content */}
    </>
  )
}
```

That's it! The OG image will be automatically generated when someone shares your page.

### Step 2: Test It

1. Start your dev server: `npm run dev`
2. Visit: `http://localhost:3000/og-demo`
3. Play with the interactive demo

### Step 3: Verify

Check the generated image:
1. Visit your page
2. View page source
3. Look for: `<meta property="og:image" content="/previews/my-page.png" />`
4. Open that image URL in your browser

## 📋 Common Use Cases

### Blog Post

```tsx
<SEO 
  title={post.title}
  description={post.excerpt}
  ogImageId={`blog-${post.id}`}
  ogImageAuthor={post.author}
  ogImageCategory={post.category}
/>
```

### Product/Tool Page

```tsx
<SEO 
  title={tool.name}
  description={tool.description}
  ogImageId={`tool-${tool.slug}`}
  ogImageCategory={tool.category}
/>
```

### Static Page

```tsx
<SEO 
  title="About Us"
  description="Learn about our company"
  ogImageId="page-about"
/>
```

## 🎨 Direct API Access

Generate images programmatically:

```typescript
// Generate via API
const response = await fetch('/api/og?id=my-id&title=My Title&desc=Description')
const data = await response.json()
console.log(data.url) // "/previews/my-id.png"

// Check cache
const cacheResponse = await fetch('/api/og-cache?action=check&id=my-id')
const cacheData = await cacheResponse.json()
console.log(cacheData.exists) // true/false
```

## 🔧 Configuration

### Custom ID Patterns

Use consistent naming:
- Blog: `blog-{id}` → `blog-1`, `blog-2`
- Tools: `tool-{slug}` → `tool-slack`, `tool-notion`
- Pages: `page-{name}` → `page-about`, `page-contact`

### Force Regeneration

```tsx
// In code
<SEO 
  title="Updated Title"
  ogImageId="blog-1"
  // Add regenerate=true to API URL manually, or delete cache file
/>

// Via API
fetch('/api/og?id=blog-1&title=Updated&regenerate=true')

// Via script
npm run clear-og-cache
```

## 📂 File Locations

- **Generated Images**: `public/previews/*.png`
- **API Endpoint**: `src/pages/api/og.ts`
- **Generator Logic**: `src/lib/ogImageGenerator.ts`
- **Helper Functions**: `src/lib/ogImageHelper.ts`
- **Demo Page**: `src/pages/og-demo.tsx` (visit `/og-demo`)

## ⚙️ Available Scripts

```bash
# Clear all cached images
npm run clear-og-cache

# Start dev server and test
npm run dev
# Then visit: http://localhost:3000/og-demo
```

## 🧪 Testing

### Test with Meta Tag Debugger Tools:

1. **Facebook**: https://developers.facebook.com/tools/debug/
2. **Twitter**: https://cards-validator.twitter.com/
3. **LinkedIn**: https://www.linkedin.com/post-inspector/

### Local Testing:

```bash
# 1. Generate an image
curl "http://localhost:3000/api/og?id=test&title=Test%20Title"

# 2. View the image
# Open: http://localhost:3000/previews/test.png

# 3. Check cache
curl "http://localhost:3000/api/og-cache?action=check&id=test"
```

## 🎯 Tips

1. **Keep IDs unique**: Each page should have a unique `ogImageId`
2. **Concise titles**: 60 characters or less for best results
3. **Short descriptions**: 2 lines maximum (auto-truncated)
4. **Cache is automatic**: Images only generate once per ID
5. **Use the demo**: Visit `/og-demo` to test different configurations

## 🐛 Troubleshooting

### Image not generating?

1. Check console for errors
2. Visit `/api/og?id=test&title=Test` directly
3. Verify `public/previews/` folder exists
4. Check file permissions

### Image looks wrong?

1. Visit `/og-demo` to preview
2. Adjust title/description length
3. Test with different content

### Need to update an image?

```bash
# Option 1: Clear specific image
# Delete: public/previews/your-id.png

# Option 2: Clear all cache
npm run clear-og-cache

# Option 3: Force regenerate via API
# Add ?regenerate=true to API call
```

## 📚 More Help

- **Full Documentation**: See `OG_IMAGE_GENERATOR.md`
- **Interactive Demo**: Visit `/og-demo` page
- **API Reference**: See comments in `src/pages/api/og.ts`

## 🎉 You're Ready!

Start adding `ogImageId` to your pages and watch the magic happen! ✨
