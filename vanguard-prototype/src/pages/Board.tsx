import './Board.css'
import BoardView from '../components/kanban/BoardView'

export default function Board() {
  return (
    <div className="board-page">
      <h2>Board</h2>
      <p className="muted">A Jira-like board view (skeleton). Columns and cards are placeholders; we'll add drag/drop next.</p>
      <BoardView />
    </div>
  )
}
