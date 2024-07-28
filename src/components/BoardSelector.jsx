import { useState } from 'react'

function BoardSelector({ boards, activeBoardId, onSelect, onAdd, onDelete, onRename }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (newName.trim()) {
      onAdd(newName.trim())
      setNewName('')
      setShowAdd(false)
    }
  }

  const startRename = (board) => {
    setEditingId(board.id)
    setEditName(board.name)
  }

  const handleRename = (e) => {
    e.preventDefault()
    if (editName.trim()) {
      onRename(editingId, editName.trim())
      setEditingId(null)
    }
  }

  return (
    <div className="board-selector">
      <div className="board-tabs">
        {boards.map(board => (
          <div
            key={board.id}
            className={`board-tab ${board.id === activeBoardId ? 'active' : ''}`}
          >
            {editingId === board.id ? (
              <form onSubmit={handleRename} className="rename-form">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  onBlur={() => setEditingId(null)}
                  className="rename-input"
                />
              </form>
            ) : (
              <>
                <span className="board-tab-name" onClick={() => onSelect(board.id)}>
                  {board.name}
                </span>
                <div className="board-tab-actions">
                  <button
                    className="board-tab-btn"
                    onClick={(e) => { e.stopPropagation(); startRename(board) }}
                    title="Rename"
                  >✏️</button>
                  <button
                    className="board-tab-btn"
                    onClick={(e) => { e.stopPropagation(); onDelete(board.id) }}
                    title="Delete"
                  >🗑️</button>
                </div>
              </>
            )}
          </div>
        ))}
        {showAdd ? (
          <form onSubmit={handleAdd} className="add-board-form">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Board name..."
              autoFocus
              className="add-board-input"
            />
            <button type="submit" className="add-board-submit">Add</button>
            <button type="button" className="add-board-cancel" onClick={() => setShowAdd(false)}>✕</button>
          </form>
        ) : (
          <button className="add-board-btn" onClick={() => setShowAdd(true)}>+ New Board</button>
        )}
      </div>
    </div>
  )
}

export default BoardSelector
