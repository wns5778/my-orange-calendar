export const WEEKDAY_SHORT = ['일', '월', '화', '수', '목', '금', '토']

// item.date is the series' start date. item.repeat = { weekdays: number[], until: 'YYYY-MM-DD' } | undefined.
export function occursOn(item, dateKey) {
  if (!item.date) return false
  if (!item.repeat) return item.date === dateKey
  if (dateKey < item.date) return false
  if (item.repeat.until && dateKey > item.repeat.until) return false
  const weekday = new Date(dateKey + 'T00:00:00').getDay()
  return item.repeat.weekdays.includes(weekday)
}

export function isTodoDoneOn(todo, dateKey) {
  if (todo.repeat) return (todo.completedDates || []).includes(dateKey)
  return !!todo.done
}

export function toggledTodoUpdate(todo, dateKey) {
  if (todo.repeat) {
    const set = new Set(todo.completedDates || [])
    if (set.has(dateKey)) {
      set.delete(dateKey)
    } else {
      set.add(dateKey)
    }
    return { completedDates: [...set] }
  }
  return { done: !todo.done }
}

export function repeatLabel(repeat) {
  const days = [...repeat.weekdays].sort((a, b) => a - b).map((d) => WEEKDAY_SHORT[d]).join('·')
  const until = repeat.until ? ` · ~${repeat.until.slice(5).replace('-', '/')}까지` : ''
  return `🔁 ${days}${until}`
}
