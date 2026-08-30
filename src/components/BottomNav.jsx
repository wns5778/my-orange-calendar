const TABS = [
  { key: 'calendar', label: '캘린더', icon: '📅' },
  { key: 'todo', label: '할 일', icon: '✅' },
  { key: 'notes', label: '메모', icon: '🗒️' }
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={active === tab.key ? 'active' : ''}
          onClick={() => onChange(tab.key)}
        >
          <span className="icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
