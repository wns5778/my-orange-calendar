import { useMemo, useState } from 'react'
import {
  buildMonthGrid,
  dayNameOf,
  formatFullDate,
  formatMonthTitle,
  isSameMonth,
  toDateKey,
  todayKey
} from '../utils/date'
import { isTodoDoneOn, occursOn, repeatLabel } from '../utils/recurrence'
import EventModal from './EventModal'

export default function CalendarView({ events, todos, onAddEvent, onDeleteEvent, onToggleTodo }) {
  const now = new Date()
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const [selectedKey, setSelectedKey] = useState(todayKey())
  const [showModal, setShowModal] = useState(false)

  const grid = useMemo(() => buildMonthGrid(cursor.year, cursor.month), [cursor])
  const gridKeys = useMemo(() => grid.map(toDateKey), [grid])

  const eventsByDate = useMemo(() => {
    const map = {}
    for (const key of gridKeys) {
      const matches = events.filter((ev) => occursOn(ev, key))
      if (matches.length) map[key] = matches
    }
    return map
  }, [events, gridKeys])

  const todosByDate = useMemo(() => {
    const map = {}
    for (const key of gridKeys) {
      const matches = todos.filter((t) => t.date && occursOn(t, key))
      if (matches.length) map[key] = matches
    }
    return map
  }, [todos, gridKeys])

  function changeMonth(delta) {
    const d = new Date(cursor.year, cursor.month + delta, 1)
    setCursor({ year: d.getFullYear(), month: d.getMonth() })
  }

  function handleDeleteEvent(ev) {
    if (ev.repeat && !window.confirm('반복 일정이에요. 전체 반복 일정을 삭제할까요?')) return
    onDeleteEvent(ev.id)
  }

  const selectedDate = new Date(selectedKey + 'T00:00:00')
  const dayEvents = eventsByDate[selectedKey] || []
  const dayTodos = todosByDate[selectedKey] || []

  return (
    <div>
      <div className="calendar-header">
        <button className="nav-btn" onClick={() => changeMonth(-1)}>
          ‹
        </button>
        <h2>{formatMonthTitle(cursor.year, cursor.month)}</h2>
        <button className="nav-btn" onClick={() => changeMonth(1)}>
          ›
        </button>
      </div>

      <div className="weekday-row">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <span key={i}>{dayNameOf(i)}</span>
        ))}
      </div>

      <div className="month-grid">
        {grid.map((date) => {
          const key = toDateKey(date)
          const outside = !isSameMonth(date, cursor.year, cursor.month)
          const isToday = key === todayKey()
          const isSelected = key === selectedKey
          const hasEvents = Boolean(eventsByDate[key]?.length)
          const hasTodos = Boolean(todosByDate[key]?.length)

          return (
            <button
              key={key}
              className={[
                'day-cell',
                outside ? 'outside' : '',
                isToday ? 'today' : '',
                isSelected ? 'selected' : ''
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setSelectedKey(key)}
            >
              <span>{date.getDate()}</span>
              <span className="day-dots">
                {hasEvents && <span className="dot" />}
                {hasTodos && <span className="dot" />}
              </span>
            </button>
          )
        })}
      </div>

      <div className="day-section">
        <h3>{formatFullDate(selectedDate)}</h3>

        {dayEvents.length === 0 && dayTodos.length === 0 && (
          <p className="empty-hint">이 날의 일정이 없어요. 오른쪽 아래 + 버튼으로 추가해보세요.</p>
        )}

        <div className="card-list">
          {dayEvents.map((ev) => (
            <div className="item-card" key={ev.id}>
              <div className="color-bar" style={{ background: ev.color || 'var(--orange-500)' }} />
              <div className="body">
                <div className="title">{ev.title}</div>
                {ev.time && <div className="meta">🕒 {ev.time}</div>}
                {ev.repeat && <div className="meta">{repeatLabel(ev.repeat)}</div>}
                {ev.memo && <div className="memo">{ev.memo}</div>}
              </div>
              <button className="delete-btn" onClick={() => handleDeleteEvent(ev)}>
                ✕
              </button>
            </div>
          ))}

          {dayTodos.map((t) => {
            const done = isTodoDoneOn(t, selectedKey)
            return (
              <div className="item-card" key={t.id}>
                <button
                  className={`check${done ? ' done' : ''}`}
                  onClick={() => onToggleTodo(t, selectedKey)}
                >
                  {done ? '✓' : ''}
                </button>
                <div className="body">
                  <div className={`title${done ? ' done-text' : ''}`}>{t.text}</div>
                  <div className="meta">{t.repeat ? repeatLabel(t.repeat) : '할 일'}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <button className="fab" onClick={() => setShowModal(true)}>
        +
      </button>

      {showModal && (
        <EventModal
          dateKey={selectedKey}
          onClose={() => setShowModal(false)}
          onSave={onAddEvent}
        />
      )}
    </div>
  )
}
