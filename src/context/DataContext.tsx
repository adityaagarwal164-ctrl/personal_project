import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react'
import { getTools, ensureSeed, Tool, getStats, calculateToolRating } from '@/lib/storage'

type Stats = {
  toolsCount: number
  reviewsCount: number
  categoriesCount: number
}

type DataContextType = {
  tools: Tool[]
  trending: Tool[]
  featured: Tool[]
  hot: Tool[]
  stats: Stats
  toolsByCategory: Map<string, Tool[]>
  refreshData: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [tools, setTools] = useState<Tool[]>([])
  const [stats, setStats] = useState<Stats>({ toolsCount: 0, reviewsCount: 0, categoriesCount: 0 })

  const refreshData = () => {
    const loadedTools = getTools()
    // Calculate ratings for each tool
    const toolsWithRatings = loadedTools.map(t => ({
      ...t,
      averageRating: t.averageRating || calculateToolRating(t.slug) || 0
    }))
    setTools(toolsWithRatings)
    setStats(getStats())
  }

  useEffect(() => {
    ensureSeed()
    // Delay to ensure seed data is loaded
    setTimeout(refreshData, 100)
  }, [])

  const trending = useMemo(() => tools.slice(0, 6), [tools])
  const featured = useMemo(() => tools.slice(0, 6), [tools])
  const hot = useMemo(() => tools.slice(0, 6), [tools])

  const toolsByCategory = useMemo(() => {
    const map = new Map<string, Tool[]>()
    tools.forEach(tool => {
      const category = tool.category || 'Other'
      if (!map.has(category)) {
        map.set(category, [])
      }
      map.get(category)!.push(tool)
    })
    return map
  }, [tools])

  return (
    <DataContext.Provider value={{ tools, trending, featured, hot, stats, toolsByCategory, refreshData }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData outside provider')
  return ctx
}
