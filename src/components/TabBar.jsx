const TABS = [
  { id: 'home',     label: 'Home',     icon: HomeIcon },
  { id: 'food',     label: 'Food',     icon: FoodIcon },
  { id: 'water',    label: 'Water',    icon: WaterIcon },
  { id: 'activity', label: 'Activity', icon: ActivityIcon },
  { id: 'profile',  label: 'Profile',  icon: ProfileIcon },
]

const DIM = '#8A9688'
const COLORS = { home: '#3D5240', food: '#3D5240', water: '#3D5240', activity: '#3D5240', profile: '#3D5240' }

function HomeIcon({ active, id }) {
  const c = active ? COLORS[id] : DIM
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 01-1.5 1.5h-4.5V15h-6v6.5H5.5A1.5 1.5 0 014 20V10.5z"
        stroke={c} strokeWidth="1.4" strokeLinejoin="round" fill={active ? c + '18' : 'none'} />
    </svg>
  )
}

function FoodIcon({ active, id }) {
  const c = active ? COLORS[id] : DIM
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M7 3v5a4 4 0 004 4v10" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 3v18" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M14 3c0 3 3 4 3 7" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function WaterIcon({ active, id }) {
  const c = active ? COLORS[id] : DIM
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2.5C12 2.5 5.5 10 5.5 14.5a6.5 6.5 0 0013 0C18.5 10 12 2.5 12 2.5z"
        stroke={c} strokeWidth="1.4" strokeLinejoin="round" fill={active ? c + '18' : 'none'} />
      <path d="M9 17c.5 1.5 2 2.5 3 2.5" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function ActivityIcon({ active, id }) {
  const c = active ? COLORS[id] : DIM
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <polyline points="2,12 6,12 9,4 12,20 15,9 18,12 22,12"
        stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProfileIcon({ active, id }) {
  const c = active ? COLORS[id] : DIM
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke={c} strokeWidth="1.4" fill={active ? c + '18' : 'none'} />
      <path d="M4.5 20c0-3.5 3.4-6.5 7.5-6.5s7.5 3 7.5 6.5"
        stroke={c} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="tab-bar flex items-center justify-around px-1 shrink-0"
      style={{ background: '#EFF0EB', borderTop: '1px solid #D4D8CE', paddingTop: 10, paddingBottom: 10 }}>
      {TABS.map(tab => {
        const active = tab.id === activeTab
        const Icon = tab.icon
        const color = COLORS[tab.id]
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-1 px-3 py-1 transition-all"
          >
            <Icon active={active} id={tab.id} />
            <span
              className="text-[10px] tracking-wide"
              style={{
                color: active ? color : DIM,
                fontWeight: active ? 500 : 400,
                letterSpacing: '0.04em',
              }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
