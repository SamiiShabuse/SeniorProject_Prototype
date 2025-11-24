import './kanban/kanban.css'
import Column from './kanban/Column'
import Card from './kanban/Card'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Control } from '../lib/types'
import { updateMockControl } from '../mocks/mockData'

type Props = {
  controls: Control[]
}

export default function ControlsKanban({ controls }: Props) {
  const navigate = useNavigate()
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<{ id: string; type: string } | null>(null)

  const datStatuses = ['Not Started', 'In Progress', 'Addressing Comments', 'Completed', 'Testing Completed']

  function handleDragStart(e: React.DragEvent, id: string, type: string) {
    setDraggedItem({ id, type })
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
    if (draggedItem && draggedItem.type === 'controls') {
      const newStatus = status as typeof datStatuses[number]
      const today = new Date().toISOString().slice(0, 10)
      if (newStatus === 'In Progress') {
        updateMockControl(draggedItem.id, { dat: { status: newStatus } as any, startDate: today, completedDate: undefined })
      } else if (newStatus === 'Completed') {
        updateMockControl(draggedItem.id, { dat: { status: newStatus } as any, completedDate: today })
      } else {
        updateMockControl(draggedItem.id, { dat: { status: newStatus } as any })
      }
    }
    setDraggedItem(null)
    setDraggedOverColumn(null)
  }

  return (
    <div className="kanban-board">
      {datStatuses.map((ds) => (
        <Column
          key={ds}
          id={ds}
          title={ds}
          count={controls.filter((c) => String(c.dat?.status ?? 'Not Started') === ds).length}
          isDraggedOver={draggedOverColumn === ds && draggedItem?.type === 'controls'}
          onDragOver={(e) => handleDragOver(e, ds)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, ds)}
        >
          {controls
            .filter((c) => String(c.dat?.status ?? 'Not Started') === ds)
            .map((c) => (
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
  )
}
