import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext(null)

const TODAY = () => new Date().toISOString().slice(0, 10)

// Default profile for demo mode
const DEFAULT_PROFILE = {
  name: 'Friend',
  age: 28,
  sex: 'female',
  height_cm: 165,
  weight_lbs: 140,
  target_weight_lbs: null,
  activity_level: 'moderate',
  goal: 'maintain',
  track: { calories: true, protein: true, water: true, sleep: true, workouts: true, weight: true },
}

// Mifflin-St Jeor BMR → TDEE → goals
export function calcGoals(profile) {
  const w_kg = profile.weight_lbs / 2.2046
  const h_cm = profile.height_cm
  const age = profile.age
  const bmr = profile.sex === 'female'
    ? 10 * w_kg + 6.25 * h_cm - 5 * age - 161
    : 10 * w_kg + 6.25 * h_cm + 5 * age - 5

  const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 }
  const tdee = bmr * (multipliers[profile.activity_level] || 1.55)

  const calGoal = profile.goal === 'lose' ? tdee - 300 : profile.goal === 'build' ? tdee + 200 : tdee
  const proteinGoal = profile.goal === 'build' ? w_kg * 2.0 : w_kg * 1.6
  const waterGoal_l = (w_kg * 35) / 1000
  const waterGoal_cups = waterGoal_l / 0.25

  // Estimated weeks to reach target weight (3500 kcal ≈ 1 lb fat)
  let weeks_to_goal = null
  const tw = parseFloat(profile.target_weight_lbs)
  if (tw && tw > 0 && profile.goal !== 'maintain') {
    const diff = Math.abs(profile.weight_lbs - tw)
    const dailyDelta = profile.goal === 'lose' ? 300 : 200
    weeks_to_goal = Math.round((diff * 3500) / (dailyDelta * 7))
  }

  return {
    cal_goal: Math.round(calGoal),
    protein_goal: Math.round(proteinGoal),
    water_goal_l: Math.round(waterGoal_l * 10) / 10,
    water_goal_cups: Math.round(waterGoal_cups),
    sleep_goal_h: 8,
    workout_goal_week: 4,
    weeks_to_goal,
    target_weight_lbs: tw || null,
  }
}

function loadLocal(key, def) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : def
  } catch { return def }
}
function saveLocal(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

export function AppProvider({ children }) {
  const [onboarded, setOnboarded] = useState(() => loadLocal('sattva_onboarded', false))
  const [profile, setProfile] = useState(() => loadLocal('sattva_profile', DEFAULT_PROFILE))
  const [goals, setGoals] = useState(() => {
    const saved = loadLocal('sattva_goals', null)
    if (saved) return saved
    const p = loadLocal('sattva_profile', DEFAULT_PROFILE)
    return calcGoals(p)
  })

  // Today's logs
  const [foodLogs, setFoodLogs] = useState(() => loadLocal('sattva_food_' + TODAY(), []))
  const [waterLogs, setWaterLogs] = useState(() => loadLocal('sattva_water_' + TODAY(), []))
  const [sleepLogs, setSleepLogs] = useState(() => loadLocal('sattva_sleep_' + TODAY(), []))
  const [activityLogs, setActivityLogs] = useState(() => loadLocal('sattva_activity_' + TODAY(), []))
  const [bodyLogs, setBodyLogs] = useState(() => loadLocal('sattva_body', []))

  // Week history for charts
  const [weekHistory, setWeekHistory] = useState(() => loadLocal('sattva_week', []))

  // Notification settings
  const [notifSettings, setNotifSettings] = useState(() => loadLocal('sattva_notif', {
    master_on: false,
    breakfast_on: true, breakfast_time: '08:00',
    lunch_on: true, lunch_time: '13:00',
    snack_on: false, snack_time: '16:00',
    dinner_on: true, dinner_time: '19:30',
    water_on: true,
    bedtime_on: true, bedtime_time: '22:30',
    activity_nudge_on: true,
  }))

  // Insight state
  const [insight, setInsight] = useState(null)
  const [lastInsightTone, setLastInsightTone] = useState(null)

  // Streak
  const [streak, setStreak] = useState(() => loadLocal('sattva_streak', 1))

  // In-app notification banner
  const [banner, setBanner] = useState(null)

  // Persist on change
  useEffect(() => { saveLocal('sattva_onboarded', onboarded) }, [onboarded])
  useEffect(() => { saveLocal('sattva_profile', profile) }, [profile])
  useEffect(() => { saveLocal('sattva_goals', goals) }, [goals])
  useEffect(() => { saveLocal('sattva_food_' + TODAY(), foodLogs) }, [foodLogs])
  useEffect(() => { saveLocal('sattva_water_' + TODAY(), waterLogs) }, [waterLogs])
  useEffect(() => { saveLocal('sattva_sleep_' + TODAY(), sleepLogs) }, [sleepLogs])
  useEffect(() => { saveLocal('sattva_activity_' + TODAY(), activityLogs) }, [activityLogs])
  useEffect(() => { saveLocal('sattva_body', bodyLogs) }, [bodyLogs])
  useEffect(() => { saveLocal('sattva_notif', notifSettings) }, [notifSettings])
  useEffect(() => { saveLocal('sattva_streak', streak) }, [streak])

  // Computed today totals
  const todayKcal = foodLogs.reduce((s, f) => s + (f.kcal || 0), 0)
  const todayProtein = foodLogs.reduce((s, f) => s + (f.protein_g || 0), 0)
  const todayWater_ml = waterLogs.reduce((s, w) => s + (w.amount_ml || 0), 0)
  const todayWater_l = todayWater_ml / 1000
  const todayWater_cups = todayWater_ml / 250
  const lastSleep = sleepLogs.length ? sleepLogs[sleepLogs.length - 1] : null
  const todaySleep_h = lastSleep ? lastSleep.duration_h : 0
  const todayActivity_min = activityLogs.reduce((s, a) => s + (a.duration_min || 0), 0)
  const todayKcalBurned = activityLogs.reduce((s, a) => s + (a.kcal_burned || 0), 0)

  const completeOnboarding = useCallback((prof) => {
    const newGoals = calcGoals(prof)
    setProfile(prof)
    setGoals(newGoals)
    setOnboarded(true)
    setStreak(1)
  }, [])

  const updateProfile = useCallback((updates) => {
    setProfile(p => {
      const next = { ...p, ...updates }
      const newGoals = calcGoals(next)
      setGoals(newGoals)
      return next
    })
  }, [])

  const addFoodLog = useCallback((entry) => {
    setFoodLogs(prev => [...prev, { ...entry, id: Date.now(), logged_at: new Date().toISOString() }])
  }, [])

  const removeFoodLog = useCallback((id) => {
    setFoodLogs(prev => prev.filter(f => f.id !== id))
  }, [])

  const addWaterLog = useCallback((entry) => {
    setWaterLogs(prev => [...prev, { ...entry, id: Date.now(), logged_at: new Date().toISOString() }])
  }, [])

  const removeWaterLog = useCallback((id) => {
    setWaterLogs(prev => prev.filter(w => w.id !== id))
  }, [])

  const logSleep = useCallback((entry) => {
    setSleepLogs(prev => [...prev, { ...entry, id: Date.now() }])
  }, [])

  const addActivityLog = useCallback((entry) => {
    setActivityLogs(prev => [...prev, { ...entry, id: Date.now(), logged_at: new Date().toISOString() }])
  }, [])

  const removeActivityLog = useCallback((id) => {
    setActivityLogs(prev => prev.filter(a => a.id !== id))
  }, [])

  const addBodyLog = useCallback((entry) => {
    setBodyLogs(prev => [...prev, { ...entry, id: Date.now(), logged_at: new Date().toISOString() }])
  }, [])

  const showBanner = useCallback((msg, type = 'info') => {
    setBanner({ msg, type })
    setTimeout(() => setBanner(null), 7000)
  }, [])

  const ctx = {
    onboarded, completeOnboarding,
    profile, updateProfile,
    goals,
    foodLogs, addFoodLog, removeFoodLog,
    waterLogs, addWaterLog, removeWaterLog,
    sleepLogs, logSleep,
    activityLogs, addActivityLog, removeActivityLog,
    bodyLogs, addBodyLog,
    weekHistory,
    notifSettings, setNotifSettings,
    streak, setStreak,
    insight, setInsight,
    lastInsightTone, setLastInsightTone,
    banner, showBanner,
    todayKcal, todayProtein,
    todayWater_ml, todayWater_l, todayWater_cups,
    todaySleep_h, todayActivity_min, todayKcalBurned,
  }

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
