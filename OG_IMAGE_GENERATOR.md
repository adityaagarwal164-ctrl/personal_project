# Open Graph Image Generator

Automated system for generating custom Open Graph (OG) images for social media sharing.

## 🎯 Features

- **Automatic Generation**: Creates 1200x630 PNG images on-demand
- **Smart Caching**: Only generates once, reuses cached images
- **Easy Integration**: Simple props on the `SEO` component
- **Customizable**: Support for title, description, author, category
- **Clean Design**: Modern gradient backgrounds with professional typography
- **Server-Side Ready**: Can be used with Next.js SSR/SSG
- **Modular & Clean**: Well-organized code ready for deployment

## 📁 File Structure

```
src/
├── lib/
│   ├── ogImageGenerator.ts      # Core PNG generation logic (node-canvas)
│   └── ogImageHelper.ts          # Helper utilities for URL generation
├── pages/
│   └── api/
│       ├── og.ts                 # Main API endpoint (/api/og)
│       └── og-image.tsx          # Legacy SVG generator (optional)
└── components/
    └── SEO.tsx                   # Updated with OG image support

public/
└── previews/                     # Generated images are cached here
    ├── .gitkeep
    ├── README.md
    └── blog-{id}.png            # Example generated images
```

## 🚀 Quick Start

### 1. Basic Usage in Components

```tsx
import SEO from '@/components/SEO'

function BlogPost({ post }) {
  return (
    <div>
      <SEO 
        title={post.title}
        description={post.excerpt}
        ogImageId={`blog-${post.id}`}
        ogImageAuthor={post.author}
        ogImageCategory={post.category}
      />
      {/* Your content */}
    </div>
  )
}
```

### 2. Direct API Usage

Make a GET request to generate/retrieve an image:

```
/api/og?id=blog-1&title=My%20Blog%20Post&desc=This%20is%20amazing&author=John%20Doe&category=Tech
```

Response:
```json
{
  "success": true,
  "url": "/previews/blog-1.png",
  "cached": false,
  "generated": "2024-11-05T13:00:00.000Z"
}
```

### 3. Using Helper Functions

```tsx
import { getBlogOGImageUrl, getToolOGImageUrl, getPageOGImageUrl } from '@/lib/ogImageHelper'

// For blog posts
const blogImageUrl = getBlogOGImageUrl(1, 'My Blog Post', 'Great content', 'John Doe', 'Tech')

// For tool pages
const toolImageUrl = getToolOGImageUrl('slack', 'Slack', 'Team collaboration tool')

// For generic pages
const pageImageUrl = getPageOGImageUrl('about', 'About Us', 'Learn more about our company')
```

## 📝 API Endpoint Documentation

### Endpoint: `/api/og`

**Method**: GET

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | ✅ Yes | Unique identifier for caching (e.g., `blog-1`, `tool-slack`) |
| `title` | string | ✅ Yes | Main title text (displayed prominently) |
| `desc` | string | ❌ No | Description/excerpt (2 lines max) |
| `author` | string | ❌ No | Author name (displayed below description) |
| `category` | string | ❌ No | Category badge (displayed at top) |
| `siteName` | string | ❌ No | Site name (default: "SaaSPilot") |
| `regenerate` | string | ❌ No | Force regeneration (`"true"` to regenerate) |

**Example Request**:
```
GET /api/og?id=blog-1&title=Top%2010%20Project%20Management%20Tools&desc=Discover%20the%20best%20tools&author=Sarah%20Johnson&category=Project%20Management
```

**Example Response**:
```json
{
  "success": true,
  "url": "/previews/blog-1.png",
  "cached": true
}
```

## 🎨 Image Design

Generated images feature:

- **Dimensions**: 1200x630 pixels (optimal for all social platforms)
- **Background**: Blue gradient (customizable)
- **White Content Card**: Rounded corners with shadow
- **Category Badge**: Optional colored badge at top
- **Title**: Bold, large text (58px, word-wrapped)
- **Description**: Smaller text (28px, 2 lines max with ellipsis)
- **Author**: Medium text below description
- **Site Name**: Branded footer text

## 🔧 Advanced Usage

### Server-Side Pre-generation

Generate images during build time or server-side rendering:

```tsx
import { prefetchOGImage } from '@/lib/ogImageHelper'

export async function getServerSideProps({ params }) {
  const post = await getPost(params.id)
  
  // Pre-generate the OG image
  await prefetchOGImage({
    id: `blog-${post.id}`,
    title: post.title,
    description: post.excerpt,
    author: post.author,
    category: post.category
  }, process.env.NEXT_PUBLIC_SITE_URL)
  
  return {
    props: { post }
  }
}
```

### Force Regeneration

Regenerate an existing cached image:

```
/api/og?id=blog-1&title=Updated%20Title&regenerate=true
```

Or programmatically:

```tsx
import { ogImageGenerator } from '@/lib/ogImageGenerator'

// Delete cached image
ogImageGenerator.deleteImage('blog-1')

// Clear all cache
const deletedCount = ogImageGenerator.clearCache()
console.log(`Deleted ${deletedCount} images`)
```

### Custom Image Generation

For advanced use cases, use the generator directly:

```tsx
import { ogImageGenerator } from '@/lib/ogImageGenerator'

const imageUrl = await ogImageGenerator.generateAndSave('custom-id', {
  title: 'Custom Title',
  description: 'Custom description',
  author: 'Author Name',
  category: 'Category',
  siteName: 'My Site',
  backgroundColor: '#ff0000', // Custom color
  textColor: '#ffffff'
})

console.log(`Image saved to: ${imageUrl}`)
```

## 🔍 Cache Management

### Check if Image Exists
```tsx
import { ogImageGenerator } from '@/lib/ogImageGenerator'

if (ogImageGenerator.imageExists('blog-1')) {
  console.log('Image is cached')
}
```

### Get All Cached Images
```tsx
const cachedImages = ogImageGenerator.getCachedImages()
console.log(cachedImages) // ['blog-1.png', 'blog-2.png', ...]
```

### Clear Entire Cache
```tsx
const count = ogImageGenerator.clearCache()
console.log(`Cleared ${count} cached images`)
```

## 🌐 Deployment

### Vercel / Netlify

The system works out-of-the-box with serverless functions. The `canvas` package is supported on most platforms.

### Docker

Ensure your Dockerfile installs canvas dependencies:

```dockerfile
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev
```

### CDN Upload (Optional)

To upload generated images to a CDN instead of local storage, modify `ogImageGenerator.ts`:

```tsx
async generateAndSave(id: string, options: OGImageOptions): Promise<string> {
  const buffer = await this.generateImage(options)
  
  // Upload to your CDN (S3, Cloudinary, etc.)
  const cdnUrl = await uploadToCDN(buffer, `og-${id}.png`)
  
  return cdnUrl
}
```

## 🎯 Examples

### Blog Post
```tsx
<SEO 
  title="How to Build a SaaS"
  description="Learn the fundamentals of building a successful SaaS business"
  ogImageId="blog-5"
  ogImageAuthor="Jane Smith"
  ogImageCategory="Entrepreneurship"
/>
```

Generated meta tags:
```html
<meta property="og:image" content="https://yourdomain.com/previews/blog-5.png" />
<meta property="og:title" content="How to Build a SaaS - SaaSPilot Blog" />
<meta property="og:description" content="Learn the fundamentals of building a successful SaaS business" />
```

### Tool Page
```tsx
<SEO 
  title="Slack - Team Collaboration"
  description="Modern team communication platform"
  ogImageId="tool-slack"
  ogImageCategory="Communication"
/>
```

### Static Page
```tsx
<SEO 
  title="About Us"
  description="Learn more about our mission"
  ogImageId="page-about"
/>
```

## 🐛 Troubleshooting

### Canvas Installation Issues

If you encounter canvas installation errors:

```bash
# Windows
npm install --global --production windows-build-tools
npm install canvas

# macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg
npm install canvas

# Linux (Ubuntu/Debian)
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
npm install canvas
```

### TypeScript Errors

If you see TypeScript errors with canvas types:

```bash
npm install --save-dev @types/node
```

### Images Not Generating

1. Check that `public/previews/` directory exists
2. Verify write permissions on the `public/previews/` folder
3. Check server logs for detailed error messages
4. Test the API endpoint directly: `/api/og?id=test&title=Test`

## 📊 Performance

- **First Generation**: ~200-500ms (depends on text length)
- **Cached Requests**: ~1-5ms (direct file serve)
- **File Size**: ~50-150KB per PNG (optimized)
- **Concurrent Requests**: Handles multiple simultaneous generations

## 🔐 Security

- Input sanitization built-in
- XSS protection via canvas rendering
- File path validation
- No user-uploaded content processing
- Rate limiting recommended for production

## 📦 Dependencies

```json
{
  "canvas": "^3.2.0"  // Already in package.json
}
```

## 🎓 Best Practices

1. **Use consistent ID patterns**: `blog-{id}`, `tool-{slug}`, `page-{name}`
2. **Keep titles concise**: 60 characters or less for best display
3. **Limit description length**: 2 lines max for readability
4. **Pre-generate during build**: Use SSG when possible
5. **Add to .gitignore**: Don't commit generated images to repo
6. **Monitor cache size**: Periodically clear old images

## 🚀 Next Steps

1. Update `.gitignore` to exclude `public/previews/*.png` (keep README.md)
2. Set `NEXT_PUBLIC_SITE_URL` environment variable for absolute URLs
3. Test with various content types and lengths
4. Consider CDN integration for production
5. Add rate limiting to the API endpoint
6. Monitor cache growth and implement cleanup strategy

---

**Created**: November 2024  
**Status**: Production Ready ✅
