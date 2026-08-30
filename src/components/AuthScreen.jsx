import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { auth, firebaseConfigured } from '../firebase'

const ERROR_MESSAGES = {
  'auth/invalid-email': '이메일 형식이 올바르지 않아요.',
  'auth/user-not-found': '가입되지 않은 이메일이에요.',
  'auth/wrong-password': '비밀번호가 올바르지 않아요.',
  'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않아요.',
  'auth/email-already-in-use': '이미 가입된 이메일이에요. 로그인해 주세요.',
  'auth/weak-password': '비밀번호는 6자 이상이어야 해요.'
}

export default function AuthScreen() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!firebaseConfigured) {
    return (
      <div className="auth-screen">
        <div className="brand">
          <div className="emoji">🍊</div>
          <h1>My Orange Calendar</h1>
          <p>나만의 캘린더 · 할 일 · 메모</p>
        </div>
        <div className="setup-warning">
          Firebase 설정이 아직 안 되어 있어요. 프로젝트 루트에 <b>.env</b> 파일을 만들고
          Firebase 콘솔에서 발급받은 값을 넣어주세요. 자세한 방법은 README.md를 참고하세요.
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] || '오류가 발생했어요. 다시 시도해 주세요.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="brand">
        <div className="emoji">🍊</div>
        <h1>My Orange Calendar</h1>
        <p>나만의 캘린더 · 할 일 · 메모</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label className="field-label">이메일</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="field-label">비밀번호</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6자 이상"
          />
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button className="btn-primary" type="submit" disabled={busy}>
          {mode === 'signin' ? '로그인' : '회원가입'}
        </button>
      </form>

      <div style={{ textAlign: 'center' }}>
        {mode === 'signin' ? (
          <button className="btn-text" onClick={() => setMode('signup')}>
            처음이신가요? 회원가입
          </button>
        ) : (
          <button className="btn-text" onClick={() => setMode('signin')}>
            이미 계정이 있어요. 로그인
          </button>
        )}
      </div>

      <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--ink-soft)' }}>
        같은 이메일/비밀번호로 폰과 PC에서 로그인하면 데이터가 자동으로 동기화돼요.
      </p>
    </div>
  )
}
