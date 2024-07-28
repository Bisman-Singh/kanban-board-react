const PRIORITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
}

function Card({ card, onDragStart, onDragEnd, onClick }) {
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date()

  return (
    <div
      className="card"
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      <div
        className="card-priority-bar"
        style={{ background: PRIORITY_COLORS[card.priority] || PRIORITY_COLORS.medium }}
      />
      <div className="card-body">
        <h4 className="card-title">{card.title}</h4>
        {card.description && (
          <p className="card-desc">{card.description}</p>
        )}
        <div className="card-meta">
          <span
            className="card-priority-badge"
            style={{
              background: `${PRIORITY_COLORS[card.priority]}22`,
              color: PRIORITY_COLORS[card.priority]
            }}
          >
            {card.priority}
          </span>
          {card.dueDate && (
            <span className={`card-due ${isOverdue ? 'overdue' : ''}`}>
              📅 {new Date(card.dueDate).toLocaleDateString()}
            </span>
          )}
          {card.assignee && (
            <span className="card-assignee">👤 {card.assignee}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
