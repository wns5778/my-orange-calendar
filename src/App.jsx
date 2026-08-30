import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth, firebaseConfigured } from './firebase'
import { useAuth } from './hooks/useAuth'
import { useCollection } from './hooks/useCollection'
import { describeFirestoreError } from './utils/firebaseError'
import AuthScreen from './components/AuthScreen'
import BottomNav from './components/BottomNav'
import CalendarView from './components/CalendarView'
import TodoView from './components/TodoView'
import NotesView from './components/NotesView'

export default function App() {
  const user = useAuth()
  const [tab, setTab] = useState('calendar')
  const [errorMsg, setErrorMsg] = useState('')

  const events = useCollection(user?.uid, 'events', 'date')
  const todos = useCollection(user?.uid, 'todos', null)
  const notes = useCollection(user?.uid, 'notes', null)

  // Firestore 쓰기가 실패해도(권한/네트워크 오류 등) 조용히 무시되지 않도록 감싸서 화면에 표시한다.
  function guarded(action) {
    return async (...args) => {
      try {
        await action(...args)
      } catch (err) {
        setErrorMsg(describeFirestoreError(err))
      }
    }
  }

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

      {errorMsg && (
        <div className="error-banner">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')}>✕</button>
        </div>
      )}

      <div className="content">
        {tab === 'calendar' && (
          <CalendarView
            events={events.items}
            todos={todos.items}
            onAddEvent={guarded(events.add)}
            onDeleteEvent={guarded(events.remove)}
          />
        )}
        {tab === 'todo' && (
          <TodoView
            todos={todos.items}
            onAdd={guarded(todos.add)}
            onToggle={guarded((id, done) => todos.update(id, { done }))}
            onDelete={guarded(todos.remove)}
          />
        )}
        {tab === 'notes' && (
          <NotesView
            notes={notes.items}
            onAdd={guarded(notes.add)}
            onUpdate={guarded(notes.update)}
            onDelete={guarded(notes.remove)}
          />
        )}
      </div>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
