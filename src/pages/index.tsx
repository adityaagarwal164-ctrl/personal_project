import Link from 'next/link'
import SEO from '@/components/SEO'
import { useData } from '@/context/DataContext'
import { Tool } from '@/lib/storage'
import ToolCarousel from '@/components/ToolCarousel'

export default function Home() {
  const { tools, trending, featured, hot, stats, toolsByCategory } = useData()
  
  return (
    <>
      <SEO title="Discover Top SaaS Tools & Reviews" description="Find the perfect software for your business. Read honest reviews, compare features, and make better decisions with SaaS Scout." />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 via-indigo-600 to-blue-800 animate-gradient">
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          
          {/* Floating shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Gradient orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-indigo-400/20 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative mx-auto max-w-7xl px-6 py-32 sm:py-40">
            <div className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-white/20">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Trusted by Top SaaS Buyers
              </div>
              <h1 className="text-5xl sm:text-7xl font-bold text-white leading-tight">
                Find the Perfect SaaS<br />
                <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">for Your Business</span>
              </h1>
              <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
                Stop wasting time on endless research. Get honest reviews, compare features side-by-side, and discover tools that actually solve your problems.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/write-review" 
                  className="group px-8 py-4 rounded-xl bg-white text-blue-700 font-bold text-lg shadow-2xl shadow-blue-900/50 hover:shadow-blue-900/70 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
                >
                  Explore Reviews
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link 
                  href="/categories" 
                  className="px-8 py-4 rounded-xl bg-blue-500/20 backdrop-blur-sm text-white font-semibold text-lg border-2 border-white/30 hover:bg-blue-500/30 hover:border-white/50 transition-all duration-300"
                >
                  Browse Categories
                </Link>
              </div>
              <div className="mt-12 flex items-center justify-center gap-8 text-blue-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{stats.toolsCount}+</div>
                  <div className="text-sm">Tools Listed</div>
                </div>
                <div className="h-12 w-px bg-blue-400/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{stats.reviewsCount}+</div>
                  <div className="text-sm">Reviews</div>
                </div>
                <div className="h-12 w-px bg-blue-400/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{stats.categoriesCount}</div>
                  <div className="text-sm">Categories</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900">Why Teams Trust SaaS Scout</h2>
              <p className="mt-4 text-xl text-slate-600">Real reviews. Real results. Zero BS.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 animate-gradient-fast flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Verified Reviews Only</h3>
                <p className="text-slate-600 leading-relaxed">Every review comes from real users who actually use the software. No fake reviews, no paid promotions—just honest feedback.</p>
              </div>
              
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 transition-all duration-300">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 animate-gradient-fast flex items-center justify-center shadow-lg shadow-purple-500/30 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Smart Categorization</h3>
                <p className="text-slate-600 leading-relaxed">Find exactly what you need with our AI-powered categories. From CRM to design tools—we've organized everything for you.</p>
              </div>
              
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-2 transition-all duration-300">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 animate-gradient-fast flex items-center justify-center shadow-lg shadow-green-500/30 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Transparent Scoring</h3>
                <p className="text-slate-600 leading-relaxed">Our rating system is crystal clear. See exactly how tools perform on features, support, pricing, and value for money.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Category Carousels */}
        {Array.from(toolsByCategory.entries()).map(([category, categoryTools]) => (
          <section key={category} className="py-16 bg-gradient-to-b from-slate-50 to-white">
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {category === 'Project Management' && '📋'} 
                    {category === 'Communication' && '💬'}
                    {category === 'HR' && '👥'}
                    {category === 'Marketing' && '📈'}
                    {category === 'Sales' && '💰'}
                    {category === 'Design' && '🎨'}
                    {category === 'Development' && '💻'}
                    {' '}{category}
                  </h2>
                  <p className="mt-2 text-lg text-slate-600">
                    {categoryTools.length} tools to streamline your workflow
                  </p>
                </div>
                <Link 
                  href={`/categories?category=${encodeURIComponent(category)}`}
                  className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-2 hover:gap-3 transition-all"
                >
                  View All
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <ToolCarousel tools={categoryTools} category={category} />
            </div>
          </section>
        ))}

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 animate-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Got a SaaS Product?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Join 500+ companies already listed. Get discovered by thousands of potential customers actively looking for solutions like yours.</p>
            <Link 
              href="/submit" 
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-white text-blue-700 font-bold text-lg shadow-2xl shadow-blue-900/50 hover:shadow-blue-900/70 hover:scale-105 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Submit Your Tool for Free
            </Link>
            <p className="mt-4 text-sm text-blue-200">No credit card required • Get listed in 5 minutes</p>
          </div>
        </section>
      </main>
    </>
  )
}
