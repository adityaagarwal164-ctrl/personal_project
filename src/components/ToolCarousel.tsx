import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Tool } from '@/lib/storage'

interface ToolCarouselProps {
  tools: Tool[]
  category: string
  direction?: 'left' | 'right'
}

export default function ToolCarousel({ tools, category, direction = 'right' }: ToolCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let isPaused = false
    const speed = 3 // Increased speed from 2 to 3 pixels per frame
    const scrollDirection = direction === 'right' ? 1 : -1
    
    const scroll = () => {
      if (!isPaused && scrollContainer && !isDragging.current) {
        // Smooth continuous scroll with direction support
        scrollContainer.scrollLeft += speed * scrollDirection
        
        // Infinite loop: Reset to start when reaching end
        if (direction === 'right') {
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
            scrollContainer.scrollLeft = 0
          }
        } else {
          if (scrollContainer.scrollLeft <= 0) {
            scrollContainer.scrollLeft = scrollContainer.scrollWidth / 2
          }
        }
      }
      animationId = requestAnimationFrame(scroll)
    }

    // Initialize scroll position for left direction
    if (direction === 'left') {
      scrollContainer.scrollLeft = scrollContainer.scrollWidth / 2
    }

    // Start animation
    animationId = requestAnimationFrame(scroll)

    // Pause on hover and touch
    const handleMouseEnter = () => { isPaused = true }
    const handleMouseLeave = () => { isPaused = false }
    const handleTouchStart = () => { isPaused = true }
    const handleTouchEnd = () => { isPaused = false }

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)
    scrollContainer.addEventListener('touchstart', handleTouchStart)
    scrollContainer.addEventListener('touchend', handleTouchEnd)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
      scrollContainer.removeEventListener('touchstart', handleTouchStart)
      scrollContainer.removeEventListener('touchend', handleTouchEnd)
    }
  }, [direction])

  // Manual scrolling support
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    const container = scrollRef.current
    if (!container) return
    startX.current = e.pageX - container.offsetLeft
    scrollLeft.current = container.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    e.preventDefault()
    const container = scrollRef.current
    if (!container) return
    const x = e.pageX - container.offsetLeft
    const walk = (x - startX.current) * 2
    container.scrollLeft = scrollLeft.current - walk
  }

  const handleMouseUpOrLeave = () => {
    isDragging.current = false
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`half-${category}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <path fill={`url(#half-${category})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    return stars
  }

  return (
    <div className="relative overflow-hidden">
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-hidden cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: 'smooth' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {/* Triple duplicate tools for seamless infinite loop */}
        {[...tools, ...tools, ...tools].map((tool, idx) => (
          <div
            key={`${tool.slug}-${idx}`}
            className="flex-shrink-0 w-72 sm:w-80"
          >
            <Link
              href={{ pathname: '/tool', query: { slug: tool.slug } }}
              className="group block p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md overflow-hidden">
                  <img
                    src={tool.logo || '/next.svg'}
                    alt={tool.name}
                    className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                    {tool.name}
                  </h3>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex gap-0.5">
                      {renderStars(tool.averageRating || 0)}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">
                      {tool.averageRating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-2 sm:mb-3">
                {tool.overview}
              </p>
              <div className="inline-flex items-center text-xs sm:text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                View Details
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
