# Simple Homepage OG Image

A simple automated solution to show a preview image when someone shares your homepage URL.

## ✅ What's Done

1. **Generated Image**: `public/og-image.png` (1200x630px)
2. **Homepage Updated**: Meta tag added to show the image when shared
3. **Script Created**: Easy regeneration anytime

## 🎯 What Happens When Someone Shares Your Homepage

When someone shares `https://yourdomain.com/` on:
- WhatsApp
- Facebook
- Twitter
- LinkedIn
- Slack
- Discord

They'll see a beautiful preview card with your site name, tagline, and description!

## 📸 Your Generated Image

Location: `public/og-image.png`

The image shows:
- **Site Name**: SaaSPilot (large, bold)
- **Tagline**: Discover Top SaaS Tools & Reviews
- **Description**: Find, compare, and review the best software tools
- **Beautiful gradient background** (blue theme)

## 🔄 Regenerate the Image

If you want to change the text or regenerate:

### 1. Edit the Script

Open `scripts/generate-homepage-og.js` and change these lines:

```javascript
const SITE_NAME = 'SaaSPilot'  // Change your site name
const SITE_TAGLINE = 'Discover Top SaaS Tools & Reviews'  // Change tagline
const SITE_DESCRIPTION = 'Find, compare, and review the best software tools for your business'  // Change description
```

### 2. Run the Generator

```bash
npm run generate-og
```

Done! New image is generated at `public/og-image.png`

## 🧪 Test It

### Local Testing

1. Start server: `npm run dev`
2. Visit: http://localhost:3000
3. View page source (Ctrl+U or Cmd+U)
4. Look for this line:
   ```html
   <meta property="og:image" content="http://localhost:3000/og-image.png" />
   ```
5. Copy that URL and open in browser to see your image

### Live Testing (After Deployment)

Use these tools to verify your OG image:

1. **Facebook Sharing Debugger**
   - https://developers.facebook.com/tools/debug/
   - Paste your homepage URL
   - Click "Scrape Again" if you regenerated the image

2. **Twitter Card Validator**
   - https://cards-validator.twitter.com/
   - Paste your homepage URL

3. **LinkedIn Post Inspector**
   - https://www.linkedin.com/post-inspector/
   - Paste your homepage URL

4. **WhatsApp**
   - Just send your URL in a chat
   - The preview appears automatically

## 📋 Files Created/Modified

**New Files:**
- `public/og-image.png` - Your homepage preview image
- `scripts/generate-homepage-og.js` - Script to regenerate the image

**Modified Files:**
- `src/pages/index.tsx` - Added `image="/og-image.png"` to SEO component
- `package.json` - Added `npm run generate-og` script

## 🎨 Customize Colors/Style

Want to change the look? Edit `scripts/generate-homepage-og.js`:

```javascript
// Change background gradient colors (line ~40)
gradient.addColorStop(0, '#3b82f6')  // Start color
gradient.addColorStop(0.5, '#4f46e5')  // Middle color
gradient.addColorStop(1, '#1e40af')  // End color

// Change text colors
ctx.fillStyle = '#1e293b'  // Site name color
ctx.fillStyle = '#3b82f6'  // Tagline color
ctx.fillStyle = '#475569'  // Description color

// Change font sizes
ctx.font = 'bold 72px Arial, sans-serif'  // Site name size
ctx.font = 'bold 42px Arial, sans-serif'  // Tagline size
ctx.font = '32px Arial, sans-serif'  // Description size
```

Then run `npm run generate-og` to regenerate.

## ✨ That's It!

You now have an automated OG image for your homepage. When anyone shares your site URL, they'll see a beautiful preview card!

---

**Need help?** The script is simple JavaScript using canvas. Just edit the text and colors, then regenerate.
