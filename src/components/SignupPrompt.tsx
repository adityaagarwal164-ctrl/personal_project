import { useState } from 'react'

type Props = { onSuccess: (email: string) => void }
export default function SignupPrompt({ onSuccess }: Props) {
  const [email, setEmail] = useState('')
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Sign up to submit your review</div>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <button onClick={()=> email && onSuccess(email)} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white">Continue</button>
    </div>
  )
}
