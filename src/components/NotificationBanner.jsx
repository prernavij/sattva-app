import { useApp } from '../context/AppContext'

export default function NotificationBanner() {
  const { banner, showBanner } = useApp()
  if (!banner) return null

  const colors = {
    info: { bg: '#3D5240', text: '#fff' },
    water: { bg: '#3D5240', text: '#fff' },
    warning: { bg: '#3D5240', text: '#fff' },
    celebrate: { bg: '#E2EAE0', text: '#3D5240' },
  }
  const c = colors[banner.type] || colors.info

  return (
    <div
      className="notif-banner absolute top-0 left-0 right-0 z-50 mx-3 mt-2 rounded-xl px-4 py-3 flex items-center gap-3 shadow-card"
      style={{ background: c.bg, color: c.text }}
    >
      <span className="text-sm font-medium flex-1 leading-snug">{banner.msg}</span>
      <button
        onClick={() => showBanner(null)}
        className="opacity-70 hover:opacity-100 text-lg leading-none"
      >×</button>
    </div>
  )
}
