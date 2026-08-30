import { useState } from 'react'

export default function NoteModal({ initial, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [content, setContent] = useState(initial?.content || '')
  const [date, setDate] = useState(initial?.date || '')

  function handleSave() {
    if (!title.trim() && !content.trim()) return
    onSave({ title: title.trim() || '제목 없음', content: content.trim(), date: date || null })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h3>{initial ? '메모 수정' : '새 메모'}</h3>

        <div>
          <label className="field-label">제목</label>
          <input
            type="text"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="메모 제목"
          />
        </div>

        <div>
          <label className="field-label">내용</label>
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="자유롭게 적어보세요"
          />
        </div>

        <div>
          <label className="field-label">연결할 날짜 (선택)</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="modal-actions">
          {initial ? (
            <button
              className="btn-secondary"
              onClick={() => {
                onDelete(initial.id)
                onClose()
              }}
            >
              삭제
            </button>
          ) : (
            <button className="btn-secondary" onClick={onClose}>
              취소
            </button>
          )}
          <button className="btn-primary" onClick={handleSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  )
}
