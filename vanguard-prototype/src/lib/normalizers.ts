/*
  Normalizers for Control and TestRequest rows.

  Exports:
    - normalizeControl(raw)
    - normalizeRequest(raw)
    - coerceBoolean, coercePhaseStatus, coerceISODate, pick
    - hasColumn, columnAliases (for tweaking mappings)

  Notes:
    - This module is pure (no I/O). Works on single row objects produced by XLSX/CSV parsers.
    - It attempts to be permissive with header synonyms and date formats.
    - If required fields are missing or invalid (per spec), it throws a helpful Error.
*/

import type { Control, TestRequest, PhaseStatus, TestRequestStatus } from './types'

// --- Alias table (exported so mappings can be tuned externally) -----------------
export const columnAliases: Record<string, string[]> = {
  // Controls
  id: ['VGCP ID', 'VGCP', 'Control ID', 'ID'],
  name: ['Procedure Name', 'Control Name', 'Procedure', 'Controls', 'Description (short)'],
  description: ['Description', 'Long Description', 'Details'],
  testingNotes: ['Testing Details', 'Notes', 'Details', 'Walkthrough Notes'],
  owner: ['Control Owner', 'Owner', 'Primary Owner'],
  sme: ['Control SME', 'SME', 'Subject Matter Expert'],
  tester: ['Tester', 'Assignee', 'Analyst', 'Tester Name'],
  needsEscalation: ['Escalation Needed? (Yes / No)', 'Escalation Needed?', 'Escalation', 'Needs Escalation'],
  dat_status: ['DAT Status', 'DAT', 'Data Assurance Testing Status'],
  dat_step: ['DAT In-progress Step', 'DAT Step', 'DAT Substep'],
  oet_status: ['OET Status', 'OET', 'Operational Effectiveness Status'],
  oet_step: ['OET In-progress Step', 'OET Step', 'OET Substep'],
  startDate: ['Date Started', 'Start Date', 'Testing Start'],
  dueDate: ['Due Date', 'Target Date', 'Planned Due'],
  eta: ['ETA', 'Estimated Completion', 'Target ETA'],
  completedDate: ['Date Completed', 'Completed Date', 'Finish Date'],

  // Requests
  req_id: ['Request ID', 'Req ID', 'ReqID', 'ID'],
  req_controlId: ['VGCP ID', 'Control ID', 'VGCP', 'ControlID'],
  req_requestedBy: ['Requested By', 'Requester', 'Submitter', 'User'],
  req_scope: ['Scope', 'Request Scope', 'Description'],
  req_dueDate: ['Due Date', 'Target Date', 'Planned Due'],
  req_status: ['Status', 'Request Status'],
}

// --- Helpers -------------------------------------------------------------------
function normalizeKey(k: string) {
  return k.replace(/[^a-z0-9]/gi, '').toLowerCase()
}

export function pick(raw: Record<string, unknown>, ...aliases: string[]): unknown {
  // Return first non-empty value found for any alias. Case/space-insensitive.
  const keyList = Object.keys(raw)

  const normalizedKeys = keyList.map((k) => ({
    k,
    nk: normalizeKey(k),
  }))

  for (const alias of aliases) {
    const normAlias = normalizeKey(alias)

    // direct matches or partial matches
    for (const { k, nk } of normalizedKeys) {
      if (nk === normAlias || nk.includes(normAlias) || normAlias.includes(nk)) {
        const v = raw[k]
        if (v !== undefined && v !== null && String(v).trim() !== '') return v
        // found a matching column but empty — continue searching other aliases
      }
    }
  }

  // fallback: try looser contains check (useful when headers vary)
  for (const alias of aliases) {
    const normAlias = normalizeKey(alias)
    for (const { k, nk } of normalizedKeys) {
      if (nk.indexOf(normAlias) !== -1) {
        const v = raw[k]
        if (v !== undefined && v !== null && String(v).trim() !== '') return v
      }
    }
  }

  return undefined
}

export function hasColumn(raw: Record<string, unknown>, ...aliases: string[]): boolean {
  const keys = Object.keys(raw).map((k) => normalizeKey(k))
  for (const alias of aliases) {
    const na = normalizeKey(alias)
    if (keys.some((k) => k === na || k.includes(na) || na.includes(k))) return true
  }
  return false
}

export function coerceBoolean(v: unknown): boolean | undefined {
  if (v === null || v === undefined) return undefined
  if (typeof v === 'boolean') return v
  const s = String(v).trim().toLowerCase()
  if (s === '') return undefined
  if (['yes', 'y', 'true', 't', '1'].includes(s)) return true
  if (['no', 'n', 'false', 'f', '0'].includes(s)) return false
  return undefined
}

export function coercePhaseStatus(v: unknown): PhaseStatus {
  if (v === null || v === undefined) return 'Not Started'
  const s = String(v).trim().toLowerCase()
  if (s === '') return 'Not Started'

  if (/in progress|progress|working/.test(s)) return 'In Progress'
  if (/testing complete|tested|done testing|testing completed/.test(s)) return 'Testing Completed'
  if (/addressing|comments|addressing comments/.test(s)) return 'Addressing Comments'
  if (/complete|completed|closed/.test(s)) return 'Completed'
  return 'Not Started'
}

export function coerceISODate(v: unknown): string | undefined {
  if (v === null || v === undefined || v === '') return undefined

  // Date object
  if (v instanceof Date && !Number.isNaN(v.getTime())) {
    return v.toISOString().slice(0, 10)
  }

  // Excel serial number (days since 1899-12-30)
  if (typeof v === 'number' && Number.isFinite(v)) {
    const days = Math.floor(v)
    const ms = Date.UTC(1899, 11, 30) + days * 24 * 60 * 60 * 1000
    const d = new Date(ms)
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }

  // String — try multiple formats
  const s = String(v).trim()
  // Try ISO-ish parse
  const parsed = Date.parse(s)
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10)
  }

  // Try MM/DD/YYYY or M/D/YYYY
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s|$)/)
  if (m) {
    const mm = Number(m[1])
    const dd = Number(m[2])
    const yyyy = Number(m[3])
    const d = new Date(Date.UTC(yyyy, mm - 1, dd))
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }

  // Try YYYY-MM-DD like strings with time
  const m2 = s.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m2) {
    const d = new Date(`${m2[1]}-${m2[2]}-${m2[3]}T00:00:00Z`)
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }

  return undefined
}

function titleCaseName(raw?: unknown): string | undefined {
  if (raw === undefined || raw === null) return undefined
  const s = String(raw).trim()
  if (s === '' || /^n\/?a$/i.test(s)) return undefined
  return s
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

// --- Normalizers ---------------------------------------------------------------
export function normalizeControl(raw: Record<string, unknown>): Control {
  // pick helpers using alias table
  const rawId = pick(raw, ...(columnAliases.id ?? [])) as string | undefined
  const id = rawId ? String(rawId).trim() : undefined

  const nameRaw = pick(raw, ...(columnAliases.name ?? [])) as string | undefined
  const name = nameRaw ? String(nameRaw).trim() : undefined

  const ownerRaw = pick(raw, ...(columnAliases.owner ?? [])) as string | undefined
  const owner = titleCaseName(ownerRaw)

  // needsEscalation: must be present as a column (even if empty -> defaults to false)
  const hasEsc = hasColumn(raw, ...(columnAliases.needsEscalation ?? []))
  const escRaw = pick(raw, ...(columnAliases.needsEscalation ?? []))
  const escBool = coerceBoolean(escRaw)
  if (!hasEsc) throw new Error(`Missing required column for needsEscalation (aliases: ${columnAliases.needsEscalation.join(', ')})`)
  const needsEscalation = escBool ?? false

  // statuses
  const datRaw = pick(raw, ...(columnAliases.dat_status ?? []))
  const datStatus = coercePhaseStatus(datRaw)
  const datStep = pick(raw, ...(columnAliases.dat_step ?? [])) as string | undefined

  const oetRaw = pick(raw, ...(columnAliases.oet_status ?? []))
  const oetStatus = coercePhaseStatus(oetRaw)
  const oetStep = pick(raw, ...(columnAliases.oet_step ?? [])) as string | undefined

  // testing notes
  const testingNotes = pick(raw, ...(columnAliases.testingNotes ?? [])) as string | undefined

  // dates
  const startDate = coerceISODate(pick(raw, ...(columnAliases.startDate ?? [])))
  const dueDate = coerceISODate(pick(raw, ...(columnAliases.dueDate ?? [])))
  const eta = coerceISODate(pick(raw, ...(columnAliases.eta ?? [])))
  const completedDate = coerceISODate(pick(raw, ...(columnAliases.completedDate ?? [])))

  // optional text fields
  const description = pick(raw, ...(columnAliases.description ?? [])) as string | undefined
  const sme = titleCaseName(pick(raw, ...(columnAliases.sme ?? [])))
  const tester = titleCaseName(pick(raw, ...(columnAliases.tester ?? [])))

  // Build control and validate required fields
  const control: Partial<Control> = {
    id: id ?? undefined,
    name: name ?? undefined,
    description: description ? String(description).trim() : undefined,
    owner: owner ?? undefined,
    sme: sme,
    tester: tester,
    needsEscalation,
    dat: { status: datStatus, step: datStep ? String(datStep).trim() : undefined },
    oet: { status: oetStatus, step: oetStep ? String(oetStep).trim() : undefined },
    testingNotes: testingNotes ? String(testingNotes).trim() : undefined,
    startDate: startDate,
    dueDate: dueDate,
    eta: eta,
    completedDate: completedDate,
  }

  // Required fields: Control.id, Control.name, Control.owner, Control.needsEscalation, Control.dat.status, Control.oet.status
  assert(control.id !== undefined && String(control.id).trim() !== '', 'Control.id is required but missing or empty')
  assert(control.name !== undefined && String(control.name).trim() !== '', 'Control.name is required but missing or empty')
  assert(control.owner !== undefined && String(control.owner).trim() !== '', 'Control.owner is required but missing or empty')
  assert(typeof control.needsEscalation === 'boolean', 'Control.needsEscalation must be boolean')
  assert(control.dat !== undefined && control.dat.status !== undefined, 'Control.dat.status is required')
  assert(control.oet !== undefined && control.oet.status !== undefined, 'Control.oet.status is required')

  // Return typed Control
  return control as Control
}

export function normalizeRequest(raw: Record<string, unknown>): TestRequest {
  // pick request fields
  let id = pick(raw, ...(columnAliases.req_id ?? [])) as string | undefined
  if (!id || String(id).trim() === '') id = `r${Date.now()}`

  const controlIdRaw = pick(raw, ...(columnAliases.req_controlId ?? [])) as string | undefined
  const controlId = controlIdRaw ? String(controlIdRaw).trim() : undefined

  const requestedByRaw = pick(raw, ...(columnAliases.req_requestedBy ?? [])) as string | undefined
  const requestedBy = requestedByRaw ? String(requestedByRaw).trim() : undefined

  const scopeRaw = pick(raw, ...(columnAliases.req_scope ?? [])) as string | undefined
  const scope = scopeRaw ? String(scopeRaw).trim() : undefined

  const dueDateRaw = pick(raw, ...(columnAliases.req_dueDate ?? []))
  const dueDate = coerceISODate(dueDateRaw)

  const statusRaw = pick(raw, ...(columnAliases.req_status ?? [])) as string | undefined
  const status = (statusRaw && String(statusRaw).trim() !== '') ? (String(statusRaw).trim() as TestRequestStatus) : 'Pending'

  // Required: controlId, requestedBy, scope, dueDate
  assert(controlId !== undefined && controlId !== '', 'TestRequest.controlId is required but missing')
  assert(requestedBy !== undefined && requestedBy !== '', 'TestRequest.requestedBy is required but missing')
  assert(scope !== undefined && scope !== '', 'TestRequest.scope is required but missing')
  assert(dueDate !== undefined, 'TestRequest.dueDate is required and could not be parsed')

  const req: TestRequest = {
    id: String(id),
    controlId: String(controlId),
    requestedBy: String(requestedBy),
    scope: String(scope),
    dueDate: dueDate!,
    status: (['Pending', 'In Progress', 'Complete'].includes(status) ? status : 'Pending') as TestRequestStatus,
  }

  return req
}

/*
  Examples (usage comments):

  // Example Control
  // normalizeControl({ 'VGCP ID': 'VGCP-05603', 'Procedure Name': 'Red Team...', 'Control Owner': '  jason  ', ... })

  // Example Request
  // normalizeRequest({ 'VGCP ID': 'VGCP-05603', 'Requested By': 'Morgan Lee', 'Scope': 'Q1', 'Due Date': '1/31/2025' })

*/
