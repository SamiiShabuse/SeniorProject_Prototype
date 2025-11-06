import './Board.css'
import BoardView from '../components/kanban/BoardView'
import { useState } from 'react'
import { mockControls } from '../mocks/mockData'
import Column from '../components/kanban/Column'
import Card from '../components/kanban/Card'

export default function Board() {
  const [showMock, setShowMock] = useState(false)

  const byStatus = (s: string) => mockControls.filter((c) => c.status === s)

  return (
    <div className="board-page">
      <h2>Board</h2>
      <p className="muted">A Jira-like board view (skeleton). Columns and cards are placeholders; we'll add drag/drop next.</p>

      <p>
        <a href="#" onClick={(e) => { e.preventDefault(); setShowMock((s) => !s) }}>
          {showMock ? 'Show placeholder board' : 'Show mock data on board'}
        </a>
      </p>

      {showMock ? (
        <div className="kanban-board">
          <Column id="testing" title="Testing">
            {byStatus('testing').map((c) => (
              <Card key={c.id} id={c.id} title={c.title} />
            ))}
          </Column>
          <Column id="active" title="Active">
            {byStatus('active').map((c) => (
              <Card key={c.id} id={c.id} title={c.title} />
            ))}
          </Column>
          <Column id="draft" title="Draft / Other">
            {mockControls.filter((c) => c.status !== 'testing' && c.status !== 'active').map((c) => (
              <Card key={c.id} id={c.id} title={c.title} />
            ))}
          </Column>
        </div>
      ) : (
        <BoardView />
      )}
    </div>
  )
}
