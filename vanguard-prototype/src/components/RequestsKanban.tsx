import './kanban/kanban.css'
import Column from './kanban/Column'
import Card from './kanban/Card'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TestRequest } from '../lib/types'
import { updateMockRequest } from '../mocks/mockData'

type Props = {
  requests: TestRequest[]
}

export default function RequestsKanban({ requests }: Props) {
  const navigate = useNavigate()
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<{ id: string; type: string } | null>(null)

  const statuses: Array<TestRequest['status']> = ['Pending', 'In Progress', 'Complete']

  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggedItem({ id, type: 'requests' })
    try { e.dataTransfer?.setData('text/plain', id) } catch {}
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
    if (draggedItem && draggedItem.type === 'requests') {
      const newStatus = status as TestRequest['status']
      updateMockRequest(draggedItem.id, { status: newStatus })
    }
    setDraggedItem(null)
    setDraggedOverColumn(null)
  }

  return (
    <div className="kanban-board">
      {statuses.map((s) => (
        <Column
          key={s}
          id={s}
          title={s}
          count={requests.filter((r) => String(r.status ?? 'Pending') === s).length}
          isDraggedOver={draggedOverColumn === s && draggedItem?.type === 'requests'}
          onDragOver={(e) => handleDragOver(e, s)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, s)}
        >
          {requests
            .filter((r) => String(r.status ?? 'Pending') === s)
            .map((r) => (
              <Card
                key={r.id}
                id={r.id}
                title={`Request ${r.id}`}
                draggable
                onDragStart={(e) => handleDragStart(e, r.id)}
                onDragEnd={handleDragEnd}
                onClick={() => navigate(`/requests/${r.id}`)}
              />
            ))}
        </Column>
      ))}
    </div>
  )
}
