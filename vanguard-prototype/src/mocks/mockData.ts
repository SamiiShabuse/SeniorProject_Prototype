export type Control = {
  id: string
  title: string
  description?: string
  status: 'draft' | 'active' | 'testing' | 'retired'
  owner?: string
  lastTested?: string // ISO date string
  relatedRequests?: string[]
}

export type Request = {
  id: string
  title: string
  description?: string
  status: 'open' | 'in-progress' | 'closed' | 'retired'
  createdBy?: string
  createdAt?: string // ISO date string
  relatedControlId?: string
}

export const mockControls: Control[] = [
  {
    id: 'C-001',
    title: 'Access Control: Admin Accounts',
    description: 'Ensure admin accounts have MFA and are logged.',
    status: 'active',
    owner: 'Alice Johnson',
    lastTested: '2025-10-15T09:30:00Z',
    relatedRequests: ['R-101'],
  },
  {
    id: 'C-002',
    title: 'Data Encryption at Rest',
    description: 'All sensitive data encrypted using AES-256.',
    status: 'testing',
    owner: 'Bob Smith',
    lastTested: '2025-09-30T14:00:00Z',
    relatedRequests: ['R-102', 'R-103'],
  },
  {
    id: 'C-003',
    title: 'Secure Development Lifecycle',
    description: 'SAST and code reviews are performed on every release.',
    status: 'draft',
    owner: 'Carol Lee',
  },
]

export const mockRequests: Request[] = [
  {
    id: 'R-101',
    title: 'Request test evidence for admin MFA',
    description: 'Need proof that admin accounts are enrolled in MFA and logs retained.',
    status: 'open',
    createdBy: 'Eve Tester',
    createdAt: '2025-10-20T12:00:00Z',
    relatedControlId: 'C-001',
  },
  {
    id: 'R-102',
    title: 'Encryption key rotation details',
    description: 'Provide the last two key rotation events and procedure.',
    status: 'in-progress',
    createdBy: 'Frank Auditor',
    createdAt: '2025-08-11T08:45:00Z',
    relatedControlId: 'C-002',
  },
  {
    id: 'R-103',
    title: 'SAST results for release v1.4.0',
    description: 'Attach SAST report and remediation tickets.',
    status: 'closed',
    createdBy: 'Grace QA',
    createdAt: '2025-07-01T16:20:00Z',
    relatedControlId: 'C-002',
  },
]

export default {
  mockControls,
  mockRequests,
}
