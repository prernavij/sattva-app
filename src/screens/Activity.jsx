import { useState } from 'react'
import { useApp } from '../context/AppContext'
import ProgressBar from '../components/ProgressBar'
import DiyaLogo from '../components/DiyaLogo'

const ACTIVITIES = [
  { id: 'run', label: 'Run', icon: '🏃', met: 8, benefit: 'Boosts cardiovascular health and burns calories efficiently.' },
  { id: 'walk', label: 'Walk', icon: '🚶', met: 3.5, benefit: 'Low impact, great for active recovery and mental clarity.' },
  { id: 'strength', label: 'Strength', icon: '🏋️', met: 5, benefit: 'Builds muscle and increases resting metabolic rate.' },
  { id: 'yoga', label: 'Yoga', icon: '🧘', met: 2.5, benefit: 'Improves flexibility, balance, and reduces stress cortisol.' },
  { id: 'cycle', label: 'Cycle', icon: '🚴', met: 7, benefit: 'Great cardio that\'s easy on joints with high calorie burn.' },
  { id: 'swim', label: 'Swim', icon: '🏊', met: 7, benefit: 'Full-body workout with excellent recovery benefits.' },
  { id: 'hiit', label: 'HIIT', icon: '⚡', met: 9, benefit: 'Maximises calorie burn and metabolic boost in short time.' },
  { id: 'dance', label: 'Dance', icon: '💃', met: 5, benefit: 'Fun way to improve coordination and cardiovascular fitness.' },
]

const INTENSITIES = [
  { id: 'easy', label: 'Easy', multi: 0.8 },
  { id: 'moderate', label: 'Moderate', multi: 1.0 },
  { id: 'hard', label: 'Hard', multi: 1.3 },
]

function calcKcalBurned(met, intensityMulti, weightKg, durationMin) {
  return Math.round(met * intensityMulti * weightKg * (durationMin / 60))
}

function LogTab() {
  const { profile, goals, activityLogs, addActivityLog, removeActivityLog, todayKcal } = useApp()
  const [activity, setActivity] = useState('walk')
  const [customActivity, setCustomActivity] = useState('')
  const [duration, setDuration] = useState('30')
  const [intensity, setIntensity] = useState('moderate')
  const [notes, setNotes] = useState('')

  const weightKg = profile.weight_lbs / 2.2046

  // If custom text is entered, use it; otherwise use chip selection
  const isCustom = customActivity.trim().length > 0
  const activityLabel = isCustom ? customActivity.trim() : (ACTIVITIES.find(a => a.id === activity)?.label || activity)
  const selectedAct = isCustom
    ? (ACTIVITIES.find(a => a.label.toLowerCase() === customActivity.trim().toLowerCase()) || { met: 5, benefit: 'General activity — calorie estimate based on moderate effort.' })
    : ACTIVITIES.find(a => a.id === activity)
  const selectedInt = INTENSITIES.find(i => i.id === intensity)
  const kcalBurned = selectedAct && selectedInt && duration
    ? calcKcalBurned(selectedAct.met, selectedInt.multi, weightKg, parseFloat(duration) || 0)
    : 0
  const netKcal = (goals.cal_goal - todayKcal) + kcalBurned

  const handleLog = () => {
    if (!duration || parseFloat(duration) <= 0) return
    addActivityLog({
      activity_type: activityLabel,
      duration_min: parseFloat(duration),
      intensity,
      kcal_burned: kcalBurned,
      notes,
    })
    setDuration('30')
    setCustomActivity('')
    setNotes('')
  }

  const totalKcalBurned = activityLogs.reduce((s, a) => s + (a.kcal_burned || 0), 0)
  const totalMin = activityLogs.reduce((s, a) => s + (a.duration_min || 0), 0)

  return (
    <div className="flex-1 overflow-y-auto scrollable px-4 py-4">
      {/* Activity */}
      <div>
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2.5">Activity</p>
        <div className="flex gap-2 overflow-x-auto scrollable pb-1 -mx-4 px-4">
          {ACTIVITIES.map(a => {
            const on = !isCustom && activity === a.id
            return (
              <button
                key={a.id}
                onClick={() => { setActivity(a.id); setCustomActivity('') }}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: on ? '#3D5240' : '#E8EDE6',
                  color: on ? '#fff' : '#5A6B5C',
                }}
              >
                <span>{a.icon}</span>
                <span>{a.label}</span>
              </button>
            )
          })}
        </div>
        <input
          className="w-full mt-3 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:border-green-primary bg-white"
          placeholder="Or type any activity — pilates, cricket, martial arts…"
          value={customActivity}
          onChange={e => setCustomActivity(e.target.value)}
        />
      </div>

      {/* Duration + Intensity */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Duration (min)</p>
          <input
            type="number"
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base focus:border-activity"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            placeholder="30"
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Intensity</p>
          <div className="flex flex-col gap-1.5">
            {INTENSITIES.map(i => (
              <button
                key={i.id}
                onClick={() => setIntensity(i.id)}
                className="py-2 rounded-xl text-xs font-medium border-2 transition-all"
                style={{
                  borderColor: intensity === i.id ? '#3D5240' : '#E5E7EB',
                  background: intensity === i.id ? '#FDF1E8' : '#fff',
                  color: intensity === i.id ? '#3D5240' : '#9CA3AF',
                }}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Estimate */}
      {kcalBurned > 0 && (
        <div className="mt-4 bg-orange-50 rounded-xl px-4 py-3 border border-orange-100 flex items-center justify-between">
          <p className="text-xs text-stone-500 flex-1">{selectedAct?.benefit}</p>
          <div className="text-right shrink-0 ml-4">
            <p className="text-base font-bold text-activity">~{kcalBurned} kcal</p>
            <p className="text-[10px] text-stone-400">estimated burn</p>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="mt-4">
        <input
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:border-activity"
          placeholder="Optional notes…"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      <button
        onClick={handleLog}
        disabled={!duration || parseFloat(duration) <= 0}
        className="w-full mt-4 py-3.5 rounded-xl font-semibold text-white"
        style={{ background: (duration && parseFloat(duration) > 0) ? '#3D5240' : '#F0C9A0' }}
      >
        Log Activity
      </button>

      {/* Today's logs */}
      {activityLogs.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Today</h3>
            <span className="text-xs text-stone-400">{totalMin} min · {totalKcalBurned} kcal</span>
          </div>
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            {activityLogs.map(log => {
              const act = ACTIVITIES.find(a => a.id === log.activity_type)
              return (
                <div key={log.id} className="flex items-center px-4 py-3 border-b border-stone-50 last:border-0">
                  <span className="text-xl mr-3">{act?.icon || '🏃'}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-800">{act?.label || log.activity_type}</p>
                    <p className="text-xs text-stone-400">{log.duration_min}min · {log.intensity} · {log.kcal_burned} kcal</p>
                  </div>
                  <button onClick={() => removeActivityLog(log.id)} className="text-stone-300 hover:text-red-400 text-lg leading-none">×</button>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <div className="h-6" />
    </div>
  )
}

function BodyTab() {
  const { profile, bodyLogs, addBodyLog } = useApp()
  const [form, setForm] = useState({ weight_lbs: '', waist_in: '', chest_in: '', hips_in: '', arms_in: '' })

  const latestBody = bodyLogs.length ? bodyLogs[bodyLogs.length - 1] : null
  const firstBody = bodyLogs.length ? bodyLogs[0] : null
  const currentWeight = latestBody?.weight_lbs || profile.weight_lbs
  const startWeight = firstBody?.weight_lbs || profile.weight_lbs
  const goalWeight = profile.goal === 'lose' ? startWeight - 10 : profile.goal === 'build' ? startWeight + 10 : startWeight
  const weightChange = currentWeight - startWeight
  const weeksData = bodyLogs.slice(-4).map((b, i) => ({ week: i + 1, weight: b.weight_lbs }))

  const handleLog = () => {
    if (!form.weight_lbs) return
    addBodyLog({
      weight_lbs: parseFloat(form.weight_lbs),
      waist_in: parseFloat(form.waist_in) || null,
      chest_in: parseFloat(form.chest_in) || null,
      hips_in: parseFloat(form.hips_in) || null,
      arms_in: parseFloat(form.arms_in) || null,
    })
    setForm({ weight_lbs: '', waist_in: '', chest_in: '', hips_in: '', arms_in: '' })
  }

  const paceWeeks = bodyLogs.length >= 2 ? (() => {
    const diff = goalWeight - currentWeight
    const weeklyChange = (bodyLogs[bodyLogs.length - 1].weight_lbs - bodyLogs[0].weight_lbs) / bodyLogs.length
    return weeklyChange !== 0 ? Math.abs(Math.ceil(diff / weeklyChange)) : null
  })() : null

  return (
    <div className="flex-1 overflow-y-auto scrollable px-4 py-4">
      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Current', value: `${currentWeight}lbs` },
          { label: 'Change', value: `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}lbs` },
          { label: 'Goal', value: `${goalWeight}lbs` },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-3 shadow-card text-center">
            <p className="text-base font-bold text-stone-800">{s.value}</p>
            <p className="text-xs text-stone-400">{s.label}</p>
          </div>
        ))}
      </div>

      {paceWeeks && (
        <div className="bg-green-light rounded-xl p-3 mb-4 text-center">
          <p className="text-sm text-green-primary font-medium">At this pace, ~{paceWeeks} weeks to goal</p>
        </div>
      )}

      {/* Sattva insight */}
      <div className="bg-stone-50 rounded-xl p-3 mb-5 flex gap-3">
        <DiyaLogo size={24} className="shrink-0 mt-0.5" />
        <p className="text-xs text-stone-600 leading-relaxed">
          Consistent protein intake ({profile.goal === 'build' ? '2.0' : '1.6'}g/kg) protects muscle during weight changes.
          Pair strength training with protein timing for best body composition results.
        </p>
      </div>

      {/* Log measurements */}
      <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Log today's measurements</p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          { key: 'weight_lbs', label: 'Weight (lbs)', placeholder: 'lbs' },
          { key: 'waist_in', label: 'Waist (in)', placeholder: 'inches' },
          { key: 'chest_in', label: 'Chest (in)', placeholder: 'inches' },
          { key: 'hips_in', label: 'Hips (in)', placeholder: 'inches' },
          { key: 'arms_in', label: 'Arms (in)', placeholder: 'inches' },
        ].map(f => (
          <div key={f.key}>
            <label className="text-xs text-stone-500 mb-1 block">{f.label}</label>
            <input
              type="number"
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:border-green-primary"
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleLog}
        disabled={!form.weight_lbs}
        className="w-full py-3 rounded-xl font-semibold text-white mb-6"
        style={{ background: form.weight_lbs ? '#3D5240' : '#BDC9B6' }}
      >
        Log Measurements
      </button>

      {/* Weight trend */}
      {weeksData.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">4-week weight trend</p>
          <div className="bg-white rounded-xl p-4 shadow-card">
            {bodyLogs.slice(-4).map((log, i) => (
              <div key={log.id} className="flex items-center gap-3 py-2 border-b border-stone-50 last:border-0">
                <span className="text-xs text-stone-400 w-16">
                  {new Date(log.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1 h-2 bg-stone-100 rounded-full">
                  <div className="h-full rounded-full bg-green-mid"
                    style={{ width: `${Math.min(100, (log.weight_lbs / goalWeight) * 100)}%` }} />
                </div>
                <span className="text-sm font-semibold text-stone-700 w-14 text-right">{log.weight_lbs}lbs</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="h-6" />
    </div>
  )
}

function StatsTab() {
  const { goals, foodLogs, activityLogs, sleepLogs, waterLogs, todayKcal, todayProtein, todayWater_l, todaySleep_h } = useApp()

  // Build 7-day data (simplified — using today's values for demo)
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const todayIdx = (new Date().getDay() + 6) % 7
  const kcalData = days.map((d, i) => i === todayIdx ? todayKcal : Math.round(goals.cal_goal * (0.7 + Math.random() * 0.5)))
  const protData = days.map((d, i) => i === todayIdx ? todayProtein : Math.round(goals.protein_goal * (0.6 + Math.random() * 0.6)))
  const maxKcal = Math.max(...kcalData, goals.cal_goal)

  return (
    <div className="flex-1 overflow-y-auto scrollable px-4 py-4">
      {/* Calorie bar chart */}
      <div className="bg-white rounded-xl p-4 shadow-card mb-4">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">7-day calories</p>
        <div className="flex items-end gap-1 h-24 relative">
          {/* Goal line */}
          <div className="absolute left-0 right-0 border-t border-dashed border-green-primary/40"
            style={{ bottom: `${(goals.cal_goal / maxKcal) * 100}%` }}>
            <span className="text-[9px] text-green-primary/60 absolute right-0 -top-3">{goals.cal_goal}</span>
          </div>
          {kcalData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full relative" style={{ height: 84 }}>
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-sm chart-bar"
                  style={{
                    height: `${(val / maxKcal) * 100}%`,
                    background: i === todayIdx ? '#3D5240' : '#BDC9B6',
                    minHeight: val > 0 ? 3 : 0
                  }}
                />
              </div>
              <span className="text-[9px] text-stone-400">{days[i].slice(0,1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Protein bars */}
      <div className="bg-white rounded-xl p-4 shadow-card mb-4">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">7-day protein</p>
        {protData.map((val, i) => (
          <div key={i} className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] text-stone-400 w-6">{days[i].slice(0,1)}</span>
            <div className="flex-1 h-4 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min((val / goals.protein_goal) * 100, 100)}%`,
                  background: i === todayIdx ? '#3D5240' : '#F0C9A0',
                }}
              />
            </div>
            <span className="text-[11px] text-stone-500 w-8 text-right">{val}g</span>
          </div>
        ))}
      </div>

      {/* Sleep + Water summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-card">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Sleep avg</p>
          <p className="text-2xl font-bold" style={{ color: '#3D5240' }}>{todaySleep_h.toFixed(1)}h</p>
          <p className="text-xs text-stone-400">Goal: {goals.sleep_goal_h}h</p>
          <ProgressBar value={todaySleep_h} max={goals.sleep_goal_h} color="#3D5240" height={4} className="mt-2" />
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Water avg</p>
          <p className="text-2xl font-bold text-water">{todayWater_l.toFixed(1)}L</p>
          <p className="text-xs text-stone-400">Goal: {goals.water_goal_l}L</p>
          <ProgressBar value={todayWater_l} max={goals.water_goal_l} color="#3D5240" height={4} className="mt-2" />
        </div>
      </div>
      <div className="h-6" />
    </div>
  )
}

export default function Activity() {
  const [subTab, setSubTab] = useState('log')

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Sub-tabs */}
      <div className="flex bg-white border-b border-stone-100 px-4 pt-12">
        {[['log', 'Log'], ['body', 'Body'], ['stats', 'Stats']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className="flex-1 pb-3 text-sm font-semibold border-b-2 transition-all"
            style={{
              borderColor: subTab === id ? '#3D5240' : 'transparent',
              color: subTab === id ? '#3D5240' : '#9CA3AF',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {subTab === 'log' && <LogTab />}
      {subTab === 'body' && <BodyTab />}
      {subTab === 'stats' && <StatsTab />}
    </div>
  )
}
