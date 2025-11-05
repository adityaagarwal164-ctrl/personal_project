import { useState } from 'react'
import { Review, deleteReview, updateReview, canEditReview } from '@/lib/storage'

interface ReviewCardProps {
  review: Review
  onUpdate: () => void
}

export default function ReviewCard({ review, onUpdate }: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedExperience, setEditedExperience] = useState(review.experience || review.content || '')
  const [editedPros, setEditedPros] = useState((review.pros || []).join('\n'))
  const [editedCons, setEditedCons] = useState((review.cons || []).join('\n'))
  const [editedRating, setEditedRating] = useState(review.rating)
  
  const isOwner = canEditReview(review)

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this review?')) {
      deleteReview(review.id)
      onUpdate()
    }
  }

  const handleSaveEdit = () => {
    const prosArray = editedPros.split('\n').filter(p => p.trim())
    const consArray = editedCons.split('\n').filter(c => c.trim())
    
    updateReview(review.id, {
      experience: editedExperience,
      content: editedExperience,
      pros: prosArray,
      cons: consArray,
      rating: editedRating
    })
    
    setIsEditing(false)
    onUpdate()
  }

  const handleCancelEdit = () => {
    setEditedExperience(review.experience || review.content || '')
    setEditedPros((review.pros || []).join('\n'))
    setEditedCons((review.cons || []).join('\n'))
    setEditedRating(review.rating)
    setIsEditing(false)
  }
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
    ))
  }

  if (isEditing) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-blue-300 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">Edit Review</h3>
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-200 text-slate-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setEditedRating(star)}
                className={`text-3xl transition-colors ${star <= editedRating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-lg font-semibold text-slate-700">{editedRating}/5</span>
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Your Experience</label>
          <textarea
            value={editedExperience}
            onChange={e => setEditedExperience(e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors min-h-24"
          />
        </div>

        {/* Pros */}
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-2">Pros (One per line)</label>
          <textarea
            value={editedPros}
            onChange={e => setEditedPros(e.target.value)}
            className="w-full rounded-xl border-2 border-green-200 px-4 py-3 focus:border-green-500 focus:outline-none transition-colors min-h-20"
          />
        </div>

        {/* Cons */}
        <div>
          <label className="block text-sm font-semibold text-red-700 mb-2">Cons (One per line)</label>
          <textarea
            value={editedCons}
            onChange={e => setEditedCons(e.target.value)}
            className="w-full rounded-xl border-2 border-red-200 px-4 py-3 focus:border-red-500 focus:outline-none transition-colors min-h-20"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-200 space-y-4 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold text-lg text-slate-900">{review.author}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className="text-sm font-semibold text-slate-700">{review.rating}/5</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit review"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete review"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Experience */}
      {review.experience && (
        <div className="pt-3 border-t border-slate-100">
          <p className="text-slate-700 leading-relaxed">{review.experience}</p>
        </div>
      )}

      {/* Pros and Cons in two columns */}
      {(review.pros?.length || review.cons?.length) ? (
        <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          {/* Pros */}
          {review.pros && review.pros.length > 0 && (
            <div className="space-y-2">
              <div className="font-semibold text-green-700 flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Pros
              </div>
              <ul className="space-y-1.5">
                {review.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 font-bold text-lg flex-shrink-0">✓</span>
                    <span className="text-slate-700">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cons */}
          {review.cons && review.cons.length > 0 && (
            <div className="space-y-2">
              <div className="font-semibold text-red-700 flex items-center gap-2">
                <span className="text-red-500">✗</span>
                Cons
              </div>
              <ul className="space-y-1.5">
                {review.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-red-500 font-bold text-lg flex-shrink-0">✗</span>
                    <span className="text-slate-700">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        /* Fallback for old reviews without pros/cons */
        review.content && !review.experience && (
          <div className="pt-3 border-t border-slate-100">
            <p className="text-slate-700">{review.content}</p>
          </div>
        )
      )}
    </div>
  )
}
