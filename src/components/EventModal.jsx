import { useState } from 'react'

const SWATCHES = ['#E07A3F', '#C1602A', '#D9A441', '#B85C6B', '#7A5C46']

export default function EventModal({ dateKey, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [memo, setMemo] = useState('')
  const [color, setColor] = useState(SWATCHES[0])

  function handleSave() {
    if (!title.trim()) return
    onSave({ title: title.trim(), time, memo: memo.trim(), color, date: dateKey })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h3>새 일정</h3>

        <div>
          <label className="field-label">제목</label>
          <input
            type="text"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일정 제목"
          />
        </div>

        <div>
          <label className="field-label">시간 (선택)</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>

        <div>
          <label className="field-label">메모 (선택)</label>
          <textarea
            rows={3}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="간단한 메모를 남겨보세요"
          />
        </div>

        <div>
          <label className="field-label">색상</label>
          <div className="color-swatches">
            {SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                className={`swatch${color === c ? ' selected' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            취소
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={!title.trim()}>
            저장
          </button>
        </div>
      </div>
    </div>
  )
}
