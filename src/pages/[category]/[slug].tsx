import { useRouter } from 'next/router'
import Link from 'next/link'
import { addReview, getReviews, getTools, Review, canEditTool, getToolPath } from '@/lib/storage'
import { useEffect, useMemo, useState } from 'react'
import SEO from '@/components/SEO'
import Modal from '@/components/Modal'
import ReviewCard from '@/components/ReviewCard'

export default function ToolPage() {
  const router = useRouter()
  const { category, slug } = router.query
  const toolSlug = typeof slug === 'string' ? slug : ''
  const tool = useMemo(()=> getTools().find(t=> t.slug===toolSlug), [toolSlug])
  const [reviews, setReviews] = useState<Review[]>([])
  const [open, setOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [experience, setExperience] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [rating, setRating] = useState(5)
  const isOwner = toolSlug && canEditTool(toolSlug)

  useEffect(()=>{
    if (toolSlug) setReviews(getReviews(toolSlug))
  }, [toolSlug])

  const submit = () => {
    if (!toolSlug || !userName || !experience) return
    
    const prosArray = pros.split('\n').filter(p => p.trim())
    const consArray = cons.split('\n').filter(c => c.trim())
    
    addReview({ 
      id: String(Date.now()), 
      toolSlug: toolSlug, 
      author: userName,
      email: userEmail,
      rating, 
      experience,
      pros: prosArray,
      cons: consArray,
      content: experience,
      createdAt: Date.now() 
    })
    
    setReviews(getReviews(toolSlug))
    setOpen(false)
    setExperience('')
    setPros('')
    setCons('')
    setRating(5)
  }

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null
  const schema = tool ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tool.name,
    description: tool.overview,
    image: tool.logo || undefined,
    category: tool.category,
    aggregateRating: reviews.length ? {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount: reviews.length,
    } : undefined
  } : undefined

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://saaspilot.com'
  const ogImageUrl = tool ? `${baseUrl}/api/og-image?slug=${tool.slug}` : undefined
  
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <SEO 
        title={tool? `${tool.name} reviews and pricing` : 'Tool'} 
        description={tool?.overview} 
        image={ogImageUrl}
        schema={schema} 
      />
      {!tool ? (
        <div>Tool not found.</div>
      ) : (
        <>
          {tool.video && (
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black mb-6">
              <iframe src={tool.video} className="h-full w-full" allowFullScreen />
            </div>
          )}
          <div className="flex items-start justify-between gap-4 mt-6">
            <div className="flex items-start gap-4">
              <img src={tool.logo || '/next.svg'} alt={tool.name} className="h-16 w-16 rounded" />
              <div>
                <h1 className="text-3xl font-bold">{tool.name}</h1>
                <p className="text-slate-600">{tool.overview}</p>
                {avgRating && <div className="mt-1 text-sm text-slate-700">Average rating: {avgRating}/5 ({reviews.length})</div>}
                {tool.website && (
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit Site
                  </a>
                )}
              </div>
            </div>
            {isOwner && (
              <Link
                href={`/submit?edit=${tool.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Tool
              </Link>
            )}
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow">
              <div className="font-semibold mb-3">Use cases</div>
              <ul className="space-y-2">
                {tool.useCases?.map(u=> (
                  <li key={u} className="flex items-start gap-2">
                    <span className="text-blue-500 text-lg">•</span>
                    <span className="text-slate-700">{u}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-white p-4 shadow">
              <div className="font-semibold mb-3 text-green-700">✓ Pros</div>
              <ul className="space-y-2">
                {tool.pros?.map(u=> (
                  <li key={u} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold text-xl flex-shrink-0">✓</span>
                    <span className="text-slate-700">{u}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-white p-4 shadow">
              <div className="font-semibold mb-3 text-red-700">✗ Cons</div>
              <ul className="space-y-2">
                {tool.cons?.map(u=> (
                  <li key={u} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold text-xl flex-shrink-0">✗</span>
                    <span className="text-slate-700">{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-white p-4 shadow">
            <div className="font-semibold">Pricing</div>
            <div className="mt-2">{tool.pricing}</div>
          </div>
          <div className="mt-8 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            <button onClick={()=> setOpen(true)} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Add Review</button>
          </div>
          <div className="mt-4 grid gap-4">
            {reviews.map(r=> <ReviewCard key={r.id} review={r} onUpdate={() => setReviews(getReviews(toolSlug))} />)}
            {!reviews.length && <div className="text-slate-600">No reviews yet.</div>}
          </div>
          <Modal open={open} onClose={()=> setOpen(false)}>
            <div className="space-y-5">
                <div className="text-2xl font-bold text-slate-900">Write Your Review</div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name *</label>
                  <input 
                    type="text" 
                    value={userName} 
                    onChange={e=> setUserName(e.target.value)} 
                    placeholder="e.g., John Doe"
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors" 
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-3xl transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-lg font-semibold text-slate-700">{rating}/5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">1. Your Experience *</label>
                  <textarea 
                    value={experience} 
                    onChange={e=> setExperience(e.target.value)} 
                    placeholder="Share your overall experience with this tool..."
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors min-h-24"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-green-700 mb-2">2. Pros (One per line)</label>
                  <textarea 
                    value={pros} 
                    onChange={e=> setPros(e.target.value)} 
                    placeholder="Easy to use&#10;Great customer support&#10;Affordable pricing"
                    className="w-full rounded-xl border-2 border-green-200 px-4 py-3 focus:border-green-500 focus:outline-none transition-colors min-h-24"
                  />
                  <p className="mt-1 text-xs text-slate-500">Press Enter after each pro</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-red-700 mb-2">3. Cons (One per line)</label>
                  <textarea 
                    value={cons} 
                    onChange={e=> setCons(e.target.value)} 
                    placeholder="Steep learning curve&#10;Limited integrations&#10;Slow customer support"
                    className="w-full rounded-xl border-2 border-red-200 px-4 py-3 focus:border-red-500 focus:outline-none transition-colors min-h-24"
                  />
                  <p className="mt-1 text-xs text-slate-500">Press Enter after each con</p>
                </div>

                <button 
                  onClick={submit} 
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  Submit Review
                </button>
              </div>
          </Modal>
        </>
      )}
    </div>
  )
}
