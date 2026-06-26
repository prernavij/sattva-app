import { useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { generateInsight } from '../lib/insightEngine'
import DiyaLogo from '../components/DiyaLogo'
import ProgressBar from '../components/ProgressBar'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function MetricCard({ label, value, goal, unit, pct, color, onTap, icon }) {
  return (
    <button
      onClick={onTap}
      className="bg-white rounded-2xl p-4 shadow-card flex flex-col gap-2 text-left active:scale-95 transition-transform"
    >
      <div className="flex justify-between items-center">
        <span className="text-xs text-stone-500 font-medium uppercase tracking-wide">{label}</span>
        <span className="text-xs font-semibold rounded-pill px-2 py-0.5"
          style={{ background: color + '22', color }}>
          {Math.round(pct)}%
        </span>
      </div>
      <div className="text-base font-semibold text-stone-800 leading-tight">
        {value}<span className="text-xs font-normal text-stone-400 ml-1">/ {goal} {unit}</span>
      </div>
      <ProgressBar value={value} max={goal} color={color} height={5} />
    </button>
  )
}

function MiniBarChart({ data, goal }) {
  const max = Math.max(...data.map(d => d.val), goal, 1)
  const days = ['M','T','W','T','F','S','S']
  const today = (new Date().getDay() + 6) % 7 // 0=Mon

  return (
    <div className="flex items-end gap-1 h-14">
      {data.map((d, i) => {
        const pct = (d.val / max) * 100
        const goalPct = (goal / max) * 100
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 relative">
            <div className="w-full rounded-t-sm relative" style={{ height: 44 }}>
              {/* Goal line */}
              <div className="absolute left-0 right-0 border-t border-dashed border-green-primary/30"
                style={{ bottom: `${goalPct}%` }} />
              {/* Bar */}
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t-sm chart-bar transition-all"
                style={{
                  height: `${pct}%`,
                  background: i === today ? '#3D5240' : '#BDC9B6',
                  minHeight: d.val > 0 ? 3 : 0
                }}
              />
            </div>
            <span className="text-[9px] text-stone-400 font-medium">{days[i]}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function Home({ onNavigate }) {
  const {
    profile, goals,
    todayKcal, todayProtein, todayWater_l, todaySleep_h, todayActivity_min,
    activityLogs, bodyLogs, weekHistory, streak,
    insight, setInsight, lastInsightTone, setLastInsightTone,
  } = useApp()

  const intervalRef = useRef(null)

  const refresh = () => {
    const ins = generateInsight({
      todayKcal, todayProtein, todayWater_l, todaySleep_h,
      activityLogs, goals, profile, streak, lastTone: lastInsightTone
    })
    setInsight(ins)
    setLastInsightTone(ins.tone)
  }

  useEffect(() => {
    refresh()
    intervalRef.current = setInterval(refresh, 60000)
    return () => clearInterval(intervalRef.current)
  }, [todayKcal, todayProtein, todayWater_l, todaySleep_h, activityLogs.length])

  // Build week data (last 7 days)
  const weekData = Array.from({ length: 7 }, (_, i) => ({ val: weekHistory[i] || 0 }))
  // Put today's as last
  const todayIdx = (new Date().getDay() + 6) % 7
  weekData[todayIdx] = { val: todayKcal }

  const avgKcal = Math.round(weekData.reduce((s,d)=>s+d.val,0) / weekData.filter(d=>d.val>0).length || 0)
  const goalsHit = weekData.filter(d => d.val >= goals.cal_goal * 0.85 && d.val <= goals.cal_goal * 1.15).length

  const calPct = goals.cal_goal > 0 ? Math.min(Math.round((todayKcal / goals.cal_goal) * 100), 100) : 0

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header — warm white, no harsh color */}
      <div className="px-5 pt-12 pb-5 shrink-0" style={{ background: '#EFF0EB' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-normal mb-0.5" style={{ color: '#8A9688' }}>{greeting()}</p>
            <h1 className="text-2xl font-semibold leading-tight" style={{ color: '#1C1410' }}>
              {profile.name.split(' ')[0]}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {streak >= 1 && (
              <span className="rounded-pill px-2.5 py-1 text-xs font-medium"
                style={{ background: '#E2EAE0', color: '#3D5240' }}>
                🔥 {streak}d streak
              </span>
            )}
            <div className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: '#E2EAE0' }}>
              <span className="text-sm font-semibold" style={{ color: '#3D5240' }}>
                {(profile.name || 'F')[0].toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        {/* Calorie bar — big and satisfying */}
        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-xs font-medium" style={{ color: '#8A9688' }}>
              Calories today
            </span>
            <span className="text-xs font-semibold" style={{ color: calPct >= 90 ? '#3D5240' : '#1C1410' }}>
              {todayKcal} <span style={{ color: '#8A9688', fontWeight: 400 }}>/ {goals.cal_goal} kcal</span>
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E4E7DF' }}>
            <div className="h-full rounded-full progress-bar-fill" style={{ width: `${calPct}%`, background: '#3D5240' }} />
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollable px-4 py-4 flex flex-col gap-4">

        {/* Insight card */}
        {insight && (
          <div
            className="rounded-2xl px-4 py-4 shadow-card border"
            style={{
              background: insight.colors.bg,
              borderColor: insight.colors.border,
            }}
          >
            <div className="flex items-start gap-3">
              <DiyaLogo size={28} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1"
                  style={{ color: insight.colors.color }}>
                  {insight.label}
                </p>
                <p className="text-sm text-stone-700 leading-relaxed">{insight.msg}</p>
              </div>
            </div>
          </div>
        )}

        {/* Today 2×2 grid */}
        <div>
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2.5">Today</h2>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Protein"
              value={Math.round(todayProtein)}
              goal={goals.protein_goal}
              unit="g"
              pct={(todayProtein / goals.protein_goal) * 100}
              color="#3D5240"
              onTap={() => onNavigate('food')}
            />
            <MetricCard
              label="Water"
              value={todayWater_l.toFixed(1)}
              goal={goals.water_goal_l}
              unit="L"
              pct={(todayWater_l / goals.water_goal_l) * 100}
              color="#3D5240"
              onTap={() => onNavigate('water')}
            />
            <MetricCard
              label="Sleep"
              value={todaySleep_h.toFixed(1)}
              goal={goals.sleep_goal_h}
              unit="h"
              pct={(todaySleep_h / goals.sleep_goal_h) * 100}
              color="#3D5240"
              onTap={() => onNavigate('activity')}
            />
            <MetricCard
              label="Activity"
              value={todayActivity_min}
              goal={60}
              unit="min"
              pct={(todayActivity_min / 60) * 100}
              color="#3D5240"
              onTap={() => onNavigate('activity')}
            />
          </div>
        </div>

        {/* Weight goal progress — shown when target weight is set */}
        {goals.target_weight_lbs && profile.goal !== 'maintain' && (() => {
          const latestLog = bodyLogs.length ? bodyLogs[bodyLogs.length - 1] : null
          const currentW = latestLog?.weight_lbs || profile.weight_lbs
          const startW = profile.weight_lbs
          const targetW = goals.target_weight_lbs
          const totalDiff = Math.abs(startW - targetW)
          const doneDiff = Math.abs(startW - currentW)
          const pct = totalDiff > 0 ? Math.min(Math.round((doneDiff / totalDiff) * 100), 100) : 0
          const remaining = Math.abs(currentW - targetW).toFixed(1)
          return (
            <div className="bg-white rounded-2xl p-4 shadow-card"
              onClick={() => onNavigate('activity')}>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Weight goal</h2>
                {goals.weeks_to_goal && (
                  <span className="text-xs text-stone-400">~{goals.weeks_to_goal} weeks</span>
                )}
              </div>
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-xl font-bold text-stone-800">{currentW} lbs</p>
                  <p className="text-xs text-stone-400">now</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-primary">{targetW} lbs</p>
                  <p className="text-xs text-stone-400">goal</p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-stone-100 overflow-hidden mb-1.5">
                <div className="h-full rounded-full bg-green-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-stone-400">{pct}% complete · {remaining} lbs to go</p>
            </div>
          )
        })()}

        {/* This week */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">This week</h2>
          <MiniBarChart data={weekData} goal={goals.cal_goal} />
          <div className="grid grid-cols-4 gap-2 mt-3 border-t border-stone-100 pt-3">
            {[
              { label: 'Goals hit', value: goalsHit },
              { label: 'Avg kcal', value: avgKcal || '–' },
              { label: 'Avg sleep', value: `${goals.sleep_goal_h}h` },
              { label: 'Streak', value: `${streak}d` },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-base font-bold text-stone-800">{s.value}</div>
                <div className="text-[10px] text-stone-400 leading-tight mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming soon — social */}
        <div className="rounded-2xl p-4 border border-dashed border-stone-200"
          style={{ background: 'linear-gradient(135deg, #F5F7F3 0%, #EFF0EB 100%)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">👨‍👩‍👧</span>
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#3D5240' }}>Coming Soon</span>
          </div>
          <p className="text-sm font-semibold text-stone-700 mb-1">Connect with family & friends</p>
          <p className="text-xs text-stone-400 leading-relaxed">Share challenges, cheer each other on, and build healthy habits together.</p>
        </div>

        {/* Bottom spacer */}
        <div className="h-2" />
      </div>
    </div>
  )
}
