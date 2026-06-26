// Insight Engine — evaluates all metrics holistically every 60s

const TONES = {
  celebrate: { color: '#3D5240', bg: '#E2EAE0', border: '#BDC9B6' },
  encourage: { color: '#3D5240', bg: '#E2EAE0', border: '#BDC9B6' },
  gentle:    { color: '#3D5240', bg: '#E2EAE0', border: '#BDC9B6' },
  nudge:     { color: '#3D5240', bg: '#FDF1E8', border: '#F0C9A0' },
  checkin:   { color: '#3D5240', bg: '#E4E7DF', border: '#BDC9B6' },
  reminder:  { color: '#3D5240', bg: '#E2EAE0', border: '#BDC9B6' },
  focus:     { color: '#3D5240', bg: '#FDF1E8', border: '#F0C9A0' },
  steady:    { color: '#3D5240', bg: '#E2EAE0', border: '#BDC9B6' },
}

function timeOfDay(h) {
  if (h < 11) return 'morning'
  if (h < 14) return 'midday'
  if (h < 17) return 'afternoon'
  if (h < 21) return 'evening'
  return 'night'
}

function score(val, goal) {
  if (!goal || goal === 0) return 1
  const ratio = val / goal
  if (ratio >= 0.9) return 1
  if (ratio >= 0.65) return 0.5
  return 0
}

export function generateInsight({ todayKcal, todayProtein, todayWater_l, todaySleep_h, activityLogs, goals, profile, streak, lastTone }) {
  const h = new Date().getHours()
  const tod = timeOfDay(h)
  const name = profile?.name || 'Friend'
  const firstName = name.split(' ')[0]

  const calScore = score(todayKcal, goals.cal_goal)
  const protScore = score(todayProtein, goals.protein_goal)
  const waterScore = score(todayWater_l, goals.water_goal_l)
  const sleepScore = score(todaySleep_h, goals.sleep_goal_h)
  const actScore = activityLogs.length > 0 ? 1 : (h < 18 ? 0.5 : 0)

  const avgScore = (calScore + protScore + waterScore + sleepScore + actScore) / 5

  const kcalLeft = Math.max(0, goals.cal_goal - todayKcal)
  const protLeft = Math.max(0, goals.protein_goal - todayProtein)
  const waterLeft_l = Math.max(0, goals.water_goal_l - todayWater_l)

  // Determine tone — never same as last
  let tone
  const allTones = Object.keys(TONES)

  if (avgScore >= 0.85 && streak >= 3) {
    tone = 'celebrate'
  } else if (avgScore >= 0.7) {
    tone = 'encourage'
  } else if (tod === 'evening' && (kcalLeft > 200 || protLeft > 10)) {
    tone = 'reminder'
  } else if (waterScore === 0 && h > 10) {
    tone = 'nudge'
  } else if (avgScore < 0.4) {
    tone = 'gentle'
  } else if (actScore === 0 && h >= 17) {
    tone = 'focus'
  } else if (tod === 'morning') {
    tone = 'checkin'
  } else {
    tone = 'steady'
  }

  // Prevent repeating same tone
  if (tone === lastTone) {
    const others = allTones.filter(t => t !== tone)
    tone = others[Math.floor(Math.random() * others.length)]
  }

  // Label
  let label
  if (tone === 'celebrate' && streak >= 3) label = `${streak}-day streak 🔥`
  else if (tone === 'celebrate') label = 'Great progress today'
  else if (tone === 'nudge' && waterScore === 0) label = 'Hydration check'
  else if (tone === 'reminder') label = 'Evening wind-down'
  else if (tone === 'focus' && actScore === 0) label = 'Quick win available'
  else if (tod === 'morning') label = 'Good morning'
  else if (todaySleep_h > 0 && todaySleep_h < 6) label = 'Rest matters too'
  else label = 'Sattva insight'

  // Message — 2-3 sentences, varies by time and state
  let msg

  if (tod === 'morning') {
    if (avgScore === 1) {
      msg = `You're set up beautifully for the day, ${firstName}. Yesterday's consistency is paying off — you're on a ${streak}-day run. Start with a solid breakfast and water first thing.`
    } else if (sleepScore < 1) {
      msg = `Morning, ${firstName}. Last night's sleep was lighter than your goal — no need to force energy today, just move gently. A good breakfast will help more than anything.`
    } else {
      msg = `Morning, ${firstName}! You have ${kcalLeft} kcal and ${protLeft}g protein as your canvas today. Start with breakfast and water — the rest follows naturally.`
    }
  } else if (tod === 'midday') {
    if (waterScore < 0.5) {
      msg = `Halfway through the day — your water is at ${todayWater_l.toFixed(1)}L of a ${goals.water_goal_l}L goal. Lunch is a great moment to drink a full glass before eating. You're doing fine on food.`
    } else if (calScore >= 0.5) {
      msg = `Good rhythm so far today. Lunch is the moment that shapes your afternoon — you have ${kcalLeft} kcal left and ${protLeft}g protein to work with. A protein-forward meal will keep energy steady.`
    } else {
      msg = `You're at ${todayKcal} kcal mid-day — well within your ${goals.cal_goal} target. Lunch is a great opportunity to load up on protein and set yourself up for a strong afternoon.`
    }
  } else if (tod === 'afternoon') {
    if (waterScore < 0.7) {
      msg = `Afternoon slump is often just dehydration. You're at ${todayWater_l.toFixed(1)}L — try to get to ${goals.water_goal_l}L by evening. If you haven't moved yet today, even a 20-min walk counts.`
    } else if (actScore === 0) {
      msg = `Good energy reserves going into the afternoon — ${kcalLeft} kcal left in your goal. Your activity window is open right now; even a short session adds up. Water is looking good.`
    } else {
      msg = `Solid afternoon shape — activity done, hydration on track. You have ${kcalLeft} kcal and ${protLeft}g protein left for dinner. Steady pace to the finish.`
    }
  } else if (tod === 'evening') {
    if (kcalLeft > 50 || protLeft > 5) {
      msg = `Dinner time, ${firstName} — you have ${kcalLeft} kcal and ${protLeft}g protein remaining. A protein-rich dinner closes the gap cleanly. ${sleepScore < 0.5 ? 'Try to wind down by 10pm for better recovery.' : 'Sleep goal is in reach tonight.'}`
    } else {
      msg = `You've landed your numbers almost perfectly today, ${firstName} — ${todayKcal} of ${goals.cal_goal} kcal and ${todayProtein.toFixed(0)}g of ${goals.protein_goal}g protein. Light dinner if hungry, and great rest tonight.`
    }
  } else { // night
    if (avgScore >= 0.8) {
      msg = `Today was a good one — food, water, and activity all came together. ${streak > 1 ? `That's ${streak} days in a row of showing up.` : 'One solid day is the start of a streak.'} Rest well tonight.`
    } else if (waterScore < 0.5) {
      msg = `A quiet end to the day. Water was lower today — that's the one to watch tomorrow. Everything else held together reasonably well. No judgment, just a note for the morning.`
    } else {
      msg = `Day done. ${avgScore >= 0.6 ? 'More hit than missed today.' : 'Not every day lands perfectly — that\'s fine.'} The consistency over weeks matters far more than any single day. Rest well, ${firstName}.`
    }
  }

  return { tone, label, msg, colors: TONES[tone] }
}
