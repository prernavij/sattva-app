import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Food from './screens/Food'
import Water from './screens/Water'
import Activity from './screens/Activity'
import Profile from './screens/Profile'
import SleepScreen from './screens/Sleep'
import TabBar from './components/TabBar'
import NotificationBanner from './components/NotificationBanner'
import { useNotifications } from './hooks/useNotifications'

function AppShell() {
  const { onboarded } = useApp()
  const [activeTab, setActiveTab] = useState('home')
  const [showSleep, setShowSleep] = useState(false)

  useNotifications()

  if (!onboarded) return <Onboarding />

  const handleNavigate = (tab) => {
    if (tab === 'sleep') { setShowSleep(true); return }
    setActiveTab(tab)
  }

  return (
    <div className="app-shell">
      <NotificationBanner />

      {/* Screens */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'home' && <Home key="home" onNavigate={handleNavigate} />}
        {activeTab === 'food' && <Food key="food" />}
        {activeTab === 'water' && <Water key="water" />}
        {activeTab === 'activity' && <Activity key="activity" />}
        {activeTab === 'profile' && <Profile key="profile" />}
      </div>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {showSleep && <SleepScreen onClose={() => setShowSleep(false)} />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
