import { useRef } from 'react'

type Props = {
  id: string
  title: string
  subtitle?: string
  meta?: string
  draggable?: boolean
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
  onClick?: () => void
}

export default function Card({ id, title, subtitle, meta, draggable, onDragStart, onDragEnd, onClick }: Props) {
  const wasDragged = useRef(false)

  const handleDragStartInternal = (e: React.DragEvent) => {
    wasDragged.current = false
    onDragStart?.(e)
  }

  const handleDragEndInternal = (e: React.DragEvent) => {
    onDragEnd?.(e)
    // Mark that a drag occurred
    wasDragged.current = true
    // Reset after a delay to allow click if no drag happened
    setTimeout(() => {
      wasDragged.current = false
    }, 100)
  }

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if user just dragged the card
    if (wasDragged.current) {
      e.preventDefault()
      return
    }
    onClick?.()
  }

  return (
    <article
      className="kanban-card"
      data-id={id}
      draggable={draggable}
      onDragStart={handleDragStartInternal}
      onDragEnd={handleDragEndInternal}
      onClick={handleClick}
      style={{ cursor: draggable ? 'grab' : onClick ? 'pointer' : 'default' }}
    >
      <div className="kanban-card-title">{title}</div>
      {subtitle && <div className="kanban-card-subtitle">{subtitle}</div>}
      {meta && <div className="kanban-card-meta">{meta}</div>}
    </article>
  )
}
