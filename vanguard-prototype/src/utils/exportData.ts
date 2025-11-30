// @ts-ignore - xlsx types may not be perfect
import * as XLSX from 'xlsx'
import type { Control, TestRequest } from '../lib/types'

// Export controls to CSV
export function exportControlsToCSV(controls: Control[], filename = 'controls_export.csv') {
  const headers = [
    'ID',
    'Name',
    'Description',
    'Owner',
    'SME',
    'Tester',
    'DAT Status',
    'OET Status',
    'Needs Escalation',
    'Start Date',
    'Due Date',
    'ETA',
    'Completed Date',
    'Testing Notes',
  ]

  const rows = controls.map((c) => [
    c.id,
    c.name || '',
    c.sme || c.description || '',
    c.owner || '',
    c.sme || '',
    c.tester || '',
    c.dat?.status || '',
    c.oet?.status || '',
    c.needsEscalation ? 'Yes' : 'No',
    c.startDate || '',
    c.dueDate || '',
    c.eta || '',
    c.completedDate || '',
    c.testingNotes || '',
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

// Export requests to CSV
export function exportRequestsToCSV(requests: TestRequest[], filename = 'requests_export.csv') {
  const headers = ['ID', 'Control ID', 'Requested By', 'Scope', 'Due Date', 'Status']

  const rows = requests.map((r) => [r.id, r.controlId, r.requestedBy, r.scope, r.dueDate, r.status])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

// Export controls to JSON
export function exportControlsToJSON(controls: Control[], filename = 'controls_export.json') {
  const jsonContent = JSON.stringify(controls, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

// Export requests to JSON
export function exportRequestsToJSON(requests: TestRequest[], filename = 'requests_export.json') {
  const jsonContent = JSON.stringify(requests, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

// Export controls to Excel
export function exportControlsToExcel(controls: Control[], filename = 'controls_export.xlsx') {
  const worksheetData = controls.map((c) => ({
    'Control ID': c.id,
    Name: c.name || '',
    Description: c.sme || c.description || '',
    Owner: c.owner || '',
    SME: c.sme || '',
    Tester: c.tester || '',
    'DAT Status': c.dat?.status || '',
    'OET Status': c.oet?.status || '',
    'Needs Escalation': c.needsEscalation ? 'Yes' : 'No',
    'Start Date': c.startDate || '',
    'Due Date': c.dueDate || '',
    ETA: c.eta || '',
    'Completed Date': c.completedDate || '',
    'Testing Notes': c.testingNotes || '',
  }))

  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Controls')

  XLSX.writeFile(workbook, filename)
}

// Export requests to Excel
export function exportRequestsToExcel(requests: TestRequest[], filename = 'requests_export.xlsx') {
  const worksheetData = requests.map((r) => ({
    'Request ID': r.id,
    'Control ID': r.controlId,
    'Requested By': r.requestedBy,
    Scope: r.scope,
    'Due Date': r.dueDate,
    Status: r.status,
  }))

  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Requests')

  XLSX.writeFile(workbook, filename)
}

// Export dashboard summary data
export function exportDashboardSummary(
  controls: Control[],
  requests: TestRequest[],
  format: 'csv' | 'json' | 'excel' = 'excel'
) {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  const baseFilename = `dashboard_export_${timestamp}`

  if (format === 'csv') {
    exportControlsToCSV(controls, `${baseFilename}_controls.csv`)
    setTimeout(() => exportRequestsToCSV(requests, `${baseFilename}_requests.csv`), 100)
  } else if (format === 'json') {
    const summary = {
      exportedAt: new Date().toISOString(),
      summary: {
        totalControls: controls.length,
        totalRequests: requests.length,
        activeControls: controls.filter(
          (c) =>
            (c.dat?.status ?? '').toLowerCase() !== 'completed' &&
            !(String(c.dat?.status ?? '').trim() === '' && /completed/i.test(String(c.testingNotes ?? '') + String(c.sme ?? '')))
        ).length,
        openRequests: requests.filter((r) => (r.status ?? '').toLowerCase() !== 'complete').length,
      },
      controls,
      requests,
    }
    const jsonContent = JSON.stringify(summary, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${baseFilename}.json`
    link.click()
  } else {
    // Excel with multiple sheets
    const controlsData = controls.map((c) => ({
      'Control ID': c.id,
      Name: c.name || '',
      Description: c.sme || c.description || '',
      Owner: c.owner || '',
      SME: c.sme || '',
      Tester: c.tester || '',
      'DAT Status': c.dat?.status || '',
      'OET Status': c.oet?.status || '',
      'Needs Escalation': c.needsEscalation ? 'Yes' : 'No',
      'Start Date': c.startDate || '',
      'Due Date': c.dueDate || '',
      ETA: c.eta || '',
      'Completed Date': c.completedDate || '',
      'Testing Notes': c.testingNotes || '',
    }))

    const requestsData = requests.map((r) => ({
      'Request ID': r.id,
      'Control ID': r.controlId,
      'Requested By': r.requestedBy,
      Scope: r.scope,
      'Due Date': r.dueDate,
      Status: r.status,
    }))

    const controlsSheet = XLSX.utils.json_to_sheet(controlsData)
    const requestsSheet = XLSX.utils.json_to_sheet(requestsData)
    const summarySheet = XLSX.utils.json_to_sheet([
      {
        Metric: 'Total Controls',
        Value: controls.length,
      },
      {
        Metric: 'Active Controls',
        Value: controls.filter(
          (c) =>
            (c.dat?.status ?? '').toLowerCase() !== 'completed' &&
            !(String(c.dat?.status ?? '').trim() === '' && /completed/i.test(String(c.testingNotes ?? '') + String(c.sme ?? '')))
        ).length,
      },
      {
        Metric: 'Total Requests',
        Value: requests.length,
      },
      {
        Metric: 'Open Requests',
        Value: requests.filter((r) => (r.status ?? '').toLowerCase() !== 'complete').length,
      },
      {
        Metric: 'Export Date',
        Value: new Date().toISOString(),
      },
    ])

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
    XLSX.utils.book_append_sheet(workbook, controlsSheet, 'Controls')
    XLSX.utils.book_append_sheet(workbook, requestsSheet, 'Requests')

    XLSX.writeFile(workbook, `${baseFilename}.xlsx`)
  }
}

// Export selected dashboard components (controls, requests, summary, upcoming, teamBandwidth)
export function exportSelectedComponents(
  controls: Control[],
  requests: TestRequest[],
  selected: string[],
  format: 'json' | 'excel' = 'json'
) {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  const baseFilename = `dashboard_components_export_${timestamp}`

  const include = (name: string) => selected.includes(name)

  if (format === 'json') {
    const payload: Record<string, any> = { exportedAt: new Date().toISOString() }
    if (include('summary')) {
      payload.summary = {
        totalControls: controls.length,
        totalRequests: requests.length,
        activeControls: controls.filter(
          (c) =>
            (c.dat?.status ?? '').toLowerCase() !== 'completed' &&
            !(String(c.dat?.status ?? '').trim() === '' && /completed/i.test(String(c.testingNotes ?? '') + String(c.sme ?? '')))
        ).length,
        openRequests: requests.filter((r) => (r.status ?? '').toLowerCase() !== 'complete').length,
      }
    }
    if (include('controls')) payload.controls = controls
    if (include('requests')) payload.requests = requests
    if (include('upcoming')) payload.upcoming = controls.filter((c) => c.dueDate)

    if (include('teamBandwidth')) {
      const map: Record<string, { inProgress: number; total: number }> = {}
      for (const r of requests) {
        const ctrl = controls.find((c) => String(c.id) === String(r.controlId))
        const tester = String(ctrl?.tester ?? 'Unassigned')
        if (!map[tester]) map[tester] = { inProgress: 0, total: 0 }
        map[tester].total += 1
        if (String(r.status ?? '').toLowerCase() === 'in progress') map[tester].inProgress += 1
      }
      payload.teamBandwidth = map
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${baseFilename}.json`
    link.click()
    return
  }

  // Excel export: create sheets only for selected components
  const workbook = XLSX.utils.book_new()

  if (include('summary')) {
    const summarySheet = XLSX.utils.json_to_sheet([
      { Metric: 'Total Controls', Value: controls.length },
      { Metric: 'Total Requests', Value: requests.length },
      { Metric: 'Active Controls', Value: controls.filter((c) => (c.dat?.status ?? '').toLowerCase() !== 'completed').length },
      { Metric: 'Open Requests', Value: requests.filter((r) => (r.status ?? '').toLowerCase() !== 'complete').length },
      { Metric: 'Exported At', Value: new Date().toISOString() },
    ])
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
  }

    if (include('controls')) {
    const controlsData = controls.map((c) => ({
      'Control ID': c.id,
      Name: c.name || '',
      Description: c.sme || c.description || '',
      Owner: c.owner || '',
      SME: c.sme || '',
      Tester: c.tester || '',
      'DAT Status': c.dat?.status || '',
      'OET Status': c.oet?.status || '',
      'Needs Escalation': c.needsEscalation ? 'Yes' : 'No',
      'Start Date': c.startDate || '',
      'Due Date': c.dueDate || '',
      ETA: c.eta || '',
      'Completed Date': c.completedDate || '',
      'Testing Notes': c.testingNotes || '',
    }))
    const sheet = XLSX.utils.json_to_sheet(controlsData)
    XLSX.utils.book_append_sheet(workbook, sheet, 'Controls')
  }

  if (include('requests')) {
    const requestsData = requests.map((r) => ({
      'Request ID': r.id,
      'Control ID': r.controlId,
      'Requested By': r.requestedBy,
      Scope: r.scope,
      'Due Date': r.dueDate,
      Status: r.status,
    }))
    const sheet = XLSX.utils.json_to_sheet(requestsData)
    XLSX.utils.book_append_sheet(workbook, sheet, 'Requests')
  }

  if (include('upcoming')) {
    const upcoming = controls.filter((c) => c.dueDate).map((c) => ({
      'Control ID': c.id,
      Name: c.name || '',
      'Due Date': c.dueDate || '',
    }))
    const sheet = XLSX.utils.json_to_sheet(upcoming)
    XLSX.utils.book_append_sheet(workbook, sheet, 'Upcoming')
  }

  if (include('teamBandwidth')) {
    const map: Record<string, { inProgress: number; total: number }> = {}
    for (const r of requests) {
      const ctrl = controls.find((c) => String(c.id) === String(r.controlId))
      const tester = String(ctrl?.tester ?? 'Unassigned')
      if (!map[tester]) map[tester] = { inProgress: 0, total: 0 }
      map[tester].total += 1
      if (String(r.status ?? '').toLowerCase() === 'in progress') map[tester].inProgress += 1
    }
    const rows = Object.entries(map).map(([name, counts]) => ({ Tester: name, InProgress: counts.inProgress, Total: counts.total }))
    const sheet = XLSX.utils.json_to_sheet(rows)
    XLSX.utils.book_append_sheet(workbook, sheet, 'TeamBandwidth')
  }

  XLSX.writeFile(workbook, `${baseFilename}.xlsx`)
}

