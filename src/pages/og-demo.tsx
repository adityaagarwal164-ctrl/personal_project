import { useState } from 'react'
import Head from 'next/head'
import SEO from '@/components/SEO'

/**
 * OG Image Generator Demo Page
 * 
 * Test and preview the Open Graph image generation system
 */
export default function OGDemo() {
  const [formData, setFormData] = useState({
    id: 'demo-test',
    title: 'Amazing SaaS Tool for Teams',
    description: 'Boost productivity and collaborate seamlessly with the best tools for remote teams.',
    author: 'John Doe',
    category: 'Productivity',
    siteName: 'SaaSPilot'
  })

  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [cacheInfo, setCacheInfo] = useState<any>(null)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        id: formData.id,
        title: formData.title,
        ...(formData.description && { desc: formData.description }),
        ...(formData.author && { author: formData.author }),
        ...(formData.category && { category: formData.category }),
        ...(formData.siteName && { siteName: formData.siteName })
      })

      const response = await fetch(`/api/og?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setGeneratedUrl(data.url)
        setCacheInfo(data)
      }
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        id: formData.id,
        title: formData.title,
        regenerate: 'true',
        ...(formData.description && { desc: formData.description }),
        ...(formData.author && { author: formData.author }),
        ...(formData.category && { category: formData.category }),
        ...(formData.siteName && { siteName: formData.siteName })
      })

      const response = await fetch(`/api/og?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setGeneratedUrl(data.url + '?t=' + Date.now()) // Add timestamp to force reload
        setCacheInfo(data)
      }
    } catch (error) {
      console.error('Error regenerating image:', error)
    } finally {
      setLoading(false)
    }
  }

  const presets = [
    {
      name: 'Blog Post',
      data: {
        id: 'blog-demo',
        title: 'Top 10 Project Management Tools',
        description: 'Discover the best tools for remote teams in 2024',
        author: 'Sarah Johnson',
        category: 'Project Management',
        siteName: 'SaaSPilot Blog'
      }
    },
    {
      name: 'Tool Review',
      data: {
        id: 'tool-slack',
        title: 'Slack - Team Communication',
        description: 'Modern collaboration platform for teams of all sizes',
        author: '',
        category: 'Communication',
        siteName: 'SaaSPilot'
      }
    },
    {
      name: 'Landing Page',
      data: {
        id: 'page-home',
        title: 'Discover the Best SaaS Tools',
        description: 'Find, compare, and review software tools for your business',
        author: '',
        category: '',
        siteName: 'SaaSPilot'
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO 
        title="OG Image Generator Demo"
        description="Test and preview the Open Graph image generation system"
      />

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            🎨 OG Image Generator
          </h1>
          <p className="text-xl text-slate-600">
            Test and preview dynamically generated Open Graph images
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Configure Image</h2>

              {/* Presets */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Quick Presets
                </label>
                <div className="flex gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setFormData(preset.data)}
                      className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    ID (Cache Key) *
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="e.g., blog-1, tool-slack"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="Main title text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    rows={3}
                    placeholder="Short description (2 lines max)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      placeholder="Author name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      placeholder="Category badge"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="Site name"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !formData.id || !formData.title}
                  className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Generating...' : 'Generate Image'}
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={loading || !formData.id || !formData.title}
                  className="px-6 py-3 rounded-xl bg-slate-600 text-white font-semibold hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  Force Regenerate
                </button>
              </div>

              {/* Cache Info */}
              {cacheInfo && (
                <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Status:</span>
                      <span className={cacheInfo.cached ? 'text-green-600' : 'text-blue-600'}>
                        {cacheInfo.cached ? '✓ Cached' : '✓ Newly Generated'}
                      </span>
                    </div>
                    {cacheInfo.generated && (
                      <div className="text-slate-600">
                        Generated: {new Date(cacheInfo.generated).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Preview</h2>

              {generatedUrl ? (
                <div className="space-y-4">
                  <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
                    <img
                      src={generatedUrl}
                      alt="Generated OG Image"
                      className="w-full"
                      style={{ aspectRatio: '1200/630' }}
                    />
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm font-semibold text-slate-700 mb-2">Image URL:</div>
                    <code className="text-xs text-slate-600 break-all block">
                      {generatedUrl}
                    </code>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm font-semibold text-slate-700 mb-2">Meta Tags:</div>
                    <pre className="text-xs text-slate-600 overflow-x-auto">
{`<meta property="og:image" content="${window.location.origin}${generatedUrl}" />
<meta property="og:title" content="${formData.title}" />
<meta property="og:description" content="${formData.description}" />`}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <svg className="w-24 h-24 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">Generate an image to preview it here</p>
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">ℹ️ How It Works</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Images are 1200x630 pixels (social media standard)</li>
                <li>• Cached to <code className="bg-blue-100 px-1 rounded">/public/previews/</code></li>
                <li>• Only generated once per unique ID</li>
                <li>• Use "Force Regenerate" to update existing images</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Documentation Link */}
        <div className="mt-12 text-center">
          <a 
            href="/OG_IMAGE_GENERATOR.md"
            target="_blank"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            📚 View Full Documentation
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
