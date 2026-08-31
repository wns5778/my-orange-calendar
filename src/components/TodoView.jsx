import { useState } from 'react'
import { todayKey } from '../utils/date'
import { occursOn, repeatLabel } from '../utils/recurrence'
import RepeatFields from './RepeatFields'

function statusFor(todo) {
  if (!todo.repeat) return { applicableToday: true, doneToday: !!todo.done }
  const today = todayKey()
  const applicableToday = occursOn(todo, today)
  const doneToday = applicableToday && (todo.completedDates || []).includes(today)
  return { applicableToday, doneToday }
}

export default function TodoView({ todos, onAdd, onToggle, onDelete }) {
  const [text, setText] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('active') // 'all' | 'active' | 'done'
  const [repeatEnabled, setRepeatEnabled] = useState(false)
  const [repeatWeekdays, setRepeatWeekdays] = useState([])
  const [repeatUntil, setRepeatUntil] = useState('')

  const startDate = dueDate || todayKey()
  const repeatValid = !repeatEnabled || (repeatWeekdays.length > 0 && repeatUntil && repeatUntil >= startDate)

  function toggleWeekday(idx) {
    setRepeatWeekdays((prev) => (prev.includes(idx) ? prev.filter((d) => d !== idx) : [...prev, idx]))
  }

  function handleAdd(e) {
    e.preventDefault()
    if (!text.trim() || !repeatValid) return
    const data = { text: text.trim(), done: false, createdAt: Date.now() }
    if (repeatEnabled) {
      data.date = startDate
      data.repeat = { weekdays: repeatWeekdays, until: repeatUntil }
      data.completedDates = []
    } else {
      data.date = dueDate || null
    }
    onAdd(data)
    setText('')
    setDueDate('')
    setRepeatEnabled(false)
    setRepeatWeekdays([])
    setRepeatUntil('')
  }

  const filtered = todos.filter((t) => {
    const { doneToday } = statusFor(t)
    if (filter === 'active') return !doneToday
    if (filter === 'done') return doneToday
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

      <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
        <div className="add-inline">
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
          <button className="add-btn" type="submit" disabled={!repeatValid}>
            +
          </button>
        </div>

        <RepeatFields
          enabled={repeatEnabled}
          onToggleEnabled={setRepeatEnabled}
          weekdays={repeatWeekdays}
          onToggleWeekday={toggleWeekday}
          until={repeatUntil}
          onChangeUntil={setRepeatUntil}
          minDate={startDate}
        />
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
        {sorted.map((t) => {
          const { applicableToday, doneToday } = statusFor(t)
          return (
            <div className="todo-row" key={t.id}>
              <button
                className={`check${doneToday ? ' done' : ''}`}
                disabled={!applicableToday}
                title={applicableToday ? undefined : '오늘은 해당하는 날이 아니에요'}
                onClick={() => onToggle(t, todayKey())}
              >
                {doneToday ? '✓' : ''}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className={`text${doneToday ? ' done' : ''}`}>{t.text}</div>
                {t.repeat ? (
                  <div className="due">{repeatLabel(t.repeat)}</div>
                ) : (
                  t.date && <div className="due">📅 {t.date}</div>
                )}
              </div>
              <button className="delete-btn" onClick={() => onDelete(t.id)}>
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
