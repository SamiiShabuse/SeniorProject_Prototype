import React from 'react'

type Props = {
  id: string
  title: string
  count?: number
  children?: React.ReactNode
  isDraggedOver?: boolean
  onDragOver?: (e: React.DragEvent) => void
  onDragLeave?: () => void
  onDrop?: (e: React.DragEvent) => void
}

export default function Column({ id, title, count, children, isDraggedOver, onDragOver, onDragLeave, onDrop }: Props) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    onDragOver?.(e)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    onDrop?.(e)
  }

  return (
    <section
      className={`kanban-column ${isDraggedOver ? 'kanban-column-drag-over' : ''}`}
      data-id={id}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
    >
      <div className="kanban-column-header">
        <h3>{title}</h3>
        {count !== undefined && <span className="kanban-column-count">{count}</span>}
      </div>
      <div className="kanban-column-body">{children}</div>
    </section>
  )
}
