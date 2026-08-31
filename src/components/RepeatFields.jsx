import { WEEKDAY_SHORT } from '../utils/recurrence'

export default function RepeatFields({ enabled, onToggleEnabled, weekdays, onToggleWeekday, until, onChangeUntil, minDate }) {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink-soft)', cursor: 'pointer' }}>
        <input type="checkbox" checked={enabled} onChange={(e) => onToggleEnabled(e.target.checked)} />
        🔁 반복 (요일 지정)
      </label>

      {enabled && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="weekday-chips">
            {WEEKDAY_SHORT.map((label, idx) => (
              <button
                key={idx}
                type="button"
                className={`weekday-chip${weekdays.includes(idx) ? ' selected' : ''}`}
                onClick={() => onToggleWeekday(idx)}
              >
                {label}
              </button>
            ))}
          </div>
          <div>
            <label className="field-label">반복 종료일</label>
            <input type="date" value={until} min={minDate} onChange={(e) => onChangeUntil(e.target.value)} />
          </div>
        </div>
      )}
    </div>
  )
}
