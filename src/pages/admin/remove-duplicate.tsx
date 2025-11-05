import { useState, useEffect } from 'react'
import { getTools, saveTools, Tool } from '@/lib/storage'
import SEO from '@/components/SEO'

export default function RemoveDuplicate() {
  const [tools, setTools] = useState<Tool[]>([])
  const [duplicates, setDuplicates] = useState<{ url: string; tools: Tool[] }[]>([])
  const [removed, setRemoved] = useState<string[]>([])

  useEffect(() => {
    const allTools = getTools()
    setTools(allTools)

    // Find duplicates by website URL
    const urlMap = new Map<string, Tool[]>()
    allTools.forEach(tool => {
      const normalizedUrl = normalizeUrl(tool.website)
      if (!urlMap.has(normalizedUrl)) {
        urlMap.set(normalizedUrl, [])
      }
      urlMap.get(normalizedUrl)!.push(tool)
    })

    // Filter only URLs with duplicates
    const dupes: { url: string; tools: Tool[] }[] = []
    urlMap.forEach((tools, url) => {
      if (tools.length > 1) {
        dupes.push({ url, tools })
      }
    })
    setDuplicates(dupes)
  }, [])

  function normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '')
      const pathname = urlObj.pathname.replace(/\/$/, '') || '/'
      return `${hostname}${pathname}`
    } catch {
      return url.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')
    }
  }

  const removeTool = (slug: string) => {
    const currentTools = getTools()
    const filtered = currentTools.filter(t => t.slug !== slug)
    saveTools(filtered)
    setRemoved([...removed, slug])
    setTools(filtered)
    
    // Update duplicates list
    const urlMap = new Map<string, Tool[]>()
    filtered.forEach(tool => {
      const normalizedUrl = normalizeUrl(tool.website)
      if (!urlMap.has(normalizedUrl)) {
        urlMap.set(normalizedUrl, [])
      }
      urlMap.get(normalizedUrl)!.push(tool)
    })
    const dupes: { url: string; tools: Tool[] }[] = []
    urlMap.forEach((tools, url) => {
      if (tools.length > 1) {
        dupes.push({ url, tools })
      }
    })
    setDuplicates(dupes)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <SEO title="Remove Duplicates - Admin" />
      
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">🔍 Find & Remove Duplicate Tools</h1>

        {/* Search BZ Tools */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">🔎 Search: "BZ" Tools</h2>
          <div className="space-y-4">
            {tools.filter(t => t.name.toLowerCase().includes('bz') || t.slug.includes('bz')).length === 0 ? (
              <p className="text-slate-600">No tools found with "BZ" in name or slug.</p>
            ) : (
              tools.filter(t => t.name.toLowerCase().includes('bz') || t.slug.includes('bz')).map(tool => (
                <div key={tool.slug} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{tool.name}</h3>
                      <p className="text-sm text-slate-600">Slug: {tool.slug}</p>
                      <p className="text-sm text-blue-600 hover:underline">
                        <a href={tool.website} target="_blank" rel="noopener noreferrer">{tool.website}</a>
                      </p>
                      <p className="text-sm text-slate-500 mt-2">{tool.overview}</p>
                    </div>
                    <button
                      onClick={() => removeTool(tool.slug)}
                      disabled={removed.includes(tool.slug)}
                      className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {removed.includes(tool.slug) ? '✅ Removed' : '🗑️ Remove'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Duplicate Tools by URL */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">⚠️ Duplicate URLs Found</h2>
          
          {duplicates.length === 0 ? (
            <p className="text-green-600 font-semibold">✅ No duplicates found! All URLs are unique.</p>
          ) : (
            <div className="space-y-6">
              {duplicates.map(({ url, tools: dupeTools }) => (
                <div key={url} className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-red-900 mb-3">
                    🔗 Normalized URL: <span className="font-mono text-sm">{url}</span>
                  </h3>
                  <div className="space-y-3">
                    {dupeTools.map(tool => (
                      <div key={tool.slug} className="bg-white border border-slate-200 rounded p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900">{tool.name}</h4>
                            <p className="text-sm text-slate-600">Slug: {tool.slug}</p>
                            <p className="text-sm text-blue-600">{tool.website}</p>
                          </div>
                          <button
                            onClick={() => removeTool(tool.slug)}
                            disabled={removed.includes(tool.slug)}
                            className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400"
                          >
                            {removed.includes(tool.slug) ? '✅ Removed' : '🗑️ Remove'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-3">📊 Statistics</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">{tools.length}</p>
              <p className="text-sm text-slate-600">Total Tools</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600">{duplicates.length}</p>
              <p className="text-sm text-slate-600">Duplicate URLs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{removed.length}</p>
              <p className="text-sm text-slate-600">Removed</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
        </div>
      </div>
    </div>
  )
}
