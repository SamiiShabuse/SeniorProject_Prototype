import { createContext } from 'react'

export type DevSettings = { compact: boolean; grid: boolean; contrast: boolean }

export const DevContext = createContext<{
  devMode: boolean
  setDevMode: (v: boolean) => void
  devSettings: DevSettings
  setDevSettings: (s: DevSettings) => void
} | null>(null)

export default DevContext
