import { ReactNode } from 'react'

type Props = { open: boolean; onClose: () => void; children: ReactNode }
export default function Modal({ open, onClose, children }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl bg-white p-6" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
