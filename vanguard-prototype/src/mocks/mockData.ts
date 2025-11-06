import type { Control, TestRequest } from '../lib/types'

export const mockControls: Control[] = [
  {
    id: 'VGCP-00001',
    name: 'Access control for administrative accounts',
    description: 'Ensure admin accounts have MFA, strong password policy and activity logging enabled.',
    owner: 'Alice Johnson',
    sme: 'Carlos Rivera',
    tester: 'Morgan Lee',
    needsEscalation: false,
    dat: { status: 'Testing Completed', step: 'Evidence review' },
    oet: { status: 'In Progress', step: 'Sampling' },
    testingNotes: 'Initial sampling complete; one exception noted and logged.',
    startDate: '2025-09-01',
    dueDate: '2025-09-30',
    eta: '2025-09-24',
    completedDate: '2025-10-02',
  },
  {
    id: 'VGCP-00002',
    name: 'Data encryption at rest',
    description: 'All sensitive data stored in production must be encrypted at rest using approved keys.',
    owner: 'Bob Smith',
    sme: 'Dana White',
    tester: 'Eve Tester',
    needsEscalation: true,
    dat: { status: 'In Progress', step: 'Key rotation verification' },
    oet: { status: 'Not Started' },
    testingNotes: 'Waiting for key rotation logs.',
    startDate: '2025-08-10',
    dueDate: '2025-09-10',
    eta: undefined,
    completedDate: undefined,
  },
  {
    id: 'VGCP-00003',
    name: 'Secure development lifecycle',
    description: 'SAST and code review processes are followed prior to release.',
    owner: 'Carol Lee',
    sme: undefined,
    tester: 'Frank Auditor',
    needsEscalation: false,
    dat: { status: 'Not Started' },
    oet: { status: 'Not Started' },
    testingNotes: undefined,
    startDate: undefined,
    dueDate: undefined,
    eta: undefined,
    completedDate: undefined,
  },
]

export const mockRequests: TestRequest[] = [
  {
    id: 'r' + String(Date.now() - 1000000),
    controlId: 'VGCP-00001',
    requestedBy: 'Grace QA',
    scope: 'Provide MFA enrollment evidence for all admin accounts for Q3.',
    dueDate: '2025-10-10',
    status: 'Pending',
  },
  {
    id: 'r' + String(Date.now() - 500000),
    controlId: 'VGCP-00002',
    requestedBy: 'Henry Auditor',
    scope: 'Provide last two encryption key rotation events and related tickets.',
    dueDate: '2025-09-20',
    status: 'In Progress',
  },
  {
    id: 'r' + String(Date.now()),
    controlId: 'VGCP-00003',
    requestedBy: 'Ivy Analyst',
    scope: 'Attach SAST report for release v1.4.0',
    dueDate: '2025-11-01',
    status: 'Complete',
  },
]

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
