import React from 'react'

type Props = {
  id: string
  title: string
  children?: React.ReactNode
}

export default function Column({ id, title, children }: Props) {
  return (
    <section className="kanban-column" data-id={id}>
      <div className="kanban-column-header">
        <h3>{title}</h3>
      </div>
      <div className="kanban-column-body">{children}</div>
    </section>
  )
}
