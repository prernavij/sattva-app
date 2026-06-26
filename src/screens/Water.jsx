import { useState } from 'react'
import { useApp } from '../context/AppContext'
import ProgressBar from '../components/ProgressBar'

const ML_PER_CUP = 250

function CelebrationOverlay({ onClose }) {
  return (
    <div className="absolute inset-0 bg-water/10 z-30 flex items-center justify-center" onClick={onClose}>
      <div className="pop-in text-center bg-white rounded-3xl p-8 mx-6 shadow-xl">
        <div className="text-5xl mb-3">💧🎉</div>
        <h2 className="font-serif text-2xl text-water mb-1">Hydration goal hit!</h2>
        <p className="text-stone-500 text-sm">Excellent work. Your body thanks you.</p>
      </div>
    </div>
  )
}

function CupGrid({ filled, total, onFill, onUnfill }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: total }, (_, i) => {
        const isFilled = i < filled
        return (
          <button
            key={i}
            onClick={() => isFilled ? onUnfill(i) : onFill(i)}
            className="aspect-square rounded-xl flex flex-col items-center justify-center transition-all active:scale-95"
            style={{
              background: isFilled ? '#EBF4FC' : '#E4E7DF',
              border: `2px solid ${isFilled ? '#3D5240' : '#E5E7EB'}`,
            }}
          >
            <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
              {/* Cup outline */}
              <path d="M4 4h28l-4 36H8L4 4z" stroke={isFilled ? '#3D5240' : '#CBD5E1'} strokeWidth="2" fill="none" strokeLinejoin="round" />
              {/* Fill */}
              {isFilled && (
                <clipPath id={`clip-${i}`}>
                  <rect x="5" y="5" width="26" height="34" />
                </clipPath>
              )}
              {isFilled && (
                <path d="M5 18h26L27 40H9L5 18z" fill="#3D5240" opacity="0.7" />
              )}
              {/* Handle */}
              <path d="M30 12 Q38 12 38 20 Q38 28 30 28" stroke={isFilled ? '#3D5240' : '#CBD5E1'} strokeWidth="2" fill="none" />
            </svg>
            <span className="text-[10px] font-medium mt-0.5" style={{ color: isFilled ? '#3D5240' : '#94A3B8' }}>
              250ml
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default function Water() {
  const { goals, waterLogs, addWaterLog, removeWaterLog, todayWater_ml, todayWater_l, todayWater_cups } = useApp()
  const [viewMode, setViewMode] = useState('cups') // 'cups' | 'ml'
  const [customInput, setCustomInput] = useState('')
  const [cupSize, setCupSize] = useState(250) // ml per cup tap
  const [showCelebration, setShowCelebration] = useState(false)

  const goalMl = goals.water_goal_l * 1000
  const goalCups = goals.water_goal_cups
  const filledCups = Math.floor(todayWater_ml / ML_PER_CUP)
  const displayCups = Math.ceil(goalCups)

  const pct = Math.min((todayWater_ml / goalMl) * 100, 100)

  const addWater = (ml) => {
    const wasBelow = todayWater_ml < goalMl
    addWaterLog({ amount_ml: ml, source_unit: 'ml' })
    if (wasBelow && todayWater_ml + ml >= goalMl) {
      setTimeout(() => setShowCelebration(true), 300)
    }
  }

  const handleCupFill = (idx) => {
    addWater(cupSize)
  }

  const handleCupUnfill = (idx) => {
    // Remove the last water log
    if (waterLogs.length > 0) {
      removeWaterLog(waterLogs[waterLogs.length - 1].id)
    }
  }

  const handleCustom = () => {
    const val = parseCustom(customInput)
    if (val > 0) {
      addWater(val)
      setCustomInput('')
    }
  }

  const parseCustom = (s) => {
    const lower = s.toLowerCase().trim()
    if (lower.endsWith('l') && !lower.endsWith('ml')) return parseFloat(lower) * 1000
    if (lower.endsWith('cups') || lower.endsWith('cup')) return parseFloat(lower) * ML_PER_CUP
    const ml = parseFloat(lower)
    return isNaN(ml) ? 0 : ml
  }

  const previewCustom = () => {
    const ml = parseCustom(customInput)
    if (!ml || ml <= 0) return ''
    const l = (ml / 1000).toFixed(2)
    const cups = (ml / ML_PER_CUP).toFixed(1)
    return `${ml} ml = ${l} L = ${cups} cups`
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative">
      {showCelebration && <CelebrationOverlay onClose={() => setShowCelebration(false)} />}

      {/* Header */}
      <div className="bg-water px-4 pt-12 pb-5 text-white shrink-0">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-blue-100 text-xs">Today's water</p>
            <p className="text-3xl font-bold">
              {todayWater_l.toFixed(2)} <span className="text-lg font-normal opacity-80">L</span>
            </p>
            <p className="text-blue-100 text-sm">{todayWater_cups.toFixed(1)} cups</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-xs">Goal</p>
            <p className="text-xl font-semibold">{goals.water_goal_l}L</p>
            <p className="text-blue-100 text-xs">{goalCups} cups</p>
          </div>
        </div>
        <ProgressBar value={todayWater_ml} max={goalMl} color="rgba(255,255,255,0.8)" height={8} className="bg-white/20" />
        <p className="text-blue-100 text-xs mt-1.5 text-right">{Math.round(pct)}% of goal</p>
      </div>

      {/* View toggle */}
      <div className="flex bg-stone-100 mx-4 mt-4 rounded-xl p-1">
        {[['cups', '☕ Cups'], ['ml', '📊 ml / L']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setViewMode(id)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: viewMode === id ? '#fff' : 'transparent',
              color: viewMode === id ? '#3D5240' : '#9CA3AF',
              boxShadow: viewMode === id ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollable px-4 py-4">
        {viewMode === 'cups' ? (
          <>
            {/* Cup size selector */}
            <div className="flex gap-2 mb-4">
              {[150, 250, 350].map(ml => (
                <button
                  key={ml}
                  onClick={() => setCupSize(ml)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all"
                  style={{
                    borderColor: cupSize === ml ? '#3D5240' : '#E5E7EB',
                    background: cupSize === ml ? '#EBF4FC' : '#fff',
                    color: cupSize === ml ? '#3D5240' : '#9CA3AF',
                  }}
                >
                  {ml === 150 ? 'Small' : ml === 250 ? 'Standard' : 'Large'}<br />
                  <span className="font-normal">{ml}ml</span>
                </button>
              ))}
            </div>

            <CupGrid
              filled={filledCups}
              total={displayCups}
              onFill={handleCupFill}
              onUnfill={handleCupUnfill}
            />
          </>
        ) : (
          <>
            {/* Quick-add tiles */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[200, 250, 500, 1000].map(ml => (
                <button
                  key={ml}
                  onClick={() => addWater(ml)}
                  className="flex flex-col items-center justify-center bg-white rounded-xl py-3 shadow-card active:scale-95 transition-transform"
                >
                  <span className="text-xl">💧</span>
                  <span className="text-sm font-bold text-water mt-1">{ml >= 1000 ? '1L' : `${ml}ml`}</span>
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className="bg-white rounded-xl p-4 shadow-card mb-4">
              <p className="text-xs font-medium text-stone-500 mb-2">Custom amount</p>
              <div className="flex gap-2">
                <input
                  className="flex-1 border border-stone-200 rounded-xl px-3 py-2.5 text-base focus:border-water"
                  placeholder="e.g. 330ml, 0.5L, 2 cups"
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCustom()}
                />
                <button
                  onClick={handleCustom}
                  className="px-4 py-2.5 bg-water text-white rounded-xl font-medium text-sm"
                >
                  Add
                </button>
              </div>
              {customInput && previewCustom() && (
                <p className="text-xs text-water mt-1.5">{previewCustom()}</p>
              )}
            </div>
          </>
        )}

        {/* Today's log */}
        {waterLogs.length > 0 && (
          <div className="mt-2">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Today's log</h3>
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              {[...waterLogs].reverse().map(log => (
                <div key={log.id} className="flex items-center px-4 py-3 border-b border-stone-50 last:border-0">
                  <span className="text-sm flex-1 text-stone-700">
                    {log.amount_ml}ml · {(log.amount_ml / ML_PER_CUP).toFixed(1)} cups
                  </span>
                  <span className="text-xs text-stone-400 mr-3">
                    {new Date(log.logged_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button onClick={() => removeWaterLog(log.id)} className="text-stone-300 hover:text-red-400 text-lg leading-none">×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-6" />
      </div>
    </div>
  )
}
