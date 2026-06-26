import { useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'

function timeToMs(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0)
  if (target < now) target.setDate(target.getDate() + 1)
  return target - now
}

function sendNotif(title, body) {
  if (Notification?.permission === 'granted') {
    try { new Notification(title, { body, icon: '/diya.svg' }) } catch {}
  }
}

export function useNotifications() {
  const { notifSettings, foodLogs, waterLogs, activityLogs, goals, todayWater_l, showBanner } = useApp()
  const timersRef = useRef([])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  useEffect(() => {
    if (!notifSettings.master_on) { clearTimers(); return }

    clearTimers()

    const schedule = (ms, fn) => {
      const t = setTimeout(fn, ms)
      timersRef.current.push(t)
    }

    // Meal reminders
    const meals = [
      { key: 'breakfast', label: 'Breakfast', timeKey: 'breakfast_time', mealType: 'breakfast' },
      { key: 'lunch', label: 'Lunch', timeKey: 'lunch_time', mealType: 'lunch' },
      { key: 'snack', label: 'Snack', timeKey: 'snack_time', mealType: 'snack' },
      { key: 'dinner', label: 'Dinner', timeKey: 'dinner_time', mealType: 'dinner' },
    ]

    meals.forEach(m => {
      if (!notifSettings[m.key + '_on']) return
      const ms = timeToMs(notifSettings[m.timeKey] || '12:00')
      if (ms > 0 && ms < 86400000) {
        schedule(ms, () => {
          const alreadyLogged = foodLogs.some(f => f.meal_type === m.mealType)
          if (alreadyLogged) {
            showBanner(`Great — ${m.label.toLowerCase()} already logged!`, 'celebrate')
          } else {
            const msg = `Time for ${m.label.toLowerCase()}! Log your meal to stay on track.`
            sendNotif(`🍽 ${m.label} time`, msg)
            showBanner(msg, 'info')
          }
        })
      }
    })

    // Water reminders every 2h
    if (notifSettings.water_on) {
      const h = new Date().getHours()
      const nextWaterHour = Math.ceil(h / 2) * 2
      for (let wh = nextWaterHour; wh <= 20; wh += 2) {
        const ms = timeToMs(`${String(wh).padStart(2, '0')}:00`)
        if (ms > 0 && ms < 86400000) {
          schedule(ms, () => {
            if (todayWater_l < goals.water_goal_l * 0.8) {
              const msg = `Hydration check — you're at ${todayWater_l.toFixed(1)}L of ${goals.water_goal_l}L today.`
              sendNotif('💧 Water reminder', msg)
              showBanner(msg, 'water')
            }
          })
        }
      }
    }

    // Bedtime
    if (notifSettings.bedtime_on) {
      const ms = timeToMs(notifSettings.bedtime_time || '22:30')
      if (ms > 0 && ms < 86400000) {
        schedule(ms, () => {
          const msg = 'Wind-down time — great sleep is the foundation of everything else.'
          sendNotif('🌙 Bedtime', msg)
          showBanner(msg, 'info')
        })
      }
    }

    // Activity nudge at 6pm
    if (notifSettings.activity_nudge_on) {
      const ms = timeToMs('18:00')
      if (ms > 0 && ms < 86400000) {
        schedule(ms, () => {
          if (activityLogs.length === 0) {
            const msg = 'No activity yet today — even a 20-min walk counts. Your body will thank you.'
            sendNotif('🏃 Activity nudge', msg)
            showBanner(msg, 'info')
          }
        })
      }
    }

    return clearTimers
  }, [notifSettings, foodLogs.length, waterLogs.length, activityLogs.length])
}
