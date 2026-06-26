import { useState } from 'react'
import { useApp, calcGoals } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import DiyaLogo from '../components/DiyaLogo'

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-all shrink-0"
      style={{ background: value ? '#3D5240' : '#D1D5DB' }}
    >
      <div
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
        style={{ left: value ? '22px' : '2px' }}
      />
    </button>
  )
}

function TimePicker({ value, onChange, label, enabled }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-stone-600 flex-1">{label}</span>
      <input
        type="time"
        disabled={!enabled}
        className="text-sm border border-stone-200 rounded-lg px-2 py-1.5 disabled:opacity-40"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

export default function Profile() {
  const { profile, updateProfile, goals, notifSettings, setNotifSettings, streak, bodyLogs, signOut } = useApp()
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ ...profile, target_weight_lbs: profile.target_weight_lbs ?? '' })
  const [activeSection, setActiveSection] = useState('profile') // 'profile' | 'notif'

  const set = (k, v) => setEditForm(f => ({ ...f, [k]: v }))
  const setNotif = (k, v) => setNotifSettings(s => ({ ...s, [k]: v }))

  const saveProfile = () => {
    updateProfile(editForm)
    setEditing(false)
  }

  const ACTIVITY_LABELS = { sedentary: 'Sedentary', light: 'Light', moderate: 'Moderate', active: 'Active', very_active: 'Very Active' }
  const GOAL_OPTIONS = [
    { id: 'lose_fat',          label: 'Lose fat',           icon: '📉', computable: true },
    { id: 'build_strength',    label: 'Build strength',     icon: '💪', computable: true },
    { id: 'improve_endurance', label: 'Improve endurance',  icon: '🏃', computable: true },
    { id: 'maintain_weight',   label: 'Maintain weight',    icon: '⚖️', computable: true },
    { id: 'better_sleep',      label: 'Better sleep',       icon: '😴', computable: true },
    { id: 'manage_stress',     label: 'Manage stress',      icon: '🧘', computable: false },
    { id: 'eat_healthier',     label: 'Eat healthier',      icon: '🥗', computable: false },
  ]
  const toggleGoalEdit = (id) => {
    setEditForm(f => {
      const goals = Array.isArray(f.goals) ? f.goals : ['maintain_weight']
      const has = goals.includes(id)
      let next = has ? goals.filter(g => g !== id) : [...goals, id]
      if (!has && id === 'maintain_weight') next = ['maintain_weight']
      if (!has && id !== 'maintain_weight') next = next.filter(g => g !== 'maintain_weight')
      if (next.length === 0) next = ['maintain_weight']
      return { ...f, goals: next }
    })
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: '#EFF0EB' }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#E2EAE0' }}>
            <span className="text-xl font-semibold" style={{ color: '#3D5240' }}>
              {(profile.name || 'F')[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: '#1C1410' }}>{profile.name}</h1>
            <p className="text-sm mt-0.5" style={{ color: '#8A9688' }}>
              {profile.age}y · {profile.sex} · {Math.round(profile.height_cm / 30.48)}'{Math.round(profile.height_cm / 2.54 % 12)}"
            </p>
            {streak >= 2 && (
              <span className="rounded-pill px-2 py-0.5 text-xs font-medium mt-1 inline-block"
                style={{ background: '#E2EAE0', color: '#3D5240' }}>
                🔥 {streak}-day streak
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex bg-white border-b border-stone-100 px-4">
        {[['profile', 'Profile'], ['notif', 'Notifications']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className="flex-1 pb-3 pt-3 text-sm font-semibold border-b-2 transition-all"
            style={{
              borderColor: activeSection === id ? '#3D5240' : 'transparent',
              color: activeSection === id ? '#3D5240' : '#9CA3AF',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollable px-4 py-4">
        {activeSection === 'profile' && (
          <>
            {/* Goals summary */}
            <div className="bg-green-light rounded-2xl p-4 mb-5">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-semibold text-green-primary">Daily targets</h2>
                <button
                  onClick={() => setEditing(e => !e)}
                  className="text-xs text-green-primary font-medium underline"
                >
                  {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {[
                { label: 'Calories', value: `${goals.cal_goal} kcal` },
                { label: 'Protein', value: `${goals.protein_goal}g` },
                { label: 'Water', value: `${goals.water_goal_l}L` },
                { label: 'Sleep', value: `${goals.sleep_goal_h}h` },
                { label: 'Workouts', value: `${goals.workout_goal_week}×/week` },
              ].map(g => (
                <div key={g.label} className="flex justify-between py-1.5 border-b border-green-mid/30 last:border-0">
                  <span className="text-sm text-stone-600">{g.label}</span>
                  <span className="text-sm font-semibold text-green-primary">{g.value}</span>
                </div>
              ))}
            </div>

            {/* Weight goal card — separate from daily targets */}
            {goals.target_weight_lbs && (Array.isArray(profile.goals) ? profile.goals : []).some(g => ['lose_fat','build_strength'].includes(g)) && (
              <div className="bg-white rounded-2xl p-4 shadow-card mb-5">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-sm font-semibold text-stone-700">Weight goal</h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-pill"
                    style={{ background: '#3D524018', color: '#3D5240' }}>
                    {GOAL_LABELS[profile.goal] || profile.goal}
                  </span>
                </div>
                {(() => {
                  const latestLog = bodyLogs.length ? bodyLogs[bodyLogs.length - 1] : null
                  const currentW = latestLog?.weight_lbs || profile.weight_lbs
                  const startW = profile.weight_lbs
                  const targetW = goals.target_weight_lbs
                  const totalDiff = Math.abs(startW - targetW)
                  const doneDiff = Math.abs(startW - currentW)
                  const pct = totalDiff > 0 ? Math.min(Math.round((doneDiff / totalDiff) * 100), 100) : 0
                  const remaining = Math.abs(currentW - targetW).toFixed(1)
                  return (
                    <>
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <p className="text-2xl font-bold text-stone-800">{currentW} <span className="text-sm font-normal text-stone-400">lbs</span></p>
                          <p className="text-xs text-stone-400">current</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-primary">{targetW} <span className="text-sm font-normal text-stone-400">lbs</span></p>
                          <p className="text-xs text-stone-400">target</p>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-stone-100 overflow-hidden mb-2">
                        <div className="h-full rounded-full bg-green-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-stone-400">
                        <span>{pct}% complete · {remaining} lbs to go</span>
                        {goals.weeks_to_goal && <span>~{goals.weeks_to_goal} weeks</span>}
                      </div>
                    </>
                  )
                })()}
              </div>
            )}

            {/* Edit form */}
            {editing && (
              <div className="bg-white rounded-2xl p-4 shadow-card mb-5">
                <h3 className="text-sm font-semibold text-stone-700 mb-4">Edit profile</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { key: 'name', label: 'Name', type: 'text' },
                    { key: 'age', label: 'Age', type: 'number' },
                    { key: 'weight_lbs', label: 'Current weight (lbs)', type: 'number' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-xs text-stone-500 block mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:border-green-primary"
                        value={editForm[f.key]}
                        onChange={e => set(f.key, e.target.value)}
                      />
                    </div>
                  ))}
                  {editForm.goal !== 'maintain' && (
                    <div>
                      <label className="text-xs text-stone-500 block mb-1">Target weight (lbs)</label>
                      <input
                        type="number"
                        className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:border-green-primary"
                        placeholder={editForm.goal === 'lose' ? 'e.g. 130' : 'e.g. 160'}
                        value={editForm.target_weight_lbs ?? ''}
                        onChange={e => set('target_weight_lbs', e.target.value ? parseFloat(e.target.value) : null)}
                      />
                      {editForm.target_weight_lbs && editForm.weight_lbs && (
                        <p className="text-xs text-green-primary mt-1">
                          {Math.abs(editForm.weight_lbs - editForm.target_weight_lbs).toFixed(1)} lbs to go
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-stone-500 block mb-2">Goals</label>
                    <div className="grid grid-cols-2 gap-2">
                      {GOAL_OPTIONS.map(g => {
                        const editGoals = Array.isArray(editForm.goals) ? editForm.goals : ['maintain_weight']
                        const on = editGoals.includes(g.id)
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => toggleGoalEdit(g.id)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-left"
                            style={{ borderColor: on ? '#3D5240' : '#E5E7EB', background: on ? '#E2EAE0' : '#fff' }}
                          >
                            <span className="text-lg">{g.icon}</span>
                            <span className="text-xs font-medium text-stone-700 leading-tight">{g.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Anything else?</label>
                    <input
                      className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm bg-white"
                      placeholder="Custom goal notes…"
                      value={editForm.goal_notes || ''}
                      onChange={e => set('goal_notes', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Activity level</label>
                    <select
                      className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm bg-white"
                      value={editForm.activity_level}
                      onChange={e => set('activity_level', e.target.value)}
                    >
                      {Object.entries(ACTIVITY_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={saveProfile}
                    className="w-full py-3 rounded-xl font-semibold text-white bg-green-primary"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <h3 className="text-sm font-semibold text-stone-700 mb-3">About</h3>
              <div className="flex justify-between py-2 border-b border-stone-50">
                <span className="text-sm text-stone-500">Goals</span>
                <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                  {(Array.isArray(profile.goals) ? profile.goals : ['maintain_weight']).map(gid => {
                    const opt = GOAL_OPTIONS.find(o => o.id === gid)
                    return opt ? <span key={gid} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#E2EAE0', color: '#3D5240' }}>{opt.icon} {opt.label}</span> : null
                  })}
                </div>
              </div>
              {profile.goal_notes?.trim() && (
                <div className="flex justify-between py-2 border-b border-stone-50">
                  <span className="text-sm text-stone-500">Notes</span>
                  <span className="text-sm text-stone-600 max-w-[60%] text-right">{profile.goal_notes}</span>
                </div>
              )}
              {[
                { label: 'Activity', value: ACTIVITY_LABELS[profile.activity_level] },
                { label: 'Sex', value: profile.sex === 'female' ? 'Female' : 'Male' },
              ].map(s => (
                <div key={s.label} className="flex justify-between py-2 border-b border-stone-50 last:border-0">
                  <span className="text-sm text-stone-500">{s.label}</span>
                  <span className="text-sm font-medium text-stone-700">{s.value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeSection === 'notif' && (
          <div className="flex flex-col gap-4">
            {/* Master toggle */}
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-stone-800">All notifications</p>
                  <p className="text-xs text-stone-400 mt-0.5">Master on/off switch</p>
                </div>
                <Toggle
                  value={notifSettings.master_on}
                  onChange={v => {
                    setNotif('master_on', v)
                    if (v && Notification?.permission === 'default') {
                      Notification.requestPermission()
                    }
                  }}
                />
              </div>
            </div>

            {/* Meal reminders */}
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Meal reminders</p>
              <div className="flex flex-col gap-4">
                {[
                  { key: 'breakfast', label: '🌅 Breakfast', timeKey: 'breakfast_time', defaultTime: '08:00' },
                  { key: 'lunch', label: '☀️ Lunch', timeKey: 'lunch_time', defaultTime: '13:00' },
                  { key: 'snack', label: '🍎 Snack', timeKey: 'snack_time', defaultTime: '16:00' },
                  { key: 'dinner', label: '🌙 Dinner', timeKey: 'dinner_time', defaultTime: '19:30' },
                ].map(m => (
                  <div key={m.key}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-stone-700">{m.label}</span>
                      <Toggle
                        value={notifSettings[m.key + '_on']}
                        onChange={v => setNotif(m.key + '_on', v)}
                      />
                    </div>
                    <TimePicker
                      label="Time"
                      value={notifSettings[m.timeKey] || m.defaultTime}
                      onChange={v => setNotif(m.timeKey, v)}
                      enabled={notifSettings[m.key + '_on'] && notifSettings.master_on}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Other reminders */}
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Other reminders</p>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-stone-700">💧 Water reminders</p>
                    <p className="text-xs text-stone-400">Every 2h if behind on goal</p>
                  </div>
                  <Toggle value={notifSettings.water_on} onChange={v => setNotif('water_on', v)} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-sm font-medium text-stone-700">🌙 Bedtime reminder</p>
                    </div>
                    <Toggle value={notifSettings.bedtime_on} onChange={v => setNotif('bedtime_on', v)} />
                  </div>
                  <TimePicker
                    label="Time"
                    value={notifSettings.bedtime_time || '22:30'}
                    onChange={v => setNotif('bedtime_time', v)}
                    enabled={notifSettings.bedtime_on && notifSettings.master_on}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-stone-700">🏃 Activity nudge</p>
                      <p className="text-xs text-stone-400">Remind if no activity logged yet</p>
                    </div>
                    <Toggle value={notifSettings.activity_nudge_on} onChange={v => setNotif('activity_nudge_on', v)} />
                  </div>
                  {notifSettings.activity_nudge_on && notifSettings.master_on && (
                    <div className="flex flex-col gap-1.5 pl-1">
                      {(notifSettings.activity_nudge_times || ['18:00']).map((t, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="time"
                            value={t}
                            onChange={e => {
                              const times = [...(notifSettings.activity_nudge_times || ['18:00'])]
                              times[i] = e.target.value
                              setNotif('activity_nudge_times', times)
                            }}
                            className="border border-stone-200 rounded-lg px-2 py-1 text-sm text-stone-700 bg-white"
                          />
                          {(notifSettings.activity_nudge_times || ['18:00']).length > 1 && (
                            <button
                              onClick={() => {
                                const times = (notifSettings.activity_nudge_times || ['18:00']).filter((_, j) => j !== i)
                                setNotif('activity_nudge_times', times)
                              }}
                              className="text-stone-300 hover:text-red-400 text-lg leading-none"
                            >×</button>
                          )}
                        </div>
                      ))}
                      {(notifSettings.activity_nudge_times || ['18:00']).length < 4 && (
                        <button
                          onClick={() => {
                            const times = [...(notifSettings.activity_nudge_times || ['18:00']), '20:00']
                            setNotif('activity_nudge_times', times)
                          }}
                          className="text-xs text-green-primary font-medium self-start mt-0.5"
                        >+ Add time</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-400 text-center pb-4">
              Notifications check your actual logged data — no reminders when goals are already met.
            </p>
          </div>
        )}

        <div className="h-6" />

        <div className="mx-4 mb-6 flex flex-col gap-2">
          <button
            onClick={signOut}
            className="w-full py-3 rounded-xl text-sm font-medium border border-stone-200 text-stone-400"
          >
            Sign out
          </button>
          <button
            onClick={async () => {
              // Delete profile from Supabase so onboarding runs again on next sign-in
              const { data: { user } } = await supabase.auth.getUser()
              if (user) {
                await supabase.from('profiles').delete().eq('user_id', user.id)
              }
              await signOut()
              localStorage.clear()
              sessionStorage.clear()
              window.location.reload()
            }}
            className="w-full py-2.5 rounded-xl text-xs font-medium text-stone-300 border border-dashed border-stone-200"
          >
            Reset app (re-run onboarding)
          </button>
        </div>
      </div>
    </div>
  )
}
