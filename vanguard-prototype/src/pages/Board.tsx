import './Board.css'
import { useState } from 'react'
import { mockControls, mockRequests, updateMockRequest, updateMockControl } from '../mocks/mockData'
import type { TestRequestStatus, PhaseStatus, Control } from '../lib/types'
import { useNavigate } from 'react-router-dom'
import Column from '../components/kanban/Column'
import Card from '../components/kanban/Card'

export default function Board() {
  const [showMock, setShowMock] = useState(true)
  const navigate = useNavigate()
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<{ id: string; type: string } | null>(null)

  // Use the control DAT status to build kanban columns
  const datStatuses: PhaseStatus[] = ['Not Started', 'In Progress', 'Addressing Comments', 'Completed', 'Testing Completed']

  const byDatStatus = (s: PhaseStatus) => mockControls.filter((c) => String(c.dat?.status ?? 'Not Started') === s)

  // --- requests/drag-drop helpers for the alternate view ---
  const requestStatuses = Array.from(new Set(mockRequests.map((r) => r.status))).length
    ? Array.from(new Set(mockRequests.map((r) => r.status)))
    : ['Pending', 'In Progress', 'Complete']

  const requestsByStatus: Record<string, typeof mockRequests> = {}
  for (const s of requestStatuses) requestsByStatus[s] = mockRequests.filter((r) => r.status === s)

  function handleDragStart(e: React.DragEvent, id: string, type: string) {
    setDraggedItem({ id, type })
    try { e.dataTransfer?.setData('text/plain', id) } catch (err) { /* ignore */ }
  }

  function handleDragEnd() {
    setDraggedItem(null)
    setDraggedOverColumn(null)
  }

  function handleDragOver(e: React.DragEvent, status: string) {
    e.preventDefault()
    setDraggedOverColumn(status)
  }

  function handleDragLeave() { setDraggedOverColumn(null) }

  function handleDrop(e: React.DragEvent, status: string) {
    e.preventDefault()
    if (draggedItem) {
      if (draggedItem.type === 'requests') {
        updateMockRequest(draggedItem.id, { status: status as TestRequestStatus })
      }
      if (draggedItem.type === 'controls') {
        // status here corresponds to a DAT PhaseStatus (one of datStatuses)
        const newStatus = status as PhaseStatus
        // Update the control's dat.status; also set start/completed dates if moving to In Progress/Completed
        const today = new Date().toISOString().slice(0, 10)
        if (newStatus === 'In Progress') {
          updateMockControl(draggedItem.id, { dat: { status: newStatus } as any, startDate: today, completedDate: undefined })
        } else if (newStatus === 'Completed') {
          updateMockControl(draggedItem.id, { dat: { status: newStatus } as any, completedDate: today })
        } else {
          updateMockControl(draggedItem.id, { dat: { status: newStatus } as any })
        }
      }
    }
    setDraggedItem(null)
    setDraggedOverColumn(null)
  }

  return (
    <div className="board-page">
      <h2>Board</h2>
      <p className="muted">A Jira-like board view (skeleton). Columns and cards are placeholders; we'll add drag/drop next.</p>

      <p>
        <a href="#" onClick={(e) => { e.preventDefault(); setShowMock((s) => !s) }}>
          {showMock ? 'Hide mock data' : 'Show mock data on board'}
        </a>
      </p>

      {showMock ? (
        <div className="kanban-board">
          {datStatuses.map((ds) => (
            <Column
              key={ds}
              id={ds}
              title={ds}
              count={byDatStatus(ds).length}
              isDraggedOver={draggedOverColumn === ds && draggedItem?.type === 'controls'}
              onDragOver={(e) => handleDragOver(e, ds)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, ds)}
            >
              {byDatStatus(ds).map((c: Control) => (
                <Card
                  key={c.id}
                  id={c.id}
                  title={c.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, c.id, 'controls')}
                  onDragEnd={handleDragEnd}
                  onClick={() => navigate(`/controls/${c.id}`)}
                />
              ))}
            </Column>
          ))}
        </div>
      ) : (
        <div className="kanban-board">
          {requestStatuses.map((status) => (
            <Column
              key={status}
              id={status}
              title={status}
              count={requestsByStatus[status].length}
              isDraggedOver={draggedOverColumn === status && draggedItem?.type === 'requests'}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
            >
              {requestsByStatus[status].map((request) => {
                const control = mockControls.find((c) => c.id === request.controlId)
                const controlName = control?.name || request.controlId
                return (
                  <Card
                    key={request.id}
                    id={request.id}
                    title={controlName.length > 60 ? controlName.substring(0, 60) + '...' : controlName}
                    subtitle={`Requested by: ${request.requestedBy}`}
                    meta={`Due: ${request.dueDate} • ${request.controlId}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, request.id, 'requests')}
                    onDragEnd={handleDragEnd}
                    onClick={() => navigate(`/requests/${request.id}`)}
                  />
                )
              })}
            </Column>
          ))}
        </div>
      )}
    </div>
  )
}
