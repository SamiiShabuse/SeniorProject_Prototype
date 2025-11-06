const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')

const workbookPath = path.resolve(__dirname, '..', 'Controls Tracker - Example.xlsx')
if (!fs.existsSync(workbookPath)) {
  console.error('Workbook not found at', workbookPath)
  process.exit(1)
}

const wb = XLSX.readFile(workbookPath)
const sheetNames = wb.SheetNames
console.log('Found sheets:', sheetNames)

// pick the first sheet for controls by default
const sheet = wb.Sheets[sheetNames[0]]
const rows = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false })

// Basic alias map similar to normalizers.ts
const aliases = {
  id: ['VGCP ID','VGCP','Control ID','ID'],
  name: ['Procedure Name','Control Name','Procedure','Controls','Description (short)'],
  description: ['Description','Long Description','Details'],
  testingNotes: ['Testing Details','Notes','Details','Walkthrough Notes'],
  owner: ['Control Owner','Owner','Primary Owner'],
  sme: ['Control SME','SME','Subject Matter Expert'],
  tester: ['Tester','Assignee','Analyst','Tester Name'],
  needsEscalation: ['Escalation Needed? (Yes / No)','Escalation Needed?','Escalation','Needs Escalation'],
  dat_status: ['DAT Status','DAT','Data Assurance Testing Status'],
  dat_step: ['DAT In-progress Step','DAT Step','DAT Substep'],
  oet_status: ['OET Status','OET','Operational Effectiveness Status'],
  oet_step: ['OET In-progress Step','OET Step','OET Substep'],
  startDate: ['Date Started','Start Date','Testing Start'],
  dueDate: ['Due Date','Target Date','Planned Due'],
  eta: ['ETA','Estimated Completion','Target ETA'],
  completedDate: ['Date Completed','Completed Date','Finish Date'],
}

function normalizeKey(k){
  return String(k || '').replace(/[^a-z0-9]/gi,'').toLowerCase()
}

function pick(row, list){
  if (!row) return null
  const keys = Object.keys(row)
  for(const alias of list){
    const na = normalizeKey(alias)
    for(const k of keys){
      const nk = normalizeKey(k)
      if(nk===na || nk.includes(na) || na.includes(nk)){
        const v = row[k]
        if (v !== null && v !== undefined && String(v).trim() !== '') return v
      }
    }
  }
  return null
}

function coerceBoolean(v){
  if (v===null||v===undefined) return undefined
  const s = String(v).trim().toLowerCase()
  if(['yes','y','true','t','1'].includes(s)) return true
  if(['no','n','false','f','0'].includes(s)) return false
  return undefined
}

function coercePhaseStatus(v){
  if (v===null||v===undefined) return 'Not Started'
  const s = String(v).trim().toLowerCase()
  if(s==='') return 'Not Started'
  if(/in progress|progress|working/.test(s)) return 'In Progress'
  if(/testing complete|tested|done testing|testing completed/.test(s)) return 'Testing Completed'
  if(/addressing|comments|addressing comments/.test(s)) return 'Addressing Comments'
  if(/complete|completed|closed/.test(s)) return 'Completed'
  return 'Not Started'
}

function coerceISODate(v){
  if (!v) return null
  // try parse
  const d = new Date(v)
  if(!isNaN(d.getTime())){
    return d.toISOString().slice(0,10)
  }
  // try MM/DD/YYYY
  const m = String(v).match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/)
  if(m){
    const mm = Number(m[1]), dd = Number(m[2]), yy = Number(m[3])
    const ddObj = new Date(Date.UTC(yy, mm-1, dd))
    if(!isNaN(ddObj.getTime())) return ddObj.toISOString().slice(0,10)
  }
  return null
}

const normalized = rows.map((r, idx) => {
  const id = pick(r, aliases.id) || `VGCP-${String(idx+10000).padStart(5,'0')}`
  const name = pick(r, aliases.name) || ''
  const owner = pick(r, aliases.owner) || ''
  const description = pick(r, aliases.description) || null
  const tester = pick(r, aliases.tester) || null
  const sme = pick(r, aliases.sme) || null
  const needsEsc = coerceBoolean(pick(r, aliases.needsEscalation))
  const datStatus = coercePhaseStatus(pick(r, aliases.dat_status))
  const datStep = pick(r, aliases.dat_step) || null
  const oetStatus = coercePhaseStatus(pick(r, aliases.oet_status))
  const oetStep = pick(r, aliases.oet_step) || null
  const startDate = coerceISODate(pick(r, aliases.startDate))
  const dueDate = coerceISODate(pick(r, aliases.dueDate))
  const eta = coerceISODate(pick(r, aliases.eta))
  const completedDate = coerceISODate(pick(r, aliases.completedDate))

  return {
    id: String(id).trim(),
    name: String(name).trim(),
    description: description ? String(description).trim() : undefined,
    owner: String(owner).trim(),
    sme: sme ? String(sme).trim() : undefined,
    tester: tester ? String(tester).trim() : undefined,
    needsEscalation: needsEsc === undefined ? false : needsEsc,
    dat: { status: datStatus, step: datStep ? String(datStep).trim() : undefined },
    oet: { status: oetStatus, step: oetStep ? String(oetStep).trim() : undefined },
    testingNotes: pick(r, aliases.testingNotes) ? String(pick(r, aliases.testingNotes)).trim() : undefined,
    startDate,
    dueDate,
    eta,
    completedDate,
  }
})

const outPath = path.resolve(__dirname, '..', 'tmp', 'normalized_controls.json')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify({ normalized, rawCount: rows.length, sheet: sheetNames[0] }, null, 2))
console.log('Wrote normalized output to', outPath)
