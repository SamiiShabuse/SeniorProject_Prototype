const fs = require('fs')
const path = require('path')

// Load the normalized controls
const normalizedPath = path.resolve(__dirname, '..', 'tmp', 'normalized_controls.json')
if (!fs.existsSync(normalizedPath)) {
  console.error('Normalized controls file not found. Please run import_controls.cjs first.')
  process.exit(1)
}

const normalizedData = JSON.parse(fs.readFileSync(normalizedPath, 'utf-8'))
const normalized = normalizedData.normalized

// Sample pools
const _sampleOwners = [
  'Alice Johnson',
  'Bob Smith',
  'Carol Lee',
  'David Nguyen',
  'Emma Thompson',
  'Frank Miller',
  'Grace Hopper',
  'Hector Alvarez',
  'Isabella Chen',
  'James Wilson',
  'Katherine Brown',
  'Liam O\'Connor',
  'Maria Garcia',
  'Nathan Kim',
  'Olivia Martinez',
  'Paul Anderson',
]

const _sampleSMEs = [
  'Carlos Rivera',
  'Dana White',
  'Ivy Patel',
  'Jamal Carter',
  'Kira Matsumoto',
  'Lucas Schmidt',
  'Maya Patel',
  'Nina Rodriguez',
  'Oscar Zhang',
  'Priya Kumar',
]

const _sampleTesters = [
  'Morgan Lee',
  'Eve Tester',
  'Frank Auditor',
  'Selina Park',
  'Noah Brooks',
  'Alex Kim',
  'Bella Torres',
  'Chris Wong',
  'Diana Foster',
  'Eric Chang',
]

const _datStatuses = [
  'Not Started',
  'In Progress',
  'Testing Completed',
  'Addressing Comments',
  'Completed',
]

const _oetStatuses = [
  'Not Started',
  'In Progress',
  'Testing Completed',
  'Addressing Comments',
  'Completed',
]

// Seeded random number generator
function _seededRandom(seed) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function _fmtDate(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function _randomDate(start, end, rand) {
  const startTime = start.getTime()
  const endTime = end.getTime()
  const randomTime = startTime + rand() * (endTime - startTime)
  return new Date(randomTime)
}

// Generate randomized controls
const mockControls = normalized.map((r, i) => {
  const seed = i * 7919 + (r.id ? String(r.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0)
  const rand = _seededRandom(seed)

  // Randomly choose owner, SME, and tester
  const owner = r.owner && String(r.owner).trim()
    ? String(r.owner)
    : _sampleOwners[Math.floor(rand() * _sampleOwners.length)]
  const sme = r.sme && String(r.sme).trim()
    ? String(r.sme)
    : _sampleSMEs[Math.floor(rand() * _sampleSMEs.length)]
  const tester = _sampleTesters[Math.floor(rand() * _sampleTesters.length)]

  // Randomly assign DAT and OET statuses if not provided
  let datStatus = r.dat?.status
  if (!datStatus || String(datStatus).trim() === '') {
    datStatus = _datStatuses[Math.floor(rand() * _datStatuses.length)]
  }
  
  let oetStatus = r.oet?.status
  if (!oetStatus || String(oetStatus).trim() === '') {
    oetStatus = _oetStatuses[Math.floor(rand() * _oetStatuses.length)]
  }

  // Randomly assign escalation (20% chance)
  const needsEscalation = r.needsEscalation !== undefined
    ? Boolean(r.needsEscalation)
    : rand() < 0.2

  // Generate random dates across a wider range (Jan 2025 - Dec 2025)
  const dateRangeStart = new Date(2025, 0, 1)
  const dateRangeEnd = new Date(2025, 11, 31)
  
  let startDateStr = r.startDate ? String(r.startDate) : undefined
  if (!startDateStr) {
    const sd = _randomDate(dateRangeStart, dateRangeEnd, rand)
    startDateStr = _fmtDate(sd)
  }
  
  let dueDateStr = r.dueDate ? String(r.dueDate) : undefined
  if (!dueDateStr) {
    const startDate = new Date(startDateStr || dateRangeStart)
    const daysOffset = 15 + Math.floor(rand() * 75)
    const dueDate = new Date(startDate)
    dueDate.setDate(dueDate.getDate() + daysOffset)
    if (dueDate <= dateRangeEnd) {
      dueDateStr = _fmtDate(dueDate)
    }
  }
  
  let completedDateStr = r.completedDate ? String(r.completedDate) : undefined
  if (!completedDateStr && (String(datStatus).toLowerCase().includes('complete') || /completed/i.test(String(r.testingNotes || '')))) {
    if (dueDateStr) {
      const dueDate = new Date(dueDateStr)
      const daysOffset = Math.floor(rand() * 30)
      const completedDate = new Date(dueDate)
      completedDate.setDate(completedDate.getDate() + daysOffset)
      completedDateStr = _fmtDate(completedDate)
    }
  }

  // Randomly add ETA (30% chance)
  let eta = r.eta ? String(r.eta) : undefined
  if (!eta && rand() < 0.3 && dueDateStr) {
    const dueDate = new Date(dueDateStr)
    const daysOffset = Math.floor(rand() * 14) - 7
    const etaDate = new Date(dueDate)
    etaDate.setDate(etaDate.getDate() + daysOffset)
    eta = _fmtDate(etaDate)
  }

  // Randomly add testing notes (40% chance) if not present
  let testingNotes = r.testingNotes ? String(r.testingNotes) : undefined
  if (!testingNotes && rand() < 0.4) {
    const noteTemplates = [
      'Initial testing completed successfully',
      'Pending review from QA team',
      'Minor issues identified, addressing comments',
      'All test cases passed',
      'Waiting for stakeholder approval',
      'Testing in progress, expected completion next week',
      'Blocked pending external dependency',
      'Re-testing after fixes applied',
    ]
    testingNotes = noteTemplates[Math.floor(rand() * noteTemplates.length)]
  }

  const control = {
    id: String(r.id),
    name: String(r.name || ''),
    ...(r.description ? { description: String(r.description) } : {}),
    owner,
    ...(sme ? { sme } : {}),
    ...(tester ? { tester } : {}),
    needsEscalation,
    dat: { status: datStatus, ...(r.dat?.step ? { step: r.dat.step } : {}) },
    oet: { status: oetStatus, ...(r.oet?.step ? { step: r.oet.step } : {}) },
    ...(testingNotes ? { testingNotes } : {}),
    ...(startDateStr ? { startDate: startDateStr } : {}),
    ...(dueDateStr ? { dueDate: dueDateStr } : {}),
    ...(eta ? { eta } : {}),
    ...(completedDateStr ? { completedDate: completedDateStr } : {}),
  }

  // Remove undefined values
  return Object.fromEntries(Object.entries(control).filter(([_, v]) => v !== undefined))
})

// Generate random requests
const _requestRequesters = [
  'Grace QA',
  'Henry Auditor',
  'Ivy Analyst',
  'Jack Compliance',
  'Kelly Reviewer',
  'Liam Inspector',
  'Maya Validator',
  'Noah Examiner',
  'Olivia Assessor',
  'Paul Verifier',
]

const _requestScopes = [
  'Provide MFA enrollment evidence for all admin accounts for Q3.',
  'Provide last two encryption key rotation events and related tickets.',
  'Attach SAST report for release v1.4.0',
  'Submit evidence of quarterly access reviews completed in Q2.',
  'Document firewall rule changes and approval workflow.',
  'Provide audit logs for privileged account access in last 30 days.',
  'Submit vulnerability scan results for production environment.',
  'Document incident response procedures and recent test exercises.',
  'Provide evidence of data backup and recovery testing.',
  'Submit change management records for critical system updates.',
  'Document password policy enforcement and compliance metrics.',
  'Provide evidence of security awareness training completion rates.',
  'Submit network segmentation documentation and diagrams.',
  'Document third-party vendor security assessments.',
  'Provide evidence of patch management process and recent deployments.',
]

const _requestSeed = 12345
const _numRequests = 20

const mockRequests = Array.from({ length: _numRequests }, (_, i) => {
  const rand = _seededRandom(_requestSeed + i * 1000)
  
  // Randomly select a control ID
  const controlIndex = Math.floor(rand() * Math.min(50, mockControls.length))
  const controlId = mockControls[controlIndex]?.id || mockControls[0]?.id || 'VGCP-10000'
  
  // Random status with weighted distribution
  let status
  const statusRand = rand()
  if (statusRand < 0.4) {
    status = 'Pending'
  } else if (statusRand < 0.75) {
    status = 'In Progress'
  } else {
    status = 'Complete'
  }
  
  // Random requester and scope
  const requestedBy = _requestRequesters[Math.floor(rand() * _requestRequesters.length)]
  const scope = _requestScopes[Math.floor(rand() * _requestScopes.length)]
  
  // Random due date
  const baseDate = new Date(2025, 5, 15)
  let dueDate
  if (status === 'Complete') {
    const daysAgo = 5 + Math.floor(rand() * 60)
    dueDate = new Date(baseDate)
    dueDate.setDate(dueDate.getDate() - daysAgo)
  } else {
    const daysAhead = 30 + Math.floor(rand() * 90)
    dueDate = new Date(baseDate)
    dueDate.setDate(dueDate.getDate() + daysAhead)
  }
  
  return {
    id: `r${Date.now()}-${i}-${Math.floor(rand() * 10000)}`,
    controlId,
    requestedBy,
    scope,
    dueDate: _fmtDate(dueDate),
    status,
  }
})

// Write output
const outputPath = path.resolve(__dirname, '..', 'tmp', 'generated_mock_data.json')
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(
  outputPath,
  JSON.stringify(
    {
      controls: mockControls,
      requests: mockRequests,
      generatedAt: new Date().toISOString(),
      stats: {
        totalControls: mockControls.length,
        totalRequests: mockRequests.length,
        statusDistribution: {
          dat: mockControls.reduce((acc, c) => {
            const status = c.dat?.status || 'Not Started'
            acc[status] = (acc[status] || 0) + 1
            return acc
          }, {}),
          requests: mockRequests.reduce((acc, r) => {
            acc[r.status] = (acc[r.status] || 0) + 1
            return acc
          }, {}),
        },
      },
    },
    null,
    2
  )
)

console.log(`✅ Generated mock data:`)
console.log(`   - ${mockControls.length} controls`)
console.log(`   - ${mockRequests.length} requests`)
console.log(`   - Saved to: ${outputPath}`)
console.log(`\n📊 Status Distribution:`)
console.log(`   DAT Statuses:`, Object.entries(
  mockControls.reduce((acc, c) => {
    const status = c.dat?.status || 'Not Started'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})
).map(([k, v]) => `${k}: ${v}`).join(', '))
console.log(`   Request Statuses:`, Object.entries(
  mockRequests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {})
).map(([k, v]) => `${k}: ${v}`).join(', '))

