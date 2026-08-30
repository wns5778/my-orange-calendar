import { useMemo, useState } from 'react'
import NoteModal from './NoteModal'

export default function NotesView({ notes, onAdd, onUpdate, onDelete }) {
  const [query, setQuery] = useState('')
  const [modalNote, setModalNote] = useState(null) // null = closed, {} = new, {...} = edit
  const [showModal, setShowModal] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? notes.filter(
          (n) => n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q)
        )
      : notes
    return [...list].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
  }, [notes, query])

  function openNew() {
    setModalNote(null)
    setShowModal(true)
  }

  function openEdit(note) {
    setModalNote(note)
    setShowModal(true)
  }

  function handleSave(data) {
    const now = Date.now()
    if (modalNote?.id) {
      onUpdate(modalNote.id, { ...data, updatedAt: now })
    } else {
      onAdd({ ...data, createdAt: now, updatedAt: now })
    }
  }

  return (
    <div>
      <h2 className="section-title">메모</h2>

      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="메모 검색"
        />
      </div>

      {filtered.length === 0 && <p className="empty-hint">메모가 없어요. + 버튼으로 추가해보세요.</p>}

      <div className="card-list">
        {filtered.map((n) => (
          <div className="note-card" key={n.id} onClick={() => openEdit(n)}>
            <h4>{n.title}</h4>
            <p>{n.content}</p>
            {n.date && <span className="date-tag">📅 {n.date}</span>}
          </div>
        ))}
      </div>

      <button className="fab" onClick={openNew}>
        +
      </button>

      {showModal && (
        <NoteModal
          initial={modalNote}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          onDelete={onDelete}
        />
      )}
    </div>
  )
}
