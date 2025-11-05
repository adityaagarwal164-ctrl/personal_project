import SEO from '@/components/SEO'

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <SEO title="About Us" description="Why we built SaaS Scout and how it helps you pick the right software." />
      <h1 className="text-3xl font-bold">About Us</h1>
      <p className="mt-4 text-slate-700">SaaS Scout is a community-driven platform to find, compare, and review software tools. We highlight real user experiences and keep listings transparent.</p>
    </div>
  )
}
