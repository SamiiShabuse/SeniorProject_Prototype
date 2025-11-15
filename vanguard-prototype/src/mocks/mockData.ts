import type { Control, TestRequest } from '../lib/types'
import generatedMockData from './generated_mock_data.json'

// Load pre-generated randomized mock data from generated_mock_data.json
// This file is created by running: node scripts/generate_mock_data.cjs
// The data includes randomized controls and requests with varied statuses, dates, and assignments.

// Extract controls and requests from the generated data
const _generatedData = generatedMockData as {
  controls: Control[]
  requests: TestRequest[]
}

// Export the controls and requests directly from the generated data
export const mockControls: Control[] = _generatedData.controls.map((c) => ({
  ...c,
  // Ensure all optional fields are properly typed (convert empty strings to undefined)
  description: c.description || undefined,
  sme: c.sme || undefined,
  tester: c.tester || undefined,
  testingNotes: c.testingNotes || undefined,
  startDate: c.startDate || undefined,
  dueDate: c.dueDate || undefined,
  eta: c.eta || undefined,
  completedDate: c.completedDate || undefined,
}))

export const mockRequests: TestRequest[] = _generatedData.requests

export default {
  mockControls,
  mockRequests,
}

// Helpers to mutate the in-memory mock data during development/testing.
export function generateVGCPId(): string {
  // Try to find the max numeric suffix and increment
  const nums = mockControls
    .map((c) => {
      const m = String(c.id).match(/(\d{5})$/)
      return m ? Number(m[1]) : NaN
    })
    .filter((n) => !Number.isNaN(n))
  const max = nums.length ? Math.max(...nums) : 0
  const next = (max + 1).toString().padStart(5, '0')
  return `VGCP-${next}`
}

export function addMockControl(c: Control): Control {
  mockControls.push(c)
  return c
}

export function addMockRequest(r: TestRequest): TestRequest {
  mockRequests.push(r)
  return r
}

export function updateMockControl(id: string, patch: Partial<Control>): Control | undefined {
  const idx = mockControls.findIndex((c) => c.id === id)
  if (idx === -1) return undefined
  mockControls[idx] = { ...mockControls[idx], ...patch }
  return mockControls[idx]
}
