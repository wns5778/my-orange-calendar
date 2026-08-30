const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayKey() {
  return toDateKey(new Date())
}

export function dayNameOf(index) {
  return DAY_NAMES[index]
}

// Returns an array of Date objects covering the full weeks that contain the given month.
export function buildMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1)
  const startOffset = firstOfMonth.getDay() // 0 = Sunday
  const gridStart = new Date(year, month, 1 - startOffset)

  const cells = []
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i))
  }
  return cells
}

export function isSameMonth(date, year, month) {
  return date.getFullYear() === year && date.getMonth() === month
}

export function formatMonthTitle(year, month) {
  return `${year}년 ${month + 1}월`
}

export function formatFullDate(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${DAY_NAMES[date.getDay()]})`
}
