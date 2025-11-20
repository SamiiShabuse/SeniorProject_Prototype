import './Board.css'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockControls, mockRequests, updateMockControl, updateMockRequest } from '../mocks/mockData'
import type { Control, TestRequest, PhaseStatus, TestRequestStatus } from '../lib/types'
import Column from '../components/kanban/Column'
import Card from '../components/kanban/Card'

type ViewMode = 'controls' | 'requests'

// Control status columns (based on DAT status)
const controlStatuses: PhaseStatus[] = ['Not Started', 'In Progress', 'Testing Completed', 'Addressing Comments', 'Completed']

// Request status columns
const requestStatuses: TestRequestStatus[] = ['Pending', 'In Progress', 'Complete']

export default function Board() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<ViewMode>('controls')
  const [displayMode, setDisplayMode] = useState<'List' | 'Compact' | 'Kanban'>('Kanban')
  const [draggedItem, setDraggedItem] = useState<{ id: string; type: ViewMode } | null>(null)
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0) // Force re-render after updates

  // Group controls by DAT status
  const controlsByStatus = useMemo(() => {
    const grouped: Record<PhaseStatus, Control[]> = {
      'Not Started': [],
      'In Progress': [],
      'Testing Completed': [],
      'Addressing Comments': [],
      'Completed': [],
    }

    mockControls.forEach((control) => {
      const status = control.dat?.status || 'Not Started'
      if (grouped[status]) {
        grouped[status].push(control)
      } else {
        grouped['Not Started'].push(control)
      }
    })

    return grouped
  }, [mockControls, refreshKey])

  // Group requests by status
  const requestsByStatus = useMemo(() => {
    const grouped: Record<TestRequestStatus, TestRequest[]> = {
      'Pending': [],
      'In Progress': [],
      'Complete': [],
    }

    mockRequests.forEach((request) => {
      if (grouped[request.status]) {
        grouped[request.status].push(request)
      } else {
        grouped['Pending'].push(request)
      }
    })

    return grouped
  }, [mockRequests, refreshKey])

  const handleDragStart = (e: React.DragEvent, id: string, type: ViewMode) => {
    setDraggedItem({ id, type })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id)
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5'
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null)
    setDraggedOverColumn(null)
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1'
    }
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDraggedOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDraggedOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, targetStatus: PhaseStatus | TestRequestStatus) => {
    e.preventDefault()
    setDraggedOverColumn(null)

    if (!draggedItem) return

    if (draggedItem.type === 'controls') {
      const control = mockControls.find((c) => c.id === draggedItem.id)
      if (control && controlStatuses.includes(targetStatus as PhaseStatus)) {
        // Only update if status actually changed
        if (control.dat?.status !== targetStatus) {
          updateMockControl(draggedItem.id, {
            dat: { ...control.dat, status: targetStatus as PhaseStatus },
          })
          // Force re-render
          setRefreshKey((prev) => prev + 1)
        }
      }
    } else if (draggedItem.type === 'requests') {
      const request = mockRequests.find((r) => r.id === draggedItem.id)
      if (request && requestStatuses.includes(targetStatus as TestRequestStatus)) {
        // Only update if status actually changed
        if (request.status !== targetStatus) {
          updateMockRequest(draggedItem.id, {
            status: targetStatus as TestRequestStatus,
          })
          // Force re-render
          setRefreshKey((prev) => prev + 1)
        }
      }
    }

    setDraggedItem(null)
  }

  return (
    <div className="board-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0 }}>Kanban Board</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            Drag and drop items between columns to update their status
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: 13, color: '#444', marginRight: 8 }}>Display:</label>
            <select value={displayMode} onChange={(e) => setDisplayMode(e.target.value as any)} style={{ padding: '6px 8px', borderRadius: 6 }}>
              <option value="List">List</option>
              <option value="Compact">Compact</option>
              <option value="Kanban">Kanban</option>
            </select>
          </div>
          <button
            onClick={() => setViewMode('controls')}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #ddd',
              background: viewMode === 'controls' ? '#1a88ff' : '#fff',
              color: viewMode === 'controls' ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: viewMode === 'controls' ? 600 : 400,
            }}
          >
            Controls (DAT Status)
          </button>
          <button
            onClick={() => setViewMode('requests')}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #ddd',
              background: viewMode === 'requests' ? '#1a88ff' : '#fff',
              color: viewMode === 'requests' ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: viewMode === 'requests' ? 600 : 400,
            }}
          >
            Requests
          </button>
        </div>
      </div>

      {viewMode === 'controls' ? (
        <div className="kanban-board">
          {controlStatuses.map((status) => (
            <Column
              key={status}
              id={status}
              title={status}
              count={controlsByStatus[status].length}
              isDraggedOver={draggedOverColumn === status && draggedItem?.type === 'controls'}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
            >
              {controlsByStatus[status].map((control) => (
                <Card
                  key={control.id}
                  id={control.id}
                  title={control.name.length > 60 ? control.name.substring(0, 60) + '...' : control.name}
                  subtitle={`Owner: ${control.owner}${control.tester ? ` • Tester: ${control.tester}` : ''}`}
                  meta={control.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, control.id, 'controls')}
                  onDragEnd={handleDragEnd}
                  onClick={() => navigate(`/controls/${control.id}`)}
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
