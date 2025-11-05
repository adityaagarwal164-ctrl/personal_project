import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getTools } from '@/lib/storage'

const CATEGORIES = [
  { name: 'Project Management', icon: '📋', slug: 'project-management' },
  { name: 'Communication', icon: '💬', slug: 'communication' },
  { name: 'HR', icon: '👥', slug: 'hr' },
  { name: 'Marketing', icon: '📈', slug: 'marketing' },
  { name: 'Sales', icon: '💰', slug: 'sales' },
  { name: 'Design', icon: '🎨', slug: 'design' },
  { name: 'Development', icon: '💻', slug: 'development' },
  { name: 'Productivity', icon: '⚡', slug: 'productivity' },
]

export default function Nav() {
  const { pathname } = useRouter()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchQuery.trim()) {
      const tools = getTools()
      const filtered = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
      setSearchResults(filtered)
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="backdrop-blur-lg bg-white/80 sticky top-0 z-50 border-b border-slate-200/50 shadow-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 animate-gradient-fast shadow-lg shadow-blue-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              SaaSPilot
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 text-slate-700 hover:text-blue-600 font-medium transition-colors">
                Best Tools
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-gradient-fast">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900">Browse by Category</h3>
                    <p className="text-sm text-slate-600 mt-1">Explore top tools by category</p>
                  </div>
                  <div className="p-2 max-h-96 overflow-y-auto">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/categories?category=${encodeURIComponent(cat.name)}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors group"
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {cat.name}
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Blog
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div ref={searchRef} className="hidden md:flex items-center relative">
            <input
              type="text"
              placeholder="Search your SaaS tool..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
              className="w-64 pl-4 pr-10 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors text-slate-700 placeholder:text-slate-400"
            />
            <button className="absolute right-2 p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900 text-sm">Search Results</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {searchResults.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={{ pathname: '/tool', query: { slug: tool.slug } }}
                      onClick={() => {
                        setShowResults(false)
                        setSearchQuery('')
                      }}
                      className="flex items-start gap-3 p-4 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-0"
                    >
                      <img
                        src={tool.logo || '/next.svg'}
                        alt={tool.name}
                        className="h-10 w-10 rounded-lg object-contain flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 truncate">{tool.name}</h4>
                        <p className="text-sm text-slate-600 line-clamp-2">{tool.overview}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {tool.category}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {showResults && searchQuery && searchResults.length === 0 && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 text-center z-50">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-semibold text-slate-900 mb-2">No tools found</h3>
                <p className="text-slate-600 text-sm">Try searching with different keywords</p>
              </div>
            )}
          </div>
          
          <Link 
            href="/submit" 
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 animate-gradient-fast text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200"
          >
            Submit Tool
          </Link>
        </div>
      </div>
    </header>
  )
}
