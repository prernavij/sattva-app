import { useState } from 'react'
import DiyaLogo from '../components/DiyaLogo'
import { useApp, calcGoals } from '../context/AppContext'

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { id: 'light', label: 'Light', desc: '1–3 days/week' },
  { id: 'moderate', label: 'Moderate', desc: '3–5 days/week' },
  { id: 'active', label: 'Active', desc: '6–7 days/week' },
  { id: 'very_active', label: 'Very Active', desc: 'Physical job + exercise' },
]

const GOAL_OPTIONS = [
  { id: 'lose_fat',          label: 'Lose fat',           icon: '📉', computable: true,  desc: 'Calorie deficit, preserve muscle' },
  { id: 'build_strength',    label: 'Build strength',     icon: '💪', computable: true,  desc: 'Higher protein & workout target' },
  { id: 'improve_endurance', label: 'Improve endurance',  icon: '🏃', computable: true,  desc: 'More cardio-focused sessions' },
  { id: 'maintain_weight',   label: 'Maintain weight',    icon: '⚖️', computable: true,  desc: 'Eat at TDEE' },
  { id: 'better_sleep',      label: 'Better sleep',       icon: '😴', computable: true,  desc: 'Raises sleep target to 9h' },
  { id: 'manage_stress',     label: 'Manage stress',      icon: '🧘', computable: false, desc: 'Mindfulness & recovery focus' },
  { id: 'eat_healthier',     label: 'Eat healthier',      icon: '🥗', computable: false, desc: 'Food quality & habit awareness' },
]

const TRACK_OPTIONS = [
  { id: 'calories', label: 'Calories', color: '#3D5240' },
  { id: 'protein', label: 'Protein', color: '#3D5240' },
  { id: 'water', label: 'Water', color: '#3D5240' },
  { id: 'sleep', label: 'Sleep', color: '#3D5240' },
  { id: 'workouts', label: 'Workouts', color: '#3D5240' },
  { id: 'weight', label: 'Weight', color: '#3D5240' },
]

export default function Onboarding() {
  const { completeOnboarding } = useApp()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '', age: '', sex: 'female',
    height_ft: '', height_in: '', weight_lbs: '',
    target_weight_lbs: '',
    activity_level: 'moderate',
    goals: ['maintain_weight'],
    goal_notes: '',
    track: { calories: true, protein: true, water: true, sleep: true, workouts: true, weight: false },
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const heightCm = () => {
    const ft = parseFloat(form.height_ft) || 0
    const inches = parseFloat(form.height_in) || 0
    return Math.round((ft * 12 + inches) * 2.54)
  }

  const profile = {
    name: form.name || 'Friend',
    age: parseInt(form.age) || 28,
    sex: form.sex,
    height_cm: heightCm() || 165,
    weight_lbs: parseFloat(form.weight_lbs) || 140,
    target_weight_lbs: parseFloat(form.target_weight_lbs) || null,
    activity_level: form.activity_level,
    goals: form.goals,
    goal_notes: form.goal_notes,
    track: form.track,
  }

  const toggleGoal = (id) => {
    setForm(f => {
      const has = f.goals.includes(id)
      // mutually exclusive: maintain_weight vs lose_fat/build_strength
      let next = has ? f.goals.filter(g => g !== id) : [...f.goals, id]
      if (!has && id === 'maintain_weight') next = ['maintain_weight']
      if (!has && id !== 'maintain_weight') next = next.filter(g => g !== 'maintain_weight')
      return { ...f, goals: next }
    })
  }

  const hasComputableGoal = form.goals.some(g => GOAL_OPTIONS.find(o => o.id === g)?.computable)
  const showNotesWarning = form.goal_notes.trim().length > 0 && !hasComputableGoal
  const goals = calcGoals(profile)

  const canNext = () => {
    if (step === 1) return form.name && form.age && form.weight_lbs
    if (step === 2) return form.goals.length > 0 && !showNotesWarning
    return true
  }

  const next = () => {
    if (step < 4) setStep(s => s + 1)
    else completeOnboarding(profile)
  }

  const prev = () => setStep(s => Math.max(0, s - 1))

  return (
    <div className="flex flex-col min-h-dvh screen-enter">
      {/* Progress dots */}
      {step > 0 && (
        <div className="flex justify-center gap-2 pt-6 pb-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-2 h-2 rounded-full transition-all"
              style={{ background: i <= step ? '#3D5240' : '#E5E7EB' }} />
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col px-6 py-4 overflow-y-auto">

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 text-center gap-6">
            <DiyaLogo size={96} />
            <div>
              <h1 className="font-serif text-4xl text-green-primary leading-tight mb-2">Sattva</h1>
              <p className="text-stone-500 text-lg leading-relaxed">Your mindful wellness companion.<br/>Track. Reflect. Thrive.</p>
            </div>
            <div className="flex flex-col gap-3 text-stone-500 text-sm">
              {['Personalised calorie & macro goals', 'Holistic daily insights', 'Smart hydration & sleep tracking', 'Mindful activity & weight tracking'].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-light flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-primary" />
                  </div>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: About you */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-serif text-2xl text-green-primary mb-1">About you</h2>
              <p className="text-stone-500 text-sm">We use this to calculate your personalised targets.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-600 block mb-1.5">Your name</label>
              <input
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base bg-white focus:border-green-primary transition-colors"
                placeholder="What should we call you?"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-stone-600 block mb-1.5">Age</label>
                <input
                  type="number"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base focus:border-green-primary transition-colors"
                  placeholder="years"
                  value={form.age}
                  onChange={e => set('age', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-600 block mb-1.5">Biological sex</label>
                <select
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base bg-white focus:border-green-primary"
                  value={form.sex}
                  onChange={e => set('sex', e.target.value)}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-600 block mb-1.5">Height</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base focus:border-green-primary"
                  placeholder="ft"
                  value={form.height_ft}
                  onChange={e => set('height_ft', e.target.value)}
                />
                <input
                  type="number"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base focus:border-green-primary"
                  placeholder="in"
                  value={form.height_in}
                  onChange={e => set('height_in', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-600 block mb-1.5">Weight (lbs)</label>
              <input
                type="number"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base focus:border-green-primary"
                placeholder="lbs"
                value={form.weight_lbs}
                onChange={e => set('weight_lbs', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-stone-600 block mb-2">Activity level</label>
              <div className="flex flex-col gap-2">
                {ACTIVITY_LEVELS.map(a => (
                  <button
                    key={a.id}
                    onClick={() => set('activity_level', a.id)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left"
                    style={{
                      borderColor: form.activity_level === a.id ? '#3D5240' : '#E5E7EB',
                      background: form.activity_level === a.id ? '#E2EAE0' : '#fff',
                    }}
                  >
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{ borderColor: form.activity_level === a.id ? '#3D5240' : '#ccc' }}>
                      {form.activity_level === a.id && <div className="w-2 h-2 rounded-full bg-green-primary" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-stone-800">{a.label}</div>
                      <div className="text-xs text-stone-500">{a.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-serif text-2xl text-green-primary mb-1">Your goals</h2>
              <p className="text-stone-500 text-sm">Choose as many as you like. We'll set your targets accordingly.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {GOAL_OPTIONS.map(g => {
                const on = form.goals.includes(g.id)
                return (
                  <button
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    className="flex flex-col items-start gap-1.5 px-4 py-3.5 rounded-2xl border-2 transition-all text-left"
                    style={{
                      borderColor: on ? '#3D5240' : '#E5E7EB',
                      background: on ? '#E2EAE0' : '#fff',
                    }}
                  >
                    <span className="text-2xl">{g.icon}</span>
                    <div className="font-semibold text-stone-800 text-sm leading-tight">{g.label}</div>
                    <div className="text-xs text-stone-400 leading-tight">{g.desc}</div>
                    {!g.computable && <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-full">tracked only</span>}
                  </button>
                )
              })}
            </div>

            <div>
              <label className="text-sm font-medium text-stone-600 block mb-1.5">
                Anything else? <span className="text-stone-400 font-normal">— optional</span>
              </label>
              <input
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm bg-white focus:border-green-primary transition-colors"
                placeholder="e.g. train for a half marathon, improve posture…"
                value={form.goal_notes}
                onChange={e => set('goal_notes', e.target.value)}
              />
              {showNotesWarning && (
                <p className="text-xs text-amber-600 mt-1.5">
                  We can't compute targets from this alone — please also pick at least one goal above.
                </p>
              )}
            </div>

            {(form.goals.includes('lose_fat') || form.goals.includes('build_strength')) && (
              <div>
                <label className="text-sm font-medium text-stone-600 block mb-1.5">
                  Target weight (lbs) <span className="text-stone-400 font-normal">— optional</span>
                </label>
                <input
                  type="number"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base focus:border-green-primary transition-colors"
                  placeholder={form.goals.includes('build_strength') && !form.goals.includes('lose_fat') ? 'e.g. 160' : 'e.g. 130'}
                  value={form.target_weight_lbs}
                  onChange={e => set('target_weight_lbs', e.target.value)}
                />
                {form.target_weight_lbs && parseFloat(form.target_weight_lbs) > 0 && (
                  <p className="text-xs text-green-primary mt-1.5">
                    {goals.weeks_to_goal
                      ? `~${goals.weeks_to_goal} weeks to reach ${form.target_weight_lbs} lbs`
                      : 'Set your current weight on the previous step to see estimate'}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: What to track */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-serif text-2xl text-green-primary mb-1">What to track</h2>
              <p className="text-stone-500 text-sm">You can change this anytime in Profile.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {TRACK_OPTIONS.map(t => {
                const on = form.track[t.id]
                return (
                  <button
                    key={t.id}
                    onClick={() => set('track', { ...form.track, [t.id]: !on })}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: on ? t.color : '#E5E7EB',
                      background: on ? t.color + '18' : '#fff',
                    }}
                  >
                    <div className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0"
                      style={{ borderColor: on ? t.color : '#ccc', background: on ? t.color : '#fff' }}>
                      {on && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>}
                    </div>
                    <span className="text-sm font-medium text-stone-700">{t.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 4: Goals preview */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-serif text-2xl text-green-primary mb-1">Your targets</h2>
              <p className="text-stone-500 text-sm">Calculated from your profile using Mifflin-St Jeor formula.</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-1">
              {form.goals.map(gid => {
                const opt = GOAL_OPTIONS.find(o => o.id === gid)
                return opt ? <span key={gid} className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: '#E2EAE0', color: '#3D5240' }}>{opt.icon} {opt.label}</span> : null
              })}
              {form.goal_notes.trim() && <span className="text-xs px-3 py-1 rounded-full bg-stone-100 text-stone-600 font-medium">✏️ {form.goal_notes}</span>}
            </div>

            <div className="bg-green-light rounded-2xl p-4 flex flex-col gap-3">
              {[
                { label: 'Daily Calories', value: `${goals.cal_goal} kcal`, sub: goals.cal_offset === 0 ? 'at TDEE' : goals.cal_offset > 0 ? `TDEE + ${goals.cal_offset} kcal` : `TDEE – ${Math.abs(goals.cal_offset)} kcal` },
                { label: 'Protein', value: `${goals.protein_goal}g`, sub: `${goals.protein_multiplier}g per kg bodyweight` },
                { label: 'Water', value: `${goals.water_goal_l}L`, sub: `≈ ${goals.water_goal_cups} cups (250ml each)` },
                { label: 'Sleep', value: `${goals.sleep_goal_h}h`, sub: 'Recommended for recovery' },
                { label: 'Workouts', value: `${goals.workout_goal_week}×/week`, sub: 'Flexible around your schedule' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-0.5 border-b border-green-mid/30 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-stone-700">{item.label}</div>
                    <div className="text-xs text-stone-500">{item.sub}</div>
                  </div>
                  <div className="text-lg font-semibold text-green-primary">{item.value}</div>
                </div>
              ))}
            </div>

            {goals.target_weight_lbs && (form.goals.includes('lose_fat') || form.goals.includes('build_strength')) && (
              <div className="bg-white border border-green-mid rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-stone-700">Weight goal</span>
                  <span className="text-sm font-semibold text-green-primary">
                    {profile.weight_lbs} → {goals.target_weight_lbs} lbs
                  </span>
                </div>
                {goals.weeks_to_goal && (
                  <>
                    <div className="h-2 rounded-full bg-green-mid/40 overflow-hidden mb-1.5">
                      <div className="h-full rounded-full bg-green-primary" style={{ width: '4%' }} />
                    </div>
                    <p className="text-xs text-stone-500">
                      Estimated <span className="font-semibold text-green-primary">{goals.weeks_to_goal} weeks</span> at current pace
                    </p>
                  </>
                )}
              </div>
            )}

            <p className="text-xs text-stone-400 text-center leading-relaxed">
              These are starting targets. The app learns from your patterns over time.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8 flex gap-3">
        {step > 0 && (
          <button
            onClick={prev}
            className="flex-1 py-3.5 rounded-xl border border-stone-200 text-stone-600 font-medium text-base"
          >
            Back
          </button>
        )}
        <button
          onClick={next}
          disabled={!canNext()}
          className="flex-1 py-3.5 rounded-xl font-semibold text-base text-white transition-all"
          style={{ background: canNext() ? '#3D5240' : '#BDC9B6' }}
        >
          {step === 0 ? 'Get started' : step === 4 ? "Let's go 🪔" : 'Continue'}
        </button>
      </div>
    </div>
  )
}
