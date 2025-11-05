/**
 * Type definitions for OG Image Generator
 */

export interface OGImageOptions {
  title: string
  description?: string
  author?: string
  category?: string
  siteName?: string
  logoPath?: string
  backgroundColor?: string
  textColor?: string
}

export interface GenerateOGImageParams {
  id: string
  title: string
  description?: string
  author?: string
  category?: string
  siteName?: string
  regenerate?: boolean
}

export interface OGAPIResponse {
  success: boolean
  url?: string
  cached?: boolean
  generated?: string
  error?: string
  message?: string
}

export interface OGCacheInfo {
  filename: string
  id: string
  url: string
}

export interface OGCacheAPIResponse {
  success: boolean
  count?: number
  images?: OGCacheInfo[]
  message?: string
  id?: string
  exists?: boolean
  error?: string
}
