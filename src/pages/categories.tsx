import { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import SEO from '@/components/SEO'
import { useData } from '@/context/DataContext'
import { Tool } from '@/lib/storage'

export default function Categories() {
  const { tools } = useData()
  const router = useRouter()
  const selectedCategory = router.query.category as string | undefined
  
  const categoriesWithTools = useMemo(() => {
    const categoryMap = new Map<string, Tool[]>()
    tools.forEach(tool => {
      const category = tool.category || 'Other'
      if (!categoryMap.has(category)) {
        categoryMap.set(category, [])
      }
      categoryMap.get(category)!.push(tool)
    })
    
    let entries = Array.from(categoryMap.entries()).map(([name, tools]) => ({
      name,
      count: tools.length,
      tools
    }))
    
    // Filter by selected category if provided
    if (selectedCategory) {
      entries = entries.filter(cat => cat.name === selectedCategory)
    }
    
    return entries
  }, [tools, selectedCategory])

  const categoryIcons: Record<string, string> = {
    'Productivity': '⚡',
    'Communication': '💬',
    'Design': '🎨',
    'Marketing': '📈',
    'Sales': '💰',
    'Development': '💻',
    'Analytics': '📊',
    'HR': '👥',
    'Finance': '💳',
    'Other': '📦'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO title={selectedCategory ? `${selectedCategory} Tools` : "Browse SaaS Tools by Category"} description="Explore software tools organized by category. Find the perfect solution for productivity, design, marketing, sales, and more." />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 via-indigo-600 to-blue-800 animate-gradient py-20">
        <div className="mx-auto max-w-7xl px-6">
          {selectedCategory ? (
            <>
              <Link href="/categories" className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-4 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to all categories
              </Link>
              <h1 className="text-5xl font-bold text-white mb-4">{selectedCategory} Tools</h1>
              <p className="text-xl text-blue-100">Explore the best {selectedCategory.toLowerCase()} tools</p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-bold text-white mb-4">Browse by Category</h1>
              <p className="text-xl text-blue-100">Find the perfect tool for your specific needs</p>
            </>
          )}
        </div>
      </div>

      {/* Categories Grid or Tools List */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        {selectedCategory && categoriesWithTools.length > 0 ? (
          // Show all tools in selected category
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categoriesWithTools[0].tools.map(tool => (
              <Link
                key={tool.slug}
                href={{ pathname: '/tool', query: { slug: tool.slug } }}
                className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md overflow-hidden">
                    <img src={tool.logo || '/next.svg'} alt={tool.name} className="h-12 w-12 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(tool.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {tool.averageRating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{tool.overview}</p>
                <div className="text-sm font-medium text-blue-600">
                  {tool.pricing}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Show category grid
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categoriesWithTools.map(category => (
              <Link
                key={category.name}
                href={`/categories?category=${encodeURIComponent(category.name)}`}
                className="group block p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    {categoryIcons[category.name] || '📦'}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                    {category.count} {category.count === 1 ? 'tool' : 'tools'}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h2>
                
                <div className="space-y-3 mb-6">
                  {category.tools.slice(0, 3).map(tool => (
                    <div 
                      key={tool.slug} 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <img src={tool.logo || '/next.svg'} alt={tool.name} className="h-8 w-8 rounded object-contain" />
                      <span className="text-sm font-medium text-slate-700">{tool.name}</span>
                    </div>
                  ))}
                </div>
                
                {category.tools.length > 3 && (
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 inline-flex items-center gap-1">
                      View all {category.count} tools
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {categoriesWithTools.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No tools found</h2>
            <p className="text-slate-600">No tools available in this category yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
