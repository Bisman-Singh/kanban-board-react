import { useState, useRef } from 'react'
import Card from './Card'

const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'critical']

function Column({
  column, colIndex, cards,
  onAddCard, onCardDragStart, onCardDragEnd, onCardDrop,
  onColumnDragStart, onColumnDrop,
  onRenameColumn, onDeleteColumn, onCardClick
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(column.title)
  const [dropIndex, setDropIndex] = useState(-1)
  const columnRef = useRef(null)

  const handleAdd = (e) => {
    e.preventDefault()
    if (newTitle.trim()) {
      onAddCard({ title: newTitle.trim(), priority: newPriority, description: '', assignee: '', dueDate: '' })
      setNewTitle('')
      setNewPriority('medium')
      setShowAdd(false)
    }
  }

  const handleRename = (e) => {
    e.preventDefault()
    if (editTitle.trim()) {
      onRenameColumn(editTitle.trim())
      setIsEditing(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    const cardElements = columnRef.current?.querySelectorAll('.card')
    if (!cardElements) return

    let closestIdx = cards.length
    let closestDist = Infinity

    cardElements.forEach((el, idx) => {
      const rect = el.getBoundingClientRect()
      const midY = rect.top + rect.height / 2
      const dist = e.clientY - midY
      if (dist > 0 && dist < closestDist) {
        closestDist = dist
        closestIdx = idx + 1
      } else if (dist < 0 && Math.abs(dist) < closestDist) {
        closestDist = Math.abs(dist)
        closestIdx = idx
      }
    })

    setDropIndex(closestIdx)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    onCardDrop(e, dropIndex >= 0 ? dropIndex : cards.length)
    setDropIndex(-1)
  }

  return (
    <div
      className="column"
      draggable
      onDragStart={(e) => {
        if (e.target.closest('.card') || e.target.closest('.add-card-form')) {
          e.preventDefault()
          return
        }
        onColumnDragStart(e)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        handleDragOver(e)
      }}
      onDrop={(e) => {
        const isColumnDrag = e.dataTransfer.types.includes('text/plain')
        if (isColumnDrag) {
          onColumnDrop(e)
        }
        handleDrop(e)
      }}
      onDragLeave={() => setDropIndex(-1)}
    >
      <div className="column-header">
        {isEditing ? (
          <form onSubmit={handleRename} className="rename-form">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
              onBlur={() => setIsEditing(false)}
              className="rename-input"
            />
          </form>
        ) : (
          <h3 className="column-title" onDoubleClick={() => setIsEditing(true)}>
            {column.title}
            <span className="card-count">{cards.length}</span>
          </h3>
        )}
        <div className="column-actions">
          <button className="col-action-btn" onClick={() => setIsEditing(true)} title="Rename">✏️</button>
          <button className="col-action-btn" onClick={onDeleteColumn} title="Delete">🗑️</button>
        </div>
      </div>

      <div className="cards-container" ref={columnRef}>
        {cards.map((card, idx) => (
          <div key={card.id}>
            {dropIndex === idx && <div className="drop-indicator" />}
            <Card
              card={card}
              onDragStart={(e) => onCardDragStart(e, card)}
              onDragEnd={onCardDragEnd}
              onClick={() => onCardClick(card)}
            />
          </div>
        ))}
        {dropIndex === cards.length && <div className="drop-indicator" />}
      </div>

      {showAdd ? (
        <form className="add-card-form" onSubmit={handleAdd}>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Card title..."
            autoFocus
            className="add-card-input"
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            className="priority-select"
          >
            {PRIORITY_OPTIONS.map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
          <div className="add-card-actions">
            <button type="submit" className="add-card-submit">Add</button>
            <button type="button" className="add-card-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="add-card-btn" onClick={() => setShowAdd(true)}>
          + Add Card
        </button>
      )}
    </div>
  )
}

export default Column
