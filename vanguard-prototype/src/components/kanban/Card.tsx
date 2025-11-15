type Props = {
  id: string
  title: string
}

export default function Card({ id, title }: Props) {
  return (
    <article className="kanban-card" data-id={id}>
      <div className="kanban-card-title">{title}</div>
      <div className="kanban-card-meta">ID: {id}</div>
    </article>
  )
}
