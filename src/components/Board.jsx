import { useState, useRef } from 'react'
import Column from './Column'
import CardModal from './CardModal'

function Board({ board, onUpdate, searchQuery }) {
  const [modalCard, setModalCard] = useState(null)
  const [modalColumnId, setModalColumnId] = useState(null)
  const dragItem = useRef(null)
  const dragOverItem = useRef(null)
  const dragType = useRef(null)

  const { columns, cards } = board

  const getColumnCards = (colId) => {
    let colCards = cards
      .filter(c => c.columnId === colId)
      .sort((a, b) => a.order - b.order)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      colCards = colCards.filter(c =>
        c.title.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.assignee || '').toLowerCase().includes(q)
      )
    }
    return colCards
  }

  const addCard = (columnId, cardData) => {
    const colCards = cards.filter(c => c.columnId === columnId)
    const newCard = {
      id: Date.now().toString(),
      columnId,
      order: colCards.length,
      ...cardData,
      createdAt: new Date().toISOString(),
    }
    onUpdate({ ...board, cards: [...cards, newCard] })
  }

  const updateCard = (cardId, updates) => {
    onUpdate({
      ...board,
      cards: cards.map(c => c.id === cardId ? { ...c, ...updates } : c)
    })
  }

  const deleteCard = (cardId) => {
    onUpdate({ ...board, cards: cards.filter(c => c.id !== cardId) })
    setModalCard(null)
  }

  const handleCardDragStart = (e, card) => {
    dragType.current = 'card'
    dragItem.current = card
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', card.id)
    e.currentTarget.classList.add('dragging')
  }

  const handleCardDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging')
    dragItem.current = null
    dragOverItem.current = null
    dragType.current = null
  }

  const handleCardDrop = (e, targetColumnId, targetIndex) => {
    e.preventDefault()
    if (dragType.current !== 'card' || !dragItem.current) return

    const sourceCard = dragItem.current
    let newCards = cards.filter(c => c.id !== sourceCard.id)

    const colCards = newCards
      .filter(c => c.columnId === targetColumnId)
      .sort((a, b) => a.order - b.order)

    const updatedCard = { ...sourceCard, columnId: targetColumnId }
    colCards.splice(targetIndex, 0, updatedCard)

    const reordered = colCards.map((c, i) => ({ ...c, order: i }))
    const otherCards = newCards.filter(c => c.columnId !== targetColumnId)

    onUpdate({ ...board, cards: [...otherCards, ...reordered] })
    dragItem.current = null
  }

  const handleColumnDragStart = (e, colIndex) => {
    dragType.current = 'column'
    dragItem.current = colIndex
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(colIndex))
  }

  const handleColumnDrop = (e, targetIndex) => {
    e.preventDefault()
    if (dragType.current !== 'column') return
    const sourceIndex = dragItem.current
    if (sourceIndex === targetIndex) return

    const newColumns = [...columns]
    const [moved] = newColumns.splice(sourceIndex, 1)
    newColumns.splice(targetIndex, 0, moved)
    onUpdate({ ...board, columns: newColumns })
    dragItem.current = null
  }

  const addColumn = () => {
    const name = prompt('Column name:')
    if (!name?.trim()) return
    const newCol = { id: `col-${Date.now()}`, title: name.trim() }
    onUpdate({ ...board, columns: [...columns, newCol] })
  }

  const renameColumn = (colId, newTitle) => {
    onUpdate({
      ...board,
      columns: columns.map(c => c.id === colId ? { ...c, title: newTitle } : c)
    })
  }

  const deleteColumn = (colId) => {
    onUpdate({
      ...board,
      columns: columns.filter(c => c.id !== colId),
      cards: cards.filter(c => c.columnId !== colId)
    })
  }

  const openCardModal = (card, columnId) => {
    setModalCard(card)
    setModalColumnId(columnId)
  }

  return (
    <div className="board">
      <div className="columns-container">
        {columns.map((col, colIndex) => (
          <Column
            key={col.id}
            column={col}
            colIndex={colIndex}
            cards={getColumnCards(col.id)}
            onAddCard={(data) => addCard(col.id, data)}
            onCardDragStart={handleCardDragStart}
            onCardDragEnd={handleCardDragEnd}
            onCardDrop={(e, idx) => handleCardDrop(e, col.id, idx)}
            onColumnDragStart={(e) => handleColumnDragStart(e, colIndex)}
            onColumnDrop={(e) => handleColumnDrop(e, colIndex)}
            onRenameColumn={(title) => renameColumn(col.id, title)}
            onDeleteColumn={() => deleteColumn(col.id)}
            onCardClick={(card) => openCardModal(card, col.id)}
          />
        ))}
        <button className="add-column-btn" onClick={addColumn}>
          + Add Column
        </button>
      </div>
      {modalCard && (
        <CardModal
          card={modalCard}
          onUpdate={(updates) => updateCard(modalCard.id, updates)}
          onDelete={() => deleteCard(modalCard.id)}
          onClose={() => setModalCard(null)}
        />
      )}
    </div>
  )
}

export default Board
