import Link from 'next/link'
import SEO from '@/components/SEO'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  const { asPath } = useRouter()
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SaaSPilot',
    url: process.env.NEXT_PUBLIC_SITE_URL || '',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/write-review?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
      <SEO urlPath={asPath} schema={schema} />
      <Nav />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
