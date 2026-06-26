import { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { parseFood, QUICK_PICKS, guessMeal, FOODS } from '../data/foods'
import ProgressBar from '../components/ProgressBar'

const MEALS = ['breakfast', 'lunch', 'snack', 'dinner']
const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Snack', dinner: 'Dinner' }
const MEAL_ICONS = { breakfast: '🌅', lunch: '☀️', snack: '🍎', dinner: '🌙' }

function MacroStrip({ kcal, protein, calGoal, proteinGoal }) {
  const kcalLeft = Math.max(0, calGoal - kcal)
  const protLeft = Math.max(0, proteinGoal - protein)
  return (
    <div className="bg-white border-b border-stone-100 px-4 py-3">
      <div className="grid grid-cols-4 gap-0 text-center">
        {[
          { label: 'Eaten', value: kcal, unit: 'kcal', color: '#3D5240' },
          { label: 'Protein', value: `${Math.round(protein)}g`, unit: '', color: '#3D5240' },
          { label: 'Remaining', value: kcalLeft, unit: 'kcal', color: '#3D5240' },
          { label: 'Prot left', value: `${Math.round(protLeft)}g`, unit: '', color: '#3D5240' },
        ].map((m, i) => (
          <div key={i} className="flex flex-col items-center border-r border-stone-100 last:border-0 px-1">
            <span className="text-base font-bold" style={{ color: m.color }}>{m.value}</span>
            {m.unit && <span className="text-[10px] text-stone-400">{m.unit}</span>}
            <span className="text-[10px] text-stone-400 mt-0.5">{m.label}</span>
          </div>
        ))}
      </div>
      <ProgressBar value={kcal} max={calGoal} color="#3D5240" height={4} className="mt-2" />
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
      system: `You are a nutrition estimator. Given a food description, return ONLY a JSON object with these fields:
{"name": "clean food name", "kcal": <number>, "protein": <number>, "note": "brief serving note"}
Estimate for a typical single serving. Be practical and accurate. No explanation, just JSON.`,
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
  const [meal, setMeal] = useState(guessMeal())
  const [parsed, setParsed] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [mode, setMode] = useState(null) // 'ai' | 'manual'
  const [customName, setCustomName] = useState('')
  const [customKcal, setCustomKcal] = useState('')
  const [customProtein, setCustomProtein] = useState('')
  const [aiNote, setAiNote] = useState('')

  const handleParse = async () => {
    if (!input.trim()) return
    const result = parseFood(input)
    if (result) {
      setParsed(result)
      setMode(null)
      return
    }

    // Not in database — try AI first, fall back to manual
    setParsed(null)
    setAiLoading(true)
    setMode(null)
    try {
      const ai = await aiEstimateNutrition(input)
      if (ai) {
        setCustomName(ai.name || input.trim())
        setCustomKcal(String(Math.round(ai.kcal)))
        setCustomProtein(String(Math.round(ai.protein * 10) / 10))
        setAiNote(ai.note || '')
        setMode('ai')
      } else {
        setCustomName(input.trim())
        setCustomKcal('')
        setCustomProtein('')
        setMode('manual')
      }
    } catch {
      setCustomName(input.trim())
      setCustomKcal('')
      setCustomProtein('')
      setMode('manual')
    }
    setAiLoading(false)
  }

  const handleQuickPick = (qp) => {
    setInput(qp)
    const result = parseFood(qp)
    if (result) { setParsed(result); setMode(null) }
  }

  const handleConfirm = () => {
    if (mode === 'ai' || mode === 'manual') {
      const kcal = parseInt(customKcal) || 0
      const protein = parseFloat(customProtein) || 0
      if (!customName.trim() || kcal === 0) return
      onLog({ food_name: customName.trim(), meal_type: meal, kcal, protein_g: protein })
    } else {
      if (!parsed) return
      onLog({ food_name: parsed.description, meal_type: meal, kcal: parsed.kcal, protein_g: parsed.protein })
    }
    onClose()
  }

  const canConfirm = mode ? (customName.trim() && parseInt(customKcal) > 0) : !!parsed

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl px-5 py-6 bottom-sheet max-h-[85vh] overflow-y-auto">
        <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mb-5" />
        <h3 className="font-serif text-xl text-green-primary mb-4">Log food</h3>

        {/* Natural language input */}
        <div className="flex gap-2 mb-3">
          <input
            className="flex-1 border border-stone-200 rounded-xl px-4 py-3 text-base focus:border-green-primary"
            placeholder="puffed rice, avocado toast, 2 idlis…"
            value={input}
            onChange={e => { setInput(e.target.value); setParsed(null); setMode(null) }}
            onKeyDown={e => e.key === 'Enter' && handleParse()}
            autoFocus
          />
          <button
            onClick={handleParse}
            disabled={aiLoading}
            className="px-4 py-3 bg-green-primary text-white rounded-xl font-medium text-sm disabled:opacity-60"
          >
            {aiLoading ? '…' : 'Parse'}
          </button>
        </div>

        {/* Quick picks */}
        {!mode && !parsed && !aiLoading && (
          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_PICKS.map(qp => (
              <button
                key={qp}
                onClick={() => handleQuickPick(qp)}
                className="px-3 py-1.5 bg-green-light text-green-primary rounded-pill text-xs font-medium"
              >
                {qp}
              </button>
            ))}
          </div>
        )}

        {/* AI thinking state */}
        {aiLoading && (
          <div className="mb-4 rounded-xl bg-green-light px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-green-primary rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <p className="text-xs text-green-primary font-medium">Estimating nutrition with AI…</p>
          </div>
        )}

        {/* Parsed result from database */}
        {parsed && !mode && (
          <div className="bg-green-light rounded-xl p-4 mb-4">
            <p className="font-semibold text-green-primary mb-1">{parsed.description}</p>
            <div className="flex gap-4">
              <span className="text-sm text-stone-600">{parsed.kcal} kcal</span>
              <span className="text-sm text-stone-600">{parsed.protein}g protein</span>
            </div>
          </div>
        )}

        {/* AI or manual entry */}
        {mode && (
          <div className="mb-4 rounded-xl border border-stone-200 p-4">
            {mode === 'ai' ? (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-green-primary bg-green-light px-2 py-0.5 rounded-pill">AI estimated</span>
                {aiNote && <span className="text-xs text-stone-400">{aiNote}</span>}
              </div>
            ) : (
              <p className="text-xs text-stone-400 mb-3">Enter the details manually</p>
            )}
            <div className="mb-3">
              <label className="text-xs font-medium text-stone-500 block mb-1">Food name</label>
              <input
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:border-green-primary"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder="What did you eat?"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-500 block mb-1">Calories (kcal)</label>
                <input
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:border-green-primary"
                  type="number"
                  inputMode="numeric"
                  value={customKcal}
                  onChange={e => setCustomKcal(e.target.value)}
                  placeholder="e.g. 350"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 block mb-1">Protein (g)</label>
                <input
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:border-green-primary"
                  type="number"
                  inputMode="decimal"
                  value={customProtein}
                  onChange={e => setCustomProtein(e.target.value)}
                  placeholder="e.g. 12"
                />
              </div>
            </div>
            {mode === 'ai' && (
              <button
                onClick={() => { setCustomKcal(''); setCustomProtein(''); setMode('manual') }}
                className="mt-2 text-xs text-stone-400 underline"
              >
                Edit manually instead
              </button>
            )}
          </div>
        )}

        {/* Meal selector */}
        <div className="mb-5">
          <p className="text-xs font-medium text-stone-500 mb-2">Meal</p>
          <div className="flex gap-2">
            {MEALS.map(m => (
              <button
                key={m}
                onClick={() => setMeal(m)}
                className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: meal === m ? '#3D5240' : '#E4E7DF',
                  color: meal === m ? '#fff' : '#666',
                }}
              >
                {MEAL_ICONS[m]} {MEAL_LABELS[m]}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          className="w-full py-3.5 rounded-xl font-semibold text-white transition-all"
          style={{ background: canConfirm ? '#3D5240' : '#BDC9B6' }}
        >
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
