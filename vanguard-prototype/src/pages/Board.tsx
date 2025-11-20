import './Board.css'
import { useState } from 'react'
import { mockControls } from '../mocks/mockData'
import Column from '../components/kanban/Column'
import Card from '../components/kanban/Card'

export default function Board() {
  const [showMock, setShowMock] = useState(true)

  // derive a simple status from the normalized control shape
  // The imported controls don't have a `status` or `title` field anymore;
  // use `name` as the title and derive a small status used by this board.
  const getStatus = (c: any) => {
    if (c.testingNotes) return 'testing'
    if (c.startDate && !c.completedDate) return 'active'
    return 'draft'
  }

  const byStatus = (s: string) => mockControls.filter((c) => getStatus(c) === s)

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
          <Column id="testing" title="Testing">
            {byStatus('testing').map((c) => (
              <Card key={c.id} id={c.id} title={c.name} />
            ))}
          </Column>
          <Column id="active" title="Active">
            {byStatus('active').map((c) => (
              <Card key={c.id} id={c.id} title={c.name} />
            ))}
          </Column>
          <Column id="draft" title="Draft / Other">
            {mockControls.filter((c) => getStatus(c) !== 'testing' && getStatus(c) !== 'active').map((c) => (
              <Card key={c.id} id={c.id} title={c.name} />
            ))}
          </Column>
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
