import { FormEvent, useState, useEffect } from 'react'
import SEO from '@/components/SEO'
import Modal from '@/components/Modal'
import EmailVerification from '@/components/EmailVerification'
import { Tool, upsertTool, generateSlug, getUser, isEmailVerified } from '@/lib/storage'
import { useRouter } from 'next/router'

export default function Submit() {
  const [form, setForm] = useState<Tool>({ slug:'', name:'', overview:'', useCases:[], pros:[], cons:[], pricing:'', category:'' })
  const router = useRouter()
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null)
  const [showVerification, setShowVerification] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const editSlug = typeof router.query.edit === 'string' ? router.query.edit : null

  useEffect(() => {
    const currentUser = getUser()
    if (currentUser && isEmailVerified(currentUser)) {
      setVerifiedEmail(currentUser)
    }
  }, [])

  // Load tool data if in edit mode
  useEffect(() => {
    if (editSlug) {
      import('@/lib/storage').then(({ getTools, canEditTool }) => {
        const tools = getTools()
        const tool = tools.find(t => t.slug === editSlug)
        
        if (tool && canEditTool(editSlug)) {
          setForm(tool)
          setIsEditMode(true)
        } else {
          alert('❌ You do not have permission to edit this tool')
          router.push('/')
        }
      })
    }
  }, [editSlug, router])
  
  // Auto-generate slug when name changes
  useEffect(() => {
    if (form.name && form.category) {
      const autoSlug = generateSlug(form.name, form.category)
      setForm(prev => ({ ...prev, slug: autoSlug }))
    }
  }, [form.name, form.category])
  
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    // Check if email is verified
    if (!verifiedEmail || !isEmailVerified(verifiedEmail)) {
      setShowVerification(true)
      return
    }
    
    if (!form.name) return
    
    // Generate slug if not already set and add submittedBy
    const finalTool = {
      ...form,
      slug: form.slug || generateSlug(form.name, form.category),
      submittedBy: verifiedEmail
    }
    
    upsertTool(finalTool)
    alert(isEditMode ? '✅ Tool updated successfully!' : '✅ Tool submitted successfully!')
    router.push({ pathname:'/tool', query:{ slug: finalTool.slug } })
  }

  const handleVerified = (email: string) => {
    setVerifiedEmail(email)
    setShowVerification(false)
    alert('✅ Email verified! You can now submit your tool.')
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO title="Submit Your SaaS Tool" description="List your software on SaaS Scout and get discovered by thousands of potential customers." />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 via-indigo-600 to-blue-800 animate-gradient py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-white/20 mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Free listing • Takes 5 minutes
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">{isEditMode ? 'Edit Your Tool' : 'Submit Your Tool'}</h1>
          <p className="text-xl text-blue-100">{isEditMode ? 'Update your tool information' : 'Join 500+ companies and get discovered by your target audience'}</p>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Verification Status Banner */}
        {verifiedEmail ? (
          <div className="mb-8 p-4 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-green-900">Email Verified ✓</div>
                <div className="text-sm text-green-700">{verifiedEmail}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-amber-900">Email Verification Required</div>
                <div className="text-sm text-amber-700">You must verify your email before submitting</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowVerification(true)}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Verify Now
            </button>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-8">
          <div className="p-8 rounded-2xl bg-white shadow-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              Basic Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tool Name *</label>
                <input 
                  placeholder="e.g., Notion, Slack, Figma" 
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors" 
                  value={form.name} 
                  onChange={e=>setForm({...form, name:e.target.value})} 
                  required
                />
              </div>
              {form.slug && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Tool's URL</label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-sm">saaspilot.com/tool?slug=</span>
                    <span className="font-mono font-bold text-blue-700">{form.slug}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">✨ Auto-generated from your tool name</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                <select 
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                  value={form.category}
                  onChange={e=>setForm({...form, category:e.target.value})}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Productivity">⚡ Productivity</option>
                  <option value="Communication">💬 Communication</option>
                  <option value="Design">🎨 Design</option>
                  <option value="Marketing">📈 Marketing</option>
                  <option value="Sales">💰 Sales</option>
                  <option value="Development">💻 Development</option>
                  <option value="Analytics">📊 Analytics</option>
                  <option value="HR">👥 HR</option>
                  <option value="Finance">💳 Finance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tool Overview *</label>
                <textarea 
                  placeholder="Describe what your tool does in 2-3 sentences" 
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors min-h-24" 
                  value={form.overview} 
                  onChange={e=>setForm({...form, overview:e.target.value})} 
                  required
                />
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white shadow-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              Media & Visuals
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Logo URL</label>
                <input 
                  placeholder="https://example.com/logo.png" 
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors" 
                  value={form.logo||''} 
                  onChange={e=>setForm({...form, logo:e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Intro Video URL (YouTube/Vimeo)</label>
                <input 
                  placeholder="https://youtube.com/embed/..." 
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors" 
                  value={form.video||''} 
                  onChange={e=>setForm({...form, video:e.target.value})} 
                />
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white shadow-xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              Details & Pricing
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Use Cases (comma separated)</label>
                <input 
                  placeholder="Project management, Team collaboration, Task tracking" 
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors" 
                  onChange={e=>setForm({...form, useCases:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pros (comma separated)</label>
                <input 
                  placeholder="Easy to use, Great support, Affordable pricing" 
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors" 
                  onChange={e=>setForm({...form, pros:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Cons (comma separated)</label>
                <input 
                  placeholder="Learning curve, Limited integrations" 
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors" 
                  onChange={e=>setForm({...form, cons:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pricing *</label>
                <input 
                  placeholder="Free plan available, Paid plans from $10/month" 
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors" 
                  value={form.pricing} 
                  onChange={e=>setForm({...form, pricing:e.target.value})} 
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {isEditMode ? 'Update Tool' : 'Submit Tool for Review'}
          </button>
        </form>
      </div>

      {/* Email Verification Modal */}
      <Modal open={showVerification} onClose={() => setShowVerification(false)}>
        <EmailVerification 
          onVerified={handleVerified}
          title="Verify Email to Submit"
          description="To prevent spam and maintain quality, we require email verification before submitting tools."
        />
      </Modal>
    </div>
  )
}
