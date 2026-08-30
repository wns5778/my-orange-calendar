import { useState } from 'react'

export default function TodoView({ todos, onAdd, onToggle, onDelete }) {
  const [text, setText] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('active') // 'all' | 'active' | 'done'

  function handleAdd(e) {
    e.preventDefault()
    if (!text.trim()) return
    onAdd({ text: text.trim(), date: dueDate || null, done: false, createdAt: Date.now() })
    setText('')
    setDueDate('')
  }

  const filtered = todos.filter((t) => {
    if (filter === 'active') return !t.done
    if (filter === 'done') return t.done
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (!!a.date !== !!b.date) return a.date ? -1 : 1
    if (a.date && b.date && a.date !== b.date) return a.date < b.date ? -1 : 1
    return (b.createdAt || 0) - (a.createdAt || 0)
  })

  return (
    <div>
      <h2 className="section-title">할 일</h2>

      <form className="add-inline" onSubmit={handleAdd}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ maxWidth: 130 }}
        />
        <button className="add-btn" type="submit">
          +
        </button>
      </form>

      <div className="filter-tabs">
        <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>
          진행 중
        </button>
        <button className={filter === 'done' ? 'active' : ''} onClick={() => setFilter('done')}>
          완료
        </button>
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          전체
        </button>
      </div>

      {sorted.length === 0 && <p className="empty-hint">표시할 할 일이 없어요.</p>}

      <div className="card-list">
        {sorted.map((t) => (
          <div className="todo-row" key={t.id}>
            <button
              className={`check${t.done ? ' done' : ''}`}
              onClick={() => onToggle(t.id, !t.done)}
            >
              {t.done ? '✓' : ''}
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className={`text${t.done ? ' done' : ''}`}>{t.text}</div>
              {t.date && <div className="due">📅 {t.date}</div>}
            </div>
            <button className="delete-btn" onClick={() => onDelete(t.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
