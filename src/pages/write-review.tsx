import { useMemo, useState } from 'react'
import { useData } from '@/context/DataContext'
import ToolCard from '@/components/ToolCard'
import SEO from '@/components/SEO'

export default function WriteReview() {
  const { tools } = useData()
  const [q, setQ] = useState('')
  const filtered = useMemo(()=> tools.filter(t=> t.name.toLowerCase().includes(q.toLowerCase())), [tools, q])
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <SEO title="Write a review" description="Pick a tool and share your experience." />
      <h1 className="text-3xl font-bold">Write a Review</h1>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tools" className="mt-6 w-full rounded-lg border px-3 py-2" />
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {filtered.map(t=> <ToolCard key={t.slug} tool={t} />)}
      </div>
    </div>
  )
}
