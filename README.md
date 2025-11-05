# 🚀 SaaS Scout

A modern, premium SaaS tool review and discovery platform built with Next.js and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## ✨ Features

- 🎨 **Premium Design** - Beautiful blue gradient theme with smooth animations
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 🔍 **SEO Optimized** - Canonical tags, Open Graph, Twitter Cards, and Schema.org markup
- ⚡ **Static Export** - Fast, static site generation for blazing performance
- 📂 **Category Browsing** - Tools organized by category (Productivity, Design, Marketing, etc.)
- ✍️ **User Reviews** - Submit and read authentic user reviews
- 🛠️ **Tool Submission** - Clean, multi-step form for adding new tools
- 🎯 **Local Storage** - Client-side data persistence (no backend required)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Inline SVG (Heroicons style)
- **Deployment**: Static export compatible with GitHub Pages, Netlify, Vercel

## 📦 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/saas-scout.git
cd saas-scout
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
personal-website/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── Nav.tsx
│   │   ├── Footer.tsx
│   │   ├── SEO.tsx
│   │   └── ...
│   ├── pages/           # Next.js pages
│   │   ├── index.tsx    # Homepage
│   │   ├── submit.tsx   # Submit tool form
│   │   ├── categories.tsx
│   │   ├── tool.tsx     # Tool detail page
│   │   └── ...
│   ├── context/         # React context providers
│   ├── lib/            # Utilities and data layer
│   └── styles/         # Global styles
├── public/             # Static assets
└── next.config.ts     # Next.js configuration
```

## 📄 Available Pages

- `/` - Homepage with hero, features, and trending tools
- `/categories` - Browse tools by category
- `/submit` - Submit a new tool
- `/write-review` - Browse and review tools
- `/tool?slug=...` - Individual tool page with reviews
- `/blog` - Blog posts
- `/about` - About page
- `/privacy-policy` - Privacy policy
- `/terms` - Terms of use

## 🚀 Build & Deploy

### Build for Production

```bash
npm run build
```

This generates a static export in the `/out` directory.

### Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Set source to "GitHub Actions" or deploy the `/out` folder
4. Your site will be live at `https://USERNAME.github.io/REPO_NAME`

### Deploy to Netlify/Vercel

Simply connect your GitHub repository and these platforms will auto-deploy.

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` or use Tailwind's built-in color utilities throughout the codebase.

### SEO Configuration

Set environment variables in `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_BASE_PATH=
```

### Add Seed Data

Edit `src/lib/storage.ts` to modify the initial seed tools.

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js and Tailwind CSS
