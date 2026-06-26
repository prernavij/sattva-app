import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext(null)

const TODAY = () => new Date().toISOString().slice(0, 10)

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
  // Auth
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)
  const profileIdRef = useRef(null)

  const [onboarded, setOnboarded] = useState(() => loadLocal('sattva_onboarded', false))
  const [profile, setProfile] = useState(() => loadLocal('sattva_profile', DEFAULT_PROFILE))
  const [goals, setGoals] = useState(() => {
    const saved = loadLocal('sattva_goals', null)
    if (saved) return saved
    const p = loadLocal('sattva_profile', DEFAULT_PROFILE)
    return calcGoals(p)
  })

  const [foodLogs, setFoodLogs] = useState(() => loadLocal('sattva_food_' + TODAY(), []))
  const [waterLogs, setWaterLogs] = useState(() => loadLocal('sattva_water_' + TODAY(), []))
  const [sleepLogs, setSleepLogs] = useState(() => loadLocal('sattva_sleep_' + TODAY(), []))
  const [activityLogs, setActivityLogs] = useState(() => loadLocal('sattva_activity_' + TODAY(), []))
  const [bodyLogs, setBodyLogs] = useState(() => loadLocal('sattva_body', []))
  const [weekHistory, setWeekHistory] = useState(() => loadLocal('sattva_week', []))
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
  const [insight, setInsight] = useState(null)
  const [lastInsightTone, setLastInsightTone] = useState(null)
  const [streak, setStreak] = useState(() => loadLocal('sattva_streak', 1))
  const [banner, setBanner] = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        setDataLoading(true)
        await loadFromSupabase(session.user.id)
        setDataLoading(false)
      }
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
        profileIdRef.current = null
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadFromSupabase = async (userId) => {
    // Load profile
    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (prof) {
      profileIdRef.current = prof.id
      const mapped = {
        name: prof.name,
        age: prof.age,
        sex: prof.sex,
        height_cm: prof.height_cm,
        weight_lbs: prof.weight_lbs,
        target_weight_lbs: prof.track?.target_weight_lbs || null,
        activity_level: prof.activity_level,
        goal: prof.goal,
        track: prof.track || {},
      }
      setProfile(mapped)
      setGoals(calcGoals(mapped))
      setOnboarded(true)
      saveLocal('sattva_profile', mapped)
      saveLocal('sattva_onboarded', true)

      // Load today's logs
      const today = TODAY()
      const [food, water, sleep, activity, body] = await Promise.all([
        supabase.from('food_logs').select('*').eq('profile_id', prof.id).gte('logged_at', today),
        supabase.from('water_logs').select('*').eq('profile_id', prof.id).gte('logged_at', today),
        supabase.from('sleep_logs').select('*').eq('profile_id', prof.id).eq('date', today),
        supabase.from('activity_logs').select('*').eq('profile_id', prof.id).gte('logged_at', today),
        supabase.from('body_logs').select('*').eq('profile_id', prof.id).order('logged_at', { ascending: false }).limit(30),
      ])

      if (food.data?.length) { setFoodLogs(food.data); saveLocal('sattva_food_' + today, food.data) }
      if (water.data?.length) { setWaterLogs(water.data); saveLocal('sattva_water_' + today, water.data) }
      if (sleep.data?.length) { setSleepLogs(sleep.data); saveLocal('sattva_sleep_' + today, sleep.data) }
      if (activity.data?.length) { setActivityLogs(activity.data); saveLocal('sattva_activity_' + today, activity.data) }
      if (body.data?.length) { setBodyLogs(body.data); saveLocal('sattva_body', body.data) }
    }
  }

  const handleAuth = useCallback(async (authUser) => {
    setUser(authUser)
    setDataLoading(true)
    await loadFromSupabase(authUser.id)
    setDataLoading(false)
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    profileIdRef.current = null
  }, [])

  // localStorage persistence
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

  // Computed totals
  const todayKcal = foodLogs.reduce((s, f) => s + (f.kcal || 0), 0)
  const todayProtein = foodLogs.reduce((s, f) => s + (f.protein_g || 0), 0)
  const todayWater_ml = waterLogs.reduce((s, w) => s + (w.amount_ml || 0), 0)
  const todayWater_l = todayWater_ml / 1000
  const todayWater_cups = todayWater_ml / 250
  const lastSleep = sleepLogs.length ? sleepLogs[sleepLogs.length - 1] : null
  const todaySleep_h = lastSleep ? lastSleep.duration_h : 0
  const todayActivity_min = activityLogs.reduce((s, a) => s + (a.duration_min || 0), 0)
  const todayKcalBurned = activityLogs.reduce((s, a) => s + (a.kcal_burned || 0), 0)

  // Supabase upsert helpers
  const getProfileId = () => profileIdRef.current

  const syncProfileToSupabase = async (prof, userId) => {
    const uid = userId || user?.id
    if (!uid) return
    const payload = {
      user_id: uid,
      name: prof.name,
      age: prof.age,
      sex: prof.sex,
      height_cm: prof.height_cm,
      weight_lbs: prof.weight_lbs,
      activity_level: prof.activity_level,
      goal: prof.goal,
      track: { ...prof.track, target_weight_lbs: prof.target_weight_lbs },
      updated_at: new Date().toISOString(),
    }
    const { data } = await supabase.from('profiles').upsert(payload, { onConflict: 'user_id' }).select().single()
    if (data) profileIdRef.current = data.id
  }

  const completeOnboarding = useCallback(async (prof) => {
    const newGoals = calcGoals(prof)
    setProfile(prof)
    setGoals(newGoals)
    setOnboarded(true)
    setStreak(1)
    if (user) await syncProfileToSupabase(prof, user.id)
  }, [user])

  const updateProfile = useCallback(async (updates) => {
    setProfile(p => {
      const next = { ...p, ...updates }
      setGoals(calcGoals(next))
      if (user) syncProfileToSupabase(next)
      return next
    })
  }, [user])

  const addFoodLog = useCallback(async (entry) => {
    const newEntry = { ...entry, id: Date.now(), logged_at: new Date().toISOString() }
    setFoodLogs(prev => [...prev, newEntry])
    const pid = getProfileId()
    if (pid) {
      await supabase.from('food_logs').insert({
        profile_id: pid,
        food_name: entry.food_name,
        meal_type: entry.meal_type,
        kcal: entry.kcal,
        protein_g: entry.protein_g,
        logged_at: newEntry.logged_at,
      })
    }
  }, [])

  const removeFoodLog = useCallback(async (id) => {
    setFoodLogs(prev => prev.filter(f => f.id !== id))
    const pid = getProfileId()
    if (pid) await supabase.from('food_logs').delete().eq('id', id).eq('profile_id', pid)
  }, [])

  const addWaterLog = useCallback(async (entry) => {
    const newEntry = { ...entry, id: Date.now(), logged_at: new Date().toISOString() }
    setWaterLogs(prev => [...prev, newEntry])
    const pid = getProfileId()
    if (pid) {
      await supabase.from('water_logs').insert({
        profile_id: pid,
        amount_ml: entry.amount_ml,
        logged_at: newEntry.logged_at,
      })
    }
  }, [])

  const removeWaterLog = useCallback(async (id) => {
    setWaterLogs(prev => prev.filter(w => w.id !== id))
    const pid = getProfileId()
    if (pid) await supabase.from('water_logs').delete().eq('id', id).eq('profile_id', pid)
  }, [])

  const logSleep = useCallback(async (entry) => {
    const newEntry = { ...entry, id: Date.now() }
    setSleepLogs(prev => [...prev, newEntry])
    const pid = getProfileId()
    if (pid) {
      await supabase.from('sleep_logs').upsert({
        profile_id: pid,
        date: TODAY(),
        duration_h: entry.duration_h,
        bedtime: entry.bedtime,
        wake_time: entry.wake_time,
        quality: entry.quality,
      }, { onConflict: 'profile_id,date' })
    }
  }, [])

  const addActivityLog = useCallback(async (entry) => {
    const newEntry = { ...entry, id: Date.now(), logged_at: new Date().toISOString() }
    setActivityLogs(prev => [...prev, newEntry])
    const pid = getProfileId()
    if (pid) {
      await supabase.from('activity_logs').insert({
        profile_id: pid,
        activity_type: entry.activity_type,
        duration_min: entry.duration_min,
        intensity: entry.intensity,
        kcal_burned: entry.kcal_burned,
        logged_at: newEntry.logged_at,
      })
    }
  }, [])

  const removeActivityLog = useCallback(async (id) => {
    setActivityLogs(prev => prev.filter(a => a.id !== id))
    const pid = getProfileId()
    if (pid) await supabase.from('activity_logs').delete().eq('id', id).eq('profile_id', pid)
  }, [])

  const addBodyLog = useCallback(async (entry) => {
    const newEntry = { ...entry, id: Date.now(), logged_at: new Date().toISOString() }
    setBodyLogs(prev => [...prev, newEntry])
    const pid = getProfileId()
    if (pid) {
      await supabase.from('body_logs').insert({
        profile_id: pid,
        weight_lbs: entry.weight_lbs,
        waist_in: entry.waist_in,
        chest_in: entry.chest_in,
        hips_in: entry.hips_in,
        arms_in: entry.arms_in,
        logged_at: newEntry.logged_at,
      })
    }
  }, [])

  const showBanner = useCallback((msg, type = 'info') => {
    setBanner({ msg, type })
    setTimeout(() => setBanner(null), 7000)
  }, [])

  if (authLoading || dataLoading) return null

  const ctx = {
    user, handleAuth, signOut,
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
