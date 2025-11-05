import SEO from '@/components/SEO'

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <SEO title="Privacy Policy" description="How we handle your data and privacy on SaaS Scout." />
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-slate-700">We respect your privacy. This site stores minimal user data for account and review functionality using localStorage. No data is shared with third parties.</p>
    </div>
  )
}
