import Column from './Column'
import Card from './Card'
import './kanban.css'

const sampleData = [
  {
    id: 'todo',
    title: 'To Do',
    cards: [
      { id: 'c1', title: 'Create control list UI' },
      { id: 'c2', title: 'Add routing' },
    ],
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    cards: [
      { id: 'c3', title: 'Implement board layout' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      { id: 'c4', title: 'Project scaffold' },
    ],
  },
]

export default function BoardView() {
  return (
    <div className="kanban-board">
      {sampleData.map((col) => (
        <Column key={col.id} id={col.id} title={col.title}>
          {col.cards.map((card) => (
            <Card key={card.id} id={card.id} title={card.title} />
          ))}
        </Column>
      ))}
    </div>
  )
}
