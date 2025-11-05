import Link from 'next/link'
import { Tool } from '@/lib/storage'

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={{ pathname: '/tool', query: { slug: tool.slug } }} className="rounded-xl bg-white p-5 shadow hover:shadow-md transition flex gap-4">
      <img src={tool.logo || '/next.svg'} alt={tool.name} className="h-12 w-12 rounded" />
      <div>
        <div className="font-semibold">{tool.name}</div>
        <div className="text-sm text-slate-600 line-clamp-2">{tool.overview}</div>
      </div>
    </Link>
  )
}
