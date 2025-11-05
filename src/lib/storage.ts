export type Tool = {
  slug: string
  name: string
  logo?: string
  video?: string
  overview: string
  useCases?: string[]
  pros?: string[]
  cons?: string[]
  pricing: string
  category: string
  website: string // Required homepage URL
  averageRating?: number
  submittedBy?: string // Email of the user who submitted this tool
}

export type Review = {
  id: string
  toolSlug: string
  author: string
  email?: string
  rating: number
  content: string
  experience?: string
  pros?: string[]
  cons?: string[]
  createdAt: number
}

const KEYS = {
  tools: 'saas_tools',
  reviews: 'saas_reviews',
  user: 'saas_user',
  verifiedEmails: 'saas_verified_emails',
  pendingOTP: 'saas_pending_otp',
}

export function getTools(): Tool[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(KEYS.tools)
  return raw ? JSON.parse(raw) : []
}

export function saveTools(list: Tool[]) {
  localStorage.setItem(KEYS.tools, JSON.stringify(list))
}

// Normalize URL to catch variations (www, trailing slash, protocol)
function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    // Remove www, convert to lowercase, remove trailing slash, ignore protocol
    const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '')
    const pathname = urlObj.pathname.replace(/\/$/, '') || '/'
    return `${hostname}${pathname}`
  } catch {
    // If URL is invalid, return as-is lowercased
    return url.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')
  }
}

export function checkDuplicateWebsite(website: string, excludeSlug?: string): boolean {
  const tools = getTools()
  const normalizedInput = normalizeUrl(website)
  
  return tools.some(tool => 
    normalizeUrl(tool.website) === normalizedInput && 
    tool.slug !== excludeSlug
  )
}

export function upsertTool(t: Tool) {
  const list = getTools()
  const idx = list.findIndex(x => x.slug === t.slug)
  if (idx >= 0) list[idx] = t
  else list.push(t)
  saveTools(list)
}

export function getReviews(slug: string): Review[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(KEYS.reviews)
  const all: Review[] = raw ? JSON.parse(raw) : []
  return all.filter(r => r.toolSlug === slug).sort((a,b)=>b.createdAt-a.createdAt)
}

export function addReview(r: Review) {
  const raw = localStorage.getItem(KEYS.reviews)
  const all: Review[] = raw ? JSON.parse(raw) : []
  all.push(r)
  localStorage.setItem(KEYS.reviews, JSON.stringify(all))
}

export function updateReview(reviewId: string, updates: Partial<Review>) {
  const raw = localStorage.getItem(KEYS.reviews)
  if (!raw) return
  
  const all: Review[] = JSON.parse(raw)
  const index = all.findIndex(r => r.id === reviewId)
  
  if (index >= 0) {
    all[index] = { ...all[index], ...updates }
    localStorage.setItem(KEYS.reviews, JSON.stringify(all))
  }
}

export function deleteReview(reviewId: string) {
  const raw = localStorage.getItem(KEYS.reviews)
  if (!raw) return
  
  const all: Review[] = JSON.parse(raw)
  const filtered = all.filter(r => r.id !== reviewId)
  localStorage.setItem(KEYS.reviews, JSON.stringify(filtered))
}

export function getUser(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(KEYS.user)
}

export function setUser(email: string) {
  localStorage.setItem(KEYS.user, email)
}

export function ensureSeed() {
  if (typeof window === 'undefined') return
  if (getTools().length) return
  
  // Dynamically import and load seed data immediately
  import('./seedData').then(({ SEED_TOOLS }) => {
    saveTools(SEED_TOOLS)
    // Force a page reload to show the data
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  })
}

export function getAllReviews(): Review[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(KEYS.reviews)
  return raw ? JSON.parse(raw) : []
}

export function calculateToolRating(slug: string): number {
  const reviews = getReviews(slug)
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

export function getStats() {
  const tools = getTools()
  const reviews = getAllReviews()
  const categories = new Set(tools.map(t => t.category))
  
  return {
    toolsCount: tools.length,
    reviewsCount: reviews.length,
    categoriesCount: categories.size
  }
}

export function generateCategorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateSlug(name: string, category: string): string {
  const baseslug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  return baseslug
}

export function getToolPath(tool: Tool): string {
  const categorySlug = generateCategorySlug(tool.category)
  return `/${categorySlug}/${tool.slug}`
}

// ===== AUTHENTICATION & EMAIL VERIFICATION =====

export interface VerifiedEmail {
  email: string
  verifiedAt: number
  name?: string
}

export function getVerifiedEmails(): VerifiedEmail[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(KEYS.verifiedEmails)
  return raw ? JSON.parse(raw) : []
}

export function isEmailVerified(email: string): boolean {
  const verified = getVerifiedEmails()
  return verified.some(v => v.email.toLowerCase() === email.toLowerCase())
}

export function addVerifiedEmail(email: string, name?: string) {
  const verified = getVerifiedEmails()
  if (!verified.some(v => v.email.toLowerCase() === email.toLowerCase())) {
    verified.push({ email, verifiedAt: Date.now(), name })
    localStorage.setItem(KEYS.verifiedEmails, JSON.stringify(verified))
  }
  // Also set as current user
  setUser(email)
}

export function removeVerifiedEmail(email: string) {
  const verified = getVerifiedEmails()
  const filtered = verified.filter(v => v.email.toLowerCase() !== email.toLowerCase())
  localStorage.setItem(KEYS.verifiedEmails, JSON.stringify(filtered))
}

// Mock OTP System (for demo - replace with real email service)
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function sendOTP(email: string): string {
  const otp = generateOTP()
  const pending = {
    email,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    createdAt: Date.now()
  }
  localStorage.setItem(KEYS.pendingOTP, JSON.stringify(pending))
  
  // For demo: Log OTP to console
  console.log(`
    ╔════════════════════════════════════╗
    ║      OTP VERIFICATION CODE         ║
    ╠════════════════════════════════════╣
    ║  Email: ${email.padEnd(26)}║
    ║  Code:  ${otp}                    ║
    ║  Expires in 5 minutes              ║
    ╚════════════════════════════════════╝
  `)
  
  alert(`🔐 OTP Code: ${otp}\n\n(In production, this will be sent to ${email})\n\nCheck console for details.`)
  
  return otp
}

export function verifyOTP(email: string, code: string): boolean {
  const raw = localStorage.getItem(KEYS.pendingOTP)
  if (!raw) return false
  
  const pending = JSON.parse(raw)
  
  if (
    pending.email.toLowerCase() === email.toLowerCase() &&
    pending.otp === code &&
    pending.expiresAt > Date.now()
  ) {
    // Clear the OTP
    localStorage.removeItem(KEYS.pendingOTP)
    // Add to verified emails
    addVerifiedEmail(email)
    return true
  }
  
  return false
}

export function clearPendingOTP() {
  localStorage.removeItem(KEYS.pendingOTP)
}

// Check if current user owns a tool
export function canEditTool(toolSlug: string): boolean {
  const currentUser = getUser()
  if (!currentUser || !isEmailVerified(currentUser)) return false
  
  const tools = getTools()
  const tool = tools.find(t => t.slug === toolSlug)
  
  return tool?.submittedBy?.toLowerCase() === currentUser.toLowerCase()
}

// Check if current user owns a review
export function canEditReview(review: Review): boolean {
  const currentUser = getUser()
  if (!currentUser || !isEmailVerified(currentUser)) return false
  
  return review.email?.toLowerCase() === currentUser.toLowerCase()
}
