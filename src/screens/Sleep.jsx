import { useState } from 'react'
import { useApp } from '../context/AppContext'

const QUALITY_OPTIONS = [
  { id: 'deep', label: 'Deep', color: '#3D5240', score: 4 },
  { id: 'good', label: 'Good', color: '#3D5240', score: 3 },
  { id: 'okay', label: 'Okay', color: '#3D5240', score: 2 },
  { id: 'poor', label: 'Poor', color: '#9CA3AF', score: 1 },
]

function timeToDecimal(timeStr) {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(':').map(Number)
  return h + m / 60
}

function calcDuration(bedtime, wake) {
  let bed = timeToDecimal(bedtime)
  let wk = timeToDecimal(wake)
  if (wk <= bed) wk += 24
  return Math.round((wk - bed) * 10) / 10
}

function SleepRing({ hours, goal }) {
  const pct = Math.min(hours / goal, 1)
  const r = 70
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - pct)
  const score = hours >= goal ? 'A' : hours >= goal * 0.85 ? 'B' : 'C'
  const scoreColors = { A: '#3D5240', B: '#3D5240', C: '#3D5240' }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44">
        <svg width="176" height="176" viewBox="0 0 176 176" className="-rotate-90">
          <circle cx="88" cy="88" r={r} fill="none" stroke="#F0EEF8" strokeWidth="14" />
          <circle
            cx="88" cy="88" r={r} fill="none"
            stroke="#3D5240" strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(.4,0,.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-stone-800">{hours.toFixed(1)}h</span>
          <span className="text-sm text-stone-400">of {goal}h</span>
          <span className="text-xl font-bold mt-1" style={{ color: scoreColors[score] }}>{score}</span>
        </div>
      </div>
    </div>
  )
}

export default function SleepScreen({ onClose }) {
  const { goals, sleepLogs, logSleep, todaySleep_h } = useApp()
  const [bedtime, setBedtime] = useState('22:30')
  const [wake, setWake] = useState('06:30')
  const [quality, setQuality] = useState('good')

  const duration = calcDuration(bedtime, wake)
  const weekAvg = sleepLogs.length
    ? Math.round(sleepLogs.reduce((s, l) => s + l.duration_h, 0) / sleepLogs.length * 10) / 10
    : todaySleep_h

  const handleLog = () => {
    logSleep({ bedtime, wake_time: wake, duration_h: duration, quality })
  }

  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col overflow-hidden screen-enter">
      <div className="flex items-center px-4 pt-12 pb-4 border-b border-stone-100">
        <button onClick={onClose} className="mr-4 text-stone-500 text-lg">←</button>
        <h1 className="font-serif text-xl text-sleep">Sleep</h1>
      </div>

      <div className="flex-1 overflow-y-auto scrollable px-4 py-6">
        {/* Ring */}
        <div className="flex justify-center mb-6">
          <SleepRing hours={todaySleep_h || duration} goal={goals.sleep_goal_h} />
        </div>

        {/* Time inputs */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-xs font-medium text-stone-500 block mb-1.5">Bedtime</label>
            <input
              type="time"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base focus:border-sleep"
              value={bedtime}
              onChange={e => setBedtime(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 block mb-1.5">Wake time</label>
            <input
              type="time"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base focus:border-sleep"
              value={wake}
              onChange={e => setWake(e.target.value)}
            />
          </div>
        </div>

        {duration > 0 && (
          <div className="bg-purple-50 rounded-xl p-3 mb-4 text-center">
            <span className="text-sm font-medium text-sleep">{duration}h sleep</span>
          </div>
        )}

        {/* Quality */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2.5">Sleep quality</p>
          <div className="grid grid-cols-4 gap-2">
            {QUALITY_OPTIONS.map(q => (
              <button
                key={q.id}
                onClick={() => setQuality(q.id)}
                className="py-2.5 rounded-xl text-xs font-semibold border-2 transition-all"
                style={{
                  borderColor: quality === q.id ? q.color : '#E5E7EB',
                  background: quality === q.id ? q.color + '22' : '#fff',
                  color: quality === q.id ? q.color : '#9CA3AF',
                }}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLog}
          className="w-full py-3.5 rounded-xl font-semibold text-white"
          style={{ background: '#3D5240' }}
        >
          Log Sleep
        </button>

        {/* Weekly avg */}
        <div className="mt-6 bg-white rounded-xl p-4 shadow-card">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Weekly average</p>
              <p className="text-2xl font-bold text-sleep mt-1">{weekAvg}h</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400">Goal</p>
              <p className="text-xl font-semibold text-stone-600">{goals.sleep_goal_h}h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
