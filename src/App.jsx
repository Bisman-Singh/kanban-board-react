import { useState, useEffect, useCallback } from 'react'
import Board from './components/Board'
import BoardSelector from './components/BoardSelector'

const DEFAULT_COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
]

function createBoard(name) {
  return {
    id: Date.now().toString(),
    name,
    columns: DEFAULT_COLUMNS.map(c => ({ ...c, id: `${c.id}-${Date.now()}` })),
    cards: [],
  }
}

function loadBoards() {
  try {
    const data = JSON.parse(localStorage.getItem('kanban-boards'))
    if (data && data.length > 0) return data
  } catch { /* ignore */ }
  return [createBoard('My Board')]
}

function App() {
  const [boards, setBoards] = useState(loadBoards)
  const [activeBoardId, setActiveBoardId] = useState(() => loadBoards()[0]?.id)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    localStorage.setItem('kanban-boards', JSON.stringify(boards))
  }, [boards])

  const activeBoard = boards.find(b => b.id === activeBoardId) || boards[0]

  const updateBoard = useCallback((updatedBoard) => {
    setBoards(prev => prev.map(b => b.id === updatedBoard.id ? updatedBoard : b))
  }, [])

  const addBoard = (name) => {
    const newBoard = createBoard(name)
    setBoards(prev => [...prev, newBoard])
    setActiveBoardId(newBoard.id)
  }

  const deleteBoard = (id) => {
    setBoards(prev => {
      const next = prev.filter(b => b.id !== id)
      if (next.length === 0) {
        const fresh = createBoard('My Board')
        setActiveBoardId(fresh.id)
        return [fresh]
      }
      if (activeBoardId === id) setActiveBoardId(next[0].id)
      return next
    })
  }

  const renameBoard = (id, name) => {
    setBoards(prev => prev.map(b => b.id === id ? { ...b, name } : b))
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">📋 Kanban Board</h1>
        <div className="header-controls">
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </header>
      <BoardSelector
        boards={boards}
        activeBoardId={activeBoardId}
        onSelect={setActiveBoardId}
        onAdd={addBoard}
        onDelete={deleteBoard}
        onRename={renameBoard}
      />
      {activeBoard && (
        <Board
          board={activeBoard}
          onUpdate={updateBoard}
          searchQuery={searchQuery}
        />
      )}
    </div>
  )
}

export default App
