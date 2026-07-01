import { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { parseFood, QUICK_PICKS, guessMeal, FOODS } from '../data/foods'
import ProgressBar from '../components/ProgressBar'

const MEALS = ['breakfast', 'lunch', 'snack', 'dinner']
const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Snack', dinner: 'Dinner' }
const MEAL_ICONS = { breakfast: '🌅', lunch: '☀️', snack: '🍎', dinner: '🌙' }

// Returns status info based on value vs goal and time of day
function getDailyStatus(value, goal, type = 'default') {
  const hour = new Date().getHours()
  const pct = goal > 0 ? value / goal : 0
  // Expected eating fraction: 7am–9pm window
  const expectedFrac = Math.max(0, Math.min((hour - 7) / 14, 1))

  if (type === 'calories') {
    if (pct > 1.1)  return { status: 'over',     color: '#DC2626', bg: '#FEF2F2' }
    if (pct > 1.0)  return { status: 'at_limit',  color: '#D97706', bg: '#FFF7ED' }
    if (pct > 0.85) return { status: 'near',      color: '#D97706', bg: '#FFF7ED' }
    return            { status: 'ok',           color: '#3D5240', bg: null }
  }
  // protein / water — being behind late in day is a warning
  if (pct >= 0.95)                          return { status: 'done',        color: '#3D5240', bg: '#E2EAE0' }
  if (hour >= 19 && pct < 0.4)             return { status: 'critical_low', color: '#DC2626', bg: '#FEF2F2' }
  if (hour >= 17 && pct < 0.6)             return { status: 'behind_late',  color: '#D97706', bg: '#FFF7ED' }
  return                                     { status: 'ok',           color: '#3D5240', bg: null }
}

const CAL_ZONES = [
  { max: 0.25, label: 'Light day',     color: '#8A9688', bar: '#BDC9B6' },
  { max: 0.60, label: 'On track',      color: '#3D5240', bar: '#3D5240' },
  { max: 0.85, label: 'Nourished',     color: '#3D5240', bar: '#3D5240' },
  { max: 1.00, label: 'Getting full',  color: '#D97706', bar: '#D97706' },
  { max: 1.10, label: 'Right at goal', color: '#D97706', bar: '#D97706' },
  { max: Infinity, label: 'Over today',color: '#DC2626', bar: '#DC2626' },
]
function getZone(kcal, goal) {
  const pct = goal > 0 ? kcal / goal : 0
  return CAL_ZONES.find(z => pct <= z.max) || CAL_ZONES[CAL_ZONES.length - 1]
}

function getAlerts(kcal, protein, calGoal, proteinGoal) {
  const hour = new Date().getHours()
  const alerts = []
  const calPct = calGoal > 0 ? kcal / calGoal : 0
  const protPct = proteinGoal > 0 ? protein / proteinGoal : 0
  const protLeft = Math.round(proteinGoal - protein)

  if (calPct > 1.1) {
    alerts.push({ key: 'cal_over', color: '#B45309', bg: '#FFF7ED', msg: `You've had a full day of eating 🌿 keep it light from here` })
  } else if (calPct > 1.0) {
    alerts.push({ key: 'cal_limit', color: '#B45309', bg: '#FFF7ED', msg: 'Right at your goal — nice balance today' })
  } else if (calPct > 0.85 && hour < 15) {
    alerts.push({ key: 'cal_early', color: '#78716C', bg: '#F5F5F4', msg: 'Going at a good pace — save room for dinner' })
  }

  if (hour >= 19 && protPct < 0.4) {
    alerts.push({ key: 'prot_critical', color: '#78716C', bg: '#F5F5F4', msg: `Protein's a bit low today — eggs or curd before bed works great` })
  } else if (hour >= 17 && protPct < 0.6) {
    alerts.push({ key: 'prot_low', color: '#78716C', bg: '#F5F5F4', msg: `A little more protein would round out your day` })
  }

  return alerts
}

function MacroStrip({ kcal, protein, calGoal, proteinGoal }) {
  const zone    = getZone(kcal, calGoal)
  const protSt  = getDailyStatus(protein, proteinGoal, 'protein')
  const alerts  = getAlerts(kcal, protein, calGoal, proteinGoal)
  const calPct  = calGoal > 0 ? Math.min((kcal / calGoal) * 100, 100) : 0
  const protPct = proteinGoal > 0 ? Math.min((protein / proteinGoal) * 100, 100) : 0

  return (
    <div className="bg-white border-b border-stone-100 px-4 pt-3 pb-3">
      {/* Zone label row */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold" style={{ color: zone.color }}>{zone.label}</span>
        <span className="text-xs" style={{ color: '#8A9688' }}>{kcal} / {calGoal} kcal</span>
      </div>
      {/* Calorie bar */}
      <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: '#E4E7DF' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${calPct}%`, background: zone.bar }} />
      </div>
      {/* Protein row */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs" style={{ color: protSt.color }}>Protein</span>
        <span className="text-xs font-medium" style={{ color: protSt.color }}>
          {Math.round(protein)}g <span style={{ color: '#8A9688', fontWeight: 400 }}>/ {proteinGoal}g</span>
        </span>
      </div>
      <div className="h-1 rounded-full overflow-hidden mb-2" style={{ background: '#E4E7DF' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${protPct}%`, background: protSt.color }} />
      </div>
      {/* Gentle nudges */}
      {alerts.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollable mt-1">
          {alerts.map(a => (
            <div key={a.key} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: a.bg, color: a.color }}>
              {a.msg}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FoodEntry({ entry, onRemove }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-stone-50 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-stone-800">{entry.food_name}</p>
        <p className="text-xs text-stone-400">{entry.kcal} kcal · {entry.protein_g}g protein</p>
      </div>
      <button onClick={() => onRemove(entry.id)} className="text-stone-300 hover:text-red-400 text-lg leading-none px-1">×</button>
    </div>
  )
}

async function lookupCalorieNinjas(query) {
  const apiKey = import.meta.env.VITE_CALORIE_NINJAS_KEY
  if (!apiKey) return null
  const res = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`, {
    headers: { 'X-Api-Key': apiKey }
  })
  if (!res.ok) return null
  const data = await res.json()
  if (!data.items?.length) return null
  const items = data.items
  const totalKcal = Math.round(items.reduce((s, i) => s + i.calories, 0))
  const totalProtein = Math.round(items.reduce((s, i) => s + i.protein_g, 0) * 10) / 10
  const totalCarbs = Math.round(items.reduce((s, i) => s + i.carbohydrates_total_g, 0))
  const totalFat = Math.round(items.reduce((s, i) => s + i.fat_total_g, 0))
  const name = items.map(i => i.name).join(' + ')
  return { name, kcal: totalKcal, protein: totalProtein, carbs: totalCarbs, fat: totalFat, items }
}

async function aiEstimateNutrition(foodText) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) return null
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 120,
      system: `You are a nutrition estimator. Given a food description, return ONLY a JSON object:
{"name": "clean food name", "kcal": <number>, "protein": <number>, "carbs": <number>, "fat": <number>}
Be practical and accurate. No explanation, just JSON.`,
      messages: [{ role: 'user', content: foodText }]
    })
  })
  const data = await response.json()
  const text = data.content?.[0]?.text || ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return null
  return JSON.parse(match[0])
}

function FoodLogger({ onClose, onLog }) {
  const [input, setInput] = useState('')
  const [qty, setQty] = useState('1')
  const [meal, setMeal] = useState(guessMeal())
  const [result, setResult] = useState(null)   // { name, kcal, protein, carbs, fat, source }
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState(null)        // 'found' | 'manual'
  const [customName, setCustomName] = useState('')
  const [customKcal, setCustomKcal] = useState('')
  const [customProtein, setCustomProtein] = useState('')

  const reset = () => { setResult(null); setMode(null) }

  const handleLookup = async () => {
    if (!input.trim()) return
    const qtyNum = parseFloat(qty) || 1
    const query = input.trim()

    setLoading(true)
    setResult(null)
    setMode(null)
    try {
      // 1. Try local database first
      const local = parseFood(query, qtyNum)
      if (local) {
        setResult({ name: local.name, kcal: local.kcal, protein: local.protein, carbs: local.carbs, fat: local.fat, source: 'db' })
        setMode('found')
        setLoading(false)
        return
      }
      // 2. Try CalorieNinjas (if key set)
      const cnQuery = qtyNum !== 1 ? `${qtyNum} ${query}` : query
      const cn = await lookupCalorieNinjas(cnQuery)
      if (cn) {
        setResult({ ...cn, source: 'db' })
        setMode('found')
        setLoading(false)
        return
      }
      // 3. AI estimate
      const ai = await aiEstimateNutrition(qtyNum !== 1 ? `${qtyNum} ${query}` : query)
      if (ai) {
        setResult({ name: ai.name || query, kcal: Math.round(ai.kcal * qtyNum), protein: Math.round(ai.protein * qtyNum * 10) / 10, carbs: Math.round(ai.carbs * qtyNum) || 0, fat: Math.round(ai.fat * qtyNum) || 0, source: 'ai' })
        setMode('found')
        setLoading(false)
        return
      }
      // 4. Manual fallback
      setCustomName(query)
      setCustomKcal('')
      setCustomProtein('')
      setMode('manual')
    } catch {
      setCustomName(query)
      setCustomKcal('')
      setCustomProtein('')
      setMode('manual')
    }
    setLoading(false)
  }

  const handleQuickPick = (qp) => { setInput(qp); setQty('1'); reset() }

  const handleConfirm = () => {
    if (mode === 'found' && result) {
      onLog({ food_name: result.name, meal_type: meal, kcal: result.kcal, protein_g: result.protein })
    } else if (mode === 'manual') {
      const kcal = parseInt(customKcal) || 0
      const protein = parseFloat(customProtein) || 0
      if (!customName.trim() || kcal === 0) return
      onLog({ food_name: customName.trim(), meal_type: meal, kcal, protein_g: protein })
    }
    onClose()
  }

  const canConfirm = mode === 'found' ? !!result : (mode === 'manual' && customName.trim() && parseInt(customKcal) > 0)

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl px-5 py-6 bottom-sheet max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mb-5" />
        <h3 className="font-serif text-xl text-green-primary mb-4">Log food</h3>

        {/* Food input + quantity */}
        <div className="flex gap-2 mb-3">
          <input
            className="flex-1 border border-stone-200 rounded-xl px-4 py-3 text-base focus:border-green-primary"
            placeholder="boiled egg, toast with peanut butter…"
            value={input}
            onChange={e => { setInput(e.target.value); reset() }}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            autoFocus
          />
          <input
            type="number"
            inputMode="decimal"
            className="w-16 border border-stone-200 rounded-xl px-3 py-3 text-base text-center focus:border-green-primary"
            value={qty}
            onChange={e => { setQty(e.target.value); reset() }}
            placeholder="1"
            min="0.1"
            step="0.5"
          />
          <button
            onClick={handleLookup}
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-green-primary text-white rounded-xl font-medium text-sm disabled:opacity-50"
          >
            {loading ? '…' : 'Look up'}
          </button>
        </div>
        <p className="text-xs text-stone-400 mb-4">Enter food name + quantity (e.g. "boiled egg" · 1.5)</p>

        {/* Quick picks */}
        {!mode && !loading && (
          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_PICKS.map(qp => (
              <button key={qp} onClick={() => handleQuickPick(qp)}
                className="px-3 py-1.5 bg-green-light text-green-primary rounded-pill text-xs font-medium">
                {qp}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mb-4 rounded-xl bg-green-light px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-green-primary rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <p className="text-xs text-green-primary font-medium">Looking up nutrition…</p>
          </div>
        )}

        {/* Result — editable */}
        {mode === 'found' && result && (
          <div className="mb-4 rounded-xl p-4" style={{ background: '#F5F7F3', border: '1px solid #DDE4DA' }}>
            <div className="flex justify-between items-start mb-3">
              <input
                className="font-semibold text-stone-800 flex-1 pr-2 bg-transparent border-0 border-b border-stone-200 focus:outline-none focus:border-green-primary text-sm capitalize"
                value={result.name}
                onChange={e => setResult(r => ({ ...r, name: e.target.value }))}
              />
              {result.source === 'ai' && (
                <span className="text-[10px] font-medium text-green-primary bg-green-light px-2 py-0.5 rounded-pill shrink-0 ml-2">AI estimate</span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { key: 'kcal',    label: 'Calories', unit: 'kcal', step: 1 },
                { key: 'protein', label: 'Protein',  unit: 'g',    step: 0.5 },
                { key: 'carbs',   label: 'Carbs',    unit: 'g',    step: 1 },
                { key: 'fat',     label: 'Fat',      unit: 'g',    step: 0.5 },
              ].map(({ key, label, unit, step }) => (
                <div key={key} className="bg-white rounded-lg py-2 px-1">
                  <div className="flex items-baseline justify-center gap-0.5">
                    <input
                      type="number"
                      inputMode="decimal"
                      step={step}
                      min="0"
                      className="w-full text-sm font-bold text-stone-800 text-center bg-transparent border-0 focus:outline-none focus:border-b focus:border-green-primary"
                      value={result[key] ?? ''}
                      onChange={e => setResult(r => ({ ...r, [key]: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 }))}
                    />
                    <span className="text-[10px] text-stone-400 shrink-0">{unit}</span>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            <button onClick={reset} className="mt-2 text-xs text-stone-400 underline">Search again</button>
          </div>
        )}

        {/* Manual fallback */}
        {mode === 'manual' && (
          <div className="mb-4 rounded-xl border border-stone-200 p-4">
            <p className="text-xs text-stone-400 mb-3">Not found — enter details manually</p>
            <div className="mb-3">
              <label className="text-xs font-medium text-stone-500 block mb-1">Food name</label>
              <input className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:border-green-primary"
                value={customName} onChange={e => setCustomName(e.target.value)} placeholder="What did you eat?" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-500 block mb-1">Calories (kcal)</label>
                <input className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:border-green-primary"
                  type="number" inputMode="numeric" value={customKcal} onChange={e => setCustomKcal(e.target.value)} placeholder="e.g. 350" />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 block mb-1">Protein (g)</label>
                <input className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:border-green-primary"
                  type="number" inputMode="decimal" value={customProtein} onChange={e => setCustomProtein(e.target.value)} placeholder="e.g. 12" />
              </div>
            </div>
          </div>
        )}

        {/* Meal selector */}
        <div className="mb-5">
          <p className="text-xs font-medium text-stone-500 mb-2">Meal</p>
          <div className="flex gap-2">
            {MEALS.map(m => (
              <button key={m} onClick={() => setMeal(m)}
                className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                style={{ background: meal === m ? '#3D5240' : '#E4E7DF', color: meal === m ? '#fff' : '#666' }}>
                {MEAL_ICONS[m]} {MEAL_LABELS[m]}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleConfirm} disabled={!canConfirm}
          className="w-full py-3.5 rounded-xl font-semibold text-white transition-all"
          style={{ background: canConfirm ? '#3D5240' : '#BDC9B6' }}>
          Add to {MEAL_LABELS[meal]}
        </button>
      </div>
    </div>
  )
}

function ConsultTab() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-8 text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-green-light flex items-center justify-center text-3xl">
        ✨
      </div>
      <p className="font-serif text-xl font-bold text-green-primary">Coming Soon</p>
      <p className="text-sm text-stone-500 leading-relaxed">
        AI-powered food consultation — ask about menus, swap ideas, and get advice tailored to your daily goals.
      </p>
    </div>
  )
}

export default function Food() {
  const { foodLogs, addFoodLog, removeFoodLog, goals, todayKcal, todayProtein } = useApp()
  const [subTab, setSubTab] = useState('log')
  const [showLogger, setShowLogger] = useState(false)

  const logsByMeal = MEALS.reduce((acc, m) => {
    acc[m] = foodLogs.filter(f => f.meal_type === m)
    return acc
  }, {})

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Sub-tabs */}
      <div className="flex bg-white border-b border-stone-100 px-4 pt-12">
        {[['log', 'Log'], ['consult', 'Consult']].map(([id, label]) => (
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

      {subTab === 'log' ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          <MacroStrip kcal={todayKcal} protein={todayProtein} calGoal={goals.cal_goal} proteinGoal={goals.protein_goal} />

          <div className="flex-1 overflow-y-auto scrollable px-4 py-4">
            {MEALS.map(meal => (
              <div key={meal} className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-stone-600">
                    {MEAL_ICONS[meal]} {MEAL_LABELS[meal]}
                  </h3>
                  <span className="text-xs text-stone-400">
                    {logsByMeal[meal].reduce((s,f)=>s+f.kcal,0)} kcal
                  </span>
                </div>
                {logsByMeal[meal].length > 0 ? (
                  <div className="bg-white rounded-xl shadow-card px-4 py-1">
                    {logsByMeal[meal].map(entry => (
                      <FoodEntry key={entry.id} entry={entry} onRemove={removeFoodLog} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-stone-50 rounded-xl p-3 text-center">
                    <span className="text-xs text-stone-400">Nothing logged yet</span>
                  </div>
                )}
              </div>
            ))}
            <div className="h-4" />
          </div>

          {/* FAB */}
          <button
            onClick={() => setShowLogger(true)}
            className="absolute bottom-20 right-4 w-14 h-14 bg-green-primary rounded-full shadow-lg flex items-center justify-center text-white text-2xl active:scale-95 transition-transform z-30"
          >
            +
          </button>
        </div>
      ) : (
        <ConsultTab />
      )}

      {showLogger && (
        <FoodLogger
          onClose={() => setShowLogger(false)}
          onLog={addFoodLog}
        />
      )}
    </div>
  )
}
