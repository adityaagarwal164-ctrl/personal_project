import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-50 to-slate-100 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 animate-gradient-fast shadow-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">SaaSPilot</span>
            </div>
            <p className="text-sm text-slate-600">Discover and review the best SaaS tools for your business.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
            <div className="space-y-3 text-sm">
              <Link href="/write-review" className="block text-slate-600 hover:text-blue-600 transition-colors">Browse Reviews</Link>
              <Link href="/categories" className="block text-slate-600 hover:text-blue-600 transition-colors">Categories</Link>
              <Link href="/submit" className="block text-slate-600 hover:text-blue-600 transition-colors">Submit Tool</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <div className="space-y-3 text-sm">
              <Link href="/about" className="block text-slate-600 hover:text-blue-600 transition-colors">About Us</Link>
              <Link href="/blog" className="block text-slate-600 hover:text-blue-600 transition-colors">Blog</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
            <div className="space-y-3 text-sm">
              <Link href="/privacy-policy" className="block text-slate-600 hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="block text-slate-600 hover:text-blue-600 transition-colors">Terms of Use</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600">© {new Date().getFullYear()} SaaSPilot. All rights reserved.</p>
          <p className="mt-2 text-sm font-medium text-slate-700">Made By Aditya Agrawal</p>
        </div>
      </div>
    </footer>
  )
}
