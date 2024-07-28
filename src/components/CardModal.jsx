import { useState } from 'react'

const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'critical']

function CardModal({ card, onUpdate, onDelete, onClose }) {
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description || '')
  const [priority, setPriority] = useState(card.priority || 'medium')
  const [dueDate, setDueDate] = useState(card.dueDate || '')
  const [assignee, setAssignee] = useState(card.assignee || '')

  const handleSave = () => {
    onUpdate({ title, description, priority, dueDate, assignee })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Card</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <label className="form-label">
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </label>
          <label className="form-label">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows={4}
            />
          </label>
          <div className="form-row">
            <label className="form-label">
              Priority
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-select"
              >
                {PRIORITY_OPTIONS.map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </label>
            <label className="form-label">
              Due Date
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
              />
            </label>
          </div>
          <label className="form-label">
            Assignee
            <input
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Assignee name..."
              className="form-input"
            />
          </label>
        </div>
        <div className="modal-footer">
          <button className="btn-delete" onClick={onDelete}>Delete Card</button>
          <div className="modal-footer-right">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardModal
