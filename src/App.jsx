import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth, firebaseConfigured } from './firebase'
import { useAuth } from './hooks/useAuth'
import { useCollection } from './hooks/useCollection'
import AuthScreen from './components/AuthScreen'
import BottomNav from './components/BottomNav'
import CalendarView from './components/CalendarView'
import TodoView from './components/TodoView'
import NotesView from './components/NotesView'

export default function App() {
  const user = useAuth()
  const [tab, setTab] = useState('calendar')

  const events = useCollection(user?.uid, 'events', 'date')
  const todos = useCollection(user?.uid, 'todos', null)
  const notes = useCollection(user?.uid, 'notes', null)

  if (user === undefined) {
    return (
      <div className="app-shell">
        <div className="loading-screen">불러오는 중…</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="app-shell">
        <AuthScreen />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="top-bar">
        <h1>🍊 My Orange Calendar</h1>
        {firebaseConfigured && (
          <button className="logout-btn" onClick={() => signOut(auth)}>
            로그아웃
          </button>
        )}
      </div>

      <div className="content">
        {tab === 'calendar' && (
          <CalendarView
            events={events.items}
            todos={todos.items}
            onAddEvent={events.add}
            onDeleteEvent={events.remove}
          />
        )}
        {tab === 'todo' && (
          <TodoView
            todos={todos.items}
            onAdd={todos.add}
            onToggle={(id, done) => todos.update(id, { done })}
            onDelete={todos.remove}
          />
        )}
        {tab === 'notes' && (
          <NotesView
            notes={notes.items}
            onAdd={notes.add}
            onUpdate={notes.update}
            onDelete={notes.remove}
          />
        )}
      </div>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
