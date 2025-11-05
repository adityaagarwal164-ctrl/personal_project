# OG Image Generator - Deployment Checklist

Use this checklist to ensure the OG Image Generator is properly set up and ready for production.

## ✅ Pre-Deployment Checklist

### 1. Dependencies

- [ ] `canvas` package installed (`^3.2.0`)
- [ ] All TypeScript types installed
- [ ] No installation errors with canvas native dependencies

**Verify:**
```bash
npm list canvas
# Should show: canvas@3.2.0
```

### 2. Directory Structure

- [ ] `public/previews/` directory exists
- [ ] `.gitkeep` file present in `public/previews/`
- [ ] `README.md` file present in `public/previews/`
- [ ] `.gitignore` updated to exclude `*.png` files in previews

**Verify:**
```bash
ls -la public/previews/
# Should show: .gitkeep, README.md
```

### 3. Core Files

- [ ] `src/lib/ogImageGenerator.ts` - Image generator utility
- [ ] `src/lib/ogImageHelper.ts` - Helper functions
- [ ] `src/pages/api/og.ts` - Main API endpoint
- [ ] `src/pages/api/og-cache.ts` - Cache management API
- [ ] `src/components/SEO.tsx` - Updated with OG support
- [ ] `src/types/og-image.d.ts` - Type definitions

**Verify:**
```bash
# Check if all files exist
ls src/lib/ogImageGenerator.ts
ls src/lib/ogImageHelper.ts
ls src/pages/api/og.ts
ls src/pages/api/og-cache.ts
```

### 4. Environment Variables

- [ ] `NEXT_PUBLIC_SITE_URL` set in `.env.local` for development
- [ ] `NEXT_PUBLIC_SITE_URL` configured in production environment
- [ ] URL includes protocol (https://) and domain, no trailing slash

**Example `.env.local`:**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Example Production:**
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 5. Testing

- [ ] Development server runs without errors
- [ ] Demo page accessible at `/og-demo`
- [ ] Can generate test image via API
- [ ] Generated images appear in `public/previews/`
- [ ] Images are valid PNG files (1200x630)
- [ ] Cache system works correctly

**Test Commands:**
```bash
# Start dev server
npm run dev

# Visit demo page
# http://localhost:3000/og-demo

# Test API directly
curl "http://localhost:3000/api/og?id=test&title=Test%20Title"

# Check cache
curl "http://localhost:3000/api/og-cache"

# Run test script
node scripts/test-og-generation.js
```

### 6. Integration

- [ ] `SEO` component updated in blog posts
- [ ] Sample pages using new OG system
- [ ] Meta tags visible in page source
- [ ] OG images load correctly in browser

**Verify Meta Tags:**
```bash
# View source of a blog post and check for:
<meta property="og:image" content="https://yourdomain.com/previews/blog-1.png" />
```

### 7. Performance

- [ ] First image generation completes in < 1 second
- [ ] Cached images serve in < 10ms
- [ ] No memory leaks during generation
- [ ] Multiple simultaneous requests handled

**Test:**
```bash
# Generate multiple images
for i in {1..10}; do
  curl "http://localhost:3000/api/og?id=test-$i&title=Test%20$i" &
done
wait
```

## 🚀 Deployment Steps

### Step 1: Verify Build

```bash
# Clean build
rm -rf .next
npm run build

# Check for build errors
# Especially look for canvas-related errors
```

### Step 2: Platform-Specific Setup

#### **Vercel**

- [ ] Canvas dependencies automatically installed
- [ ] Environment variables set in Vercel dashboard
- [ ] Test deployment completes successfully

```bash
# Deploy to Vercel
vercel --prod
```

#### **Netlify**

- [ ] Add build command: `npm run build`
- [ ] Functions directory: `.netlify/functions` (if using Netlify Functions)
- [ ] Install canvas dependencies

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### **Docker**

- [ ] Dockerfile includes canvas dependencies
- [ ] Multi-stage build optimized
- [ ] Image size reasonable

```dockerfile
# Install canvas dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev
```

#### **Self-Hosted / VPS**

- [ ] Node.js version >= 18.x
- [ ] Canvas system dependencies installed
- [ ] File permissions correct for `public/previews/`
- [ ] Process manager configured (PM2, systemd)

```bash
# Ubuntu/Debian
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# CentOS/RHEL
sudo yum install cairo cairo-devel pango pango-devel libjpeg-turbo-devel giflib-devel

# macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

### Step 3: Post-Deployment Verification

- [ ] Visit production site
- [ ] Test OG image generation on production
- [ ] Verify with Facebook Debugger: https://developers.facebook.com/tools/debug/
- [ ] Verify with Twitter Card Validator: https://cards-validator.twitter.com/
- [ ] Check LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- [ ] Test mobile sharing (WhatsApp, Telegram, etc.)

**Production Test:**
```bash
# Replace with your domain
curl "https://yourdomain.com/api/og?id=prod-test&title=Production%20Test"

# Check if image exists
curl -I "https://yourdomain.com/previews/prod-test.png"
```

### Step 4: Monitoring

- [ ] Set up error logging for API routes
- [ ] Monitor cache size growth
- [ ] Track generation times
- [ ] Alert on failures

**Recommended Monitoring:**
```javascript
// In src/pages/api/og.ts
import * as Sentry from '@sentry/nextjs' // or your error tracker

try {
  // ... image generation
} catch (error) {
  Sentry.captureException(error)
  // ...
}
```

## 🔧 Production Optimizations

### CDN Integration (Optional)

- [ ] Configure CDN for image hosting
- [ ] Update `ogImageGenerator.ts` to upload to CDN
- [ ] Set appropriate cache headers

**Example S3/Cloudflare:**
```typescript
// In ogImageGenerator.ts
async generateAndSave(id: string, options: OGImageOptions): Promise<string> {
  const buffer = await this.generateImage(options)
  
  // Upload to S3/CDN
  const cdnUrl = await uploadToS3(buffer, `og-images/${id}.png`)
  
  return cdnUrl
}
```

### Cache Strategy

- [ ] Set appropriate TTL for OG images
- [ ] Implement automatic cache cleanup (delete old images)
- [ ] Consider using external cache (Redis) for large scale

**Automated Cleanup (cron job):**
```bash
# Delete images older than 30 days
find public/previews -name "*.png" -mtime +30 -delete
```

### Rate Limiting

- [ ] Add rate limiting to prevent abuse
- [ ] Consider API keys for programmatic access

**Example with next-rate-limit:**
```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
```

## 📊 Health Check

After deployment, verify these endpoints:

```bash
# Health check URLs
https://yourdomain.com/og-demo              # Demo page
https://yourdomain.com/api/og?id=test&title=Test  # Generate test image
https://yourdomain.com/api/og-cache         # List cached images
https://yourdomain.com/previews/test.png    # View generated image
```

## 🐛 Troubleshooting Production Issues

### Issue: Canvas not found / Native module error

**Solution:**
- Ensure platform has canvas dependencies installed
- Check build logs for canvas installation errors
- Verify Node.js version compatibility

### Issue: Images not generating

**Solution:**
- Check API logs for detailed error messages
- Verify file permissions on `public/previews/`
- Test locally with same data
- Check if disk space is available

### Issue: Slow generation times

**Solution:**
- Monitor server resources (CPU, memory)
- Consider pre-generating common images
- Implement CDN for image hosting
- Cache aggressively

### Issue: Meta tags not updating

**Solution:**
- Clear CDN cache
- Use Facebook/Twitter debug tools to scrape again
- Force regenerate with `?regenerate=true`
- Check if cache headers are set correctly

## ✨ Success Criteria

Your OG Image Generator is production-ready when:

- [x] All tests pass
- [x] Images generate in < 1 second
- [x] Cached images serve instantly
- [x] Meta tags validate correctly
- [x] Social media previews display properly
- [x] No errors in production logs
- [x] Cache management works
- [x] System handles concurrent requests

## 📚 Post-Deployment

- [ ] Document any platform-specific configurations
- [ ] Share demo page with team
- [ ] Update existing pages to use new system
- [ ] Monitor first week for any issues
- [ ] Collect feedback from users

## 🎉 You're Live!

Congratulations! Your automated OG image generation system is now live in production.

**Next Steps:**
1. Monitor the first few days for any issues
2. Gradually migrate existing pages
3. Share beautiful previews on social media
4. Consider additional customizations (themes, templates)

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Platform:** _______________  
**Status:** ⬜ In Progress | ⬜ Complete
