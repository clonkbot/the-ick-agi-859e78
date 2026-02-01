import { useState, useEffect } from 'react'

interface FollowActivity {
  id: number
  username: string
  displayName: string
  avatar: string
  action: 'followed' | 'unfollowed'
  timestamp: Date
  riskLevel: 'low' | 'medium' | 'high'
  category: string
  followers: string
}

interface Alert {
  id: number
  title: string
  description: string
  severity: 'warning' | 'danger' | 'info'
  timestamp: Date
}

const mockActivities: FollowActivity[] = [
  { id: 1, username: 'jessica_model', displayName: 'Jessica M.', avatar: '👩‍🦰', action: 'followed', timestamp: new Date(Date.now() - 1000 * 60 * 5), riskLevel: 'high', category: 'Model/Influencer', followers: '245K' },
  { id: 2, username: 'fitness_sarah', displayName: 'Sarah Fitness', avatar: '💪', action: 'followed', timestamp: new Date(Date.now() - 1000 * 60 * 23), riskLevel: 'high', category: 'Fitness Influencer', followers: '892K' },
  { id: 3, username: 'techbro_mike', displayName: 'Mike Tech', avatar: '👨‍💻', action: 'followed', timestamp: new Date(Date.now() - 1000 * 60 * 45), riskLevel: 'low', category: 'Tech/Work', followers: '12K' },
  { id: 4, username: 'travel_dreams', displayName: 'Wanderlust', avatar: '✈️', action: 'unfollowed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), riskLevel: 'low', category: 'Travel', followers: '156K' },
  { id: 5, username: 'emma_nyc', displayName: 'Emma NYC', avatar: '👱‍♀️', action: 'followed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), riskLevel: 'medium', category: 'Lifestyle', followers: '45K' },
  { id: 6, username: 'yoga_with_anna', displayName: 'Anna Yoga', avatar: '🧘‍♀️', action: 'followed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), riskLevel: 'medium', category: 'Wellness', followers: '234K' },
  { id: 7, username: 'collegefriend_dan', displayName: 'Dan', avatar: '🧑', action: 'followed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), riskLevel: 'low', category: 'Friend', followers: '892' },
]

const mockAlerts: Alert[] = [
  { id: 1, title: 'Pattern Detected', description: 'Followed 3 fitness influencers in 24h', severity: 'danger', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: 2, title: 'Late Night Activity', description: 'Account active at 2:34 AM', severity: 'warning', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6) },
  { id: 3, title: 'New Connection', description: 'Mutual follow with @emma_nyc', severity: 'info', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) },
]

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function ThreatMeter({ score }: { score: number }) {
  const getColor = () => {
    if (score < 30) return { bg: 'from-emerald-500 to-green-400', text: 'text-emerald-400' }
    if (score < 60) return { bg: 'from-amber-500 to-yellow-400', text: 'text-amber-400' }
    return { bg: 'from-rose-500 to-pink-400', text: 'text-rose-400' }
  }
  const colors = getColor()
  const status = score < 30 ? 'STABLE' : score < 60 ? 'ELEVATED' : 'CRITICAL'
  
  return (
    <div className="glass rounded-3xl p-6 opacity-0 animate-fade-in stagger-2">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-gray-400 tracking-widest">THREAT ANALYSIS</span>
        <span className={`text-xs font-mono ${colors.text} tracking-widest animate-threat`}>{status}</span>
      </div>
      
      <div className="relative h-40 flex items-center justify-center">
        <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="url(#threatGradient)" 
            strokeWidth="8" 
            strokeLinecap="round"
            strokeDasharray={`${score * 2.83} 283`}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="threatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF69B4" />
              <stop offset="100%" stopColor="#FFB6C1" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-bold gradient-text font-mono">{score}</span>
          <span className="text-[10px] text-gray-500 tracking-widest mt-1">RISK SCORE</span>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="glass rounded-xl p-2">
          <div className="text-lg font-bold text-white">7</div>
          <div className="text-[9px] text-gray-500 tracking-wider">NEW FOLLOWS</div>
        </div>
        <div className="glass rounded-xl p-2">
          <div className="text-lg font-bold text-rose-400">4</div>
          <div className="text-[9px] text-gray-500 tracking-wider">FLAGGED</div>
        </div>
        <div className="glass rounded-xl p-2">
          <div className="text-lg font-bold text-amber-400">3</div>
          <div className="text-[9px] text-gray-500 tracking-wider">ALERTS</div>
        </div>
      </div>
    </div>
  )
}

function ActivityCard({ activity, index }: { activity: FollowActivity; index: number }) {
  const riskColors = {
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    high: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  }
  
  return (
    <div 
      className={`glass rounded-2xl p-4 opacity-0 animate-fade-in hover:border-pink-500/30 transition-all duration-300 cursor-pointer group`}
      style={{ animationDelay: `${0.1 + index * 0.08}s` }}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center text-2xl shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
            {activity.avatar}
          </div>
          {activity.riskLevel === 'high' && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-[8px]">!</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white truncate">{activity.displayName}</span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border ${riskColors[activity.riskLevel]}`}>
              {activity.riskLevel.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">@{activity.username}</span>
            <span className="text-gray-600">·</span>
            <span className="text-xs text-gray-500">{activity.followers} followers</span>
          </div>
          <div className="text-[10px] text-pink-400/70 mt-1 font-mono">{activity.category}</div>
        </div>
        
        <div className="text-right">
          <div className={`text-xs font-medium ${activity.action === 'followed' ? 'text-pink-400' : 'text-gray-500'}`}>
            {activity.action === 'followed' ? '+ FOLLOWED' : '- UNFOLLOWED'}
          </div>
          <div className="text-[10px] text-gray-600 mt-1 font-mono">{formatTimeAgo(activity.timestamp)}</div>
        </div>
      </div>
    </div>
  )
}

function AlertCard({ alert, index }: { alert: Alert; index: number }) {
  const severityStyles = {
    danger: { bg: 'glass-pink', icon: '🚨', border: 'border-l-rose-500' },
    warning: { bg: 'glass', icon: '⚠️', border: 'border-l-amber-500' },
    info: { bg: 'glass', icon: '💡', border: 'border-l-blue-400' }
  }
  const style = severityStyles[alert.severity]
  
  return (
    <div 
      className={`${style.bg} rounded-xl p-4 border-l-2 ${style.border} opacity-0 animate-fade-in`}
      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg">{style.icon}</span>
        <div className="flex-1">
          <div className="font-medium text-sm text-white">{alert.title}</div>
          <div className="text-xs text-gray-400 mt-1">{alert.description}</div>
          <div className="text-[10px] text-gray-600 mt-2 font-mono">{formatTimeAgo(alert.timestamp)}</div>
        </div>
      </div>
    </div>
  )
}

function Header() {
  const [time, setTime] = useState(new Date())
  
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <header className="glass border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center shadow-lg shadow-pink-500/30 animate-float">
              <span className="text-xl">👁</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                <span className="gradient-text">THE ICK</span>
                <span className="text-gray-500 font-normal ml-2 text-sm">AGI</span>
              </h1>
              <div className="text-[10px] text-gray-600 font-mono tracking-widest">RELATIONSHIP INTELLIGENCE</div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-gray-500 font-mono">MONITORING</div>
              <div className="text-sm font-medium text-white">@boyfriend_acc</div>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
            <div className="text-right">
              <div className="text-xs text-gray-500 font-mono tracking-wider">LIVE</div>
              <div className="text-sm font-mono text-pink-400">{time.toLocaleTimeString()}</div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  )
}

function CategoryBreakdown() {
  const categories = [
    { name: 'Models/Influencers', count: 12, percentage: 35, risk: 'high' },
    { name: 'Fitness', count: 8, percentage: 24, risk: 'high' },
    { name: 'Friends', count: 6, percentage: 18, risk: 'low' },
    { name: 'Work/Tech', count: 5, percentage: 15, risk: 'low' },
    { name: 'Other', count: 3, percentage: 8, risk: 'low' },
  ]
  
  const riskColors = {
    low: 'bg-emerald-500',
    high: 'bg-rose-500'
  }
  
  return (
    <div className="glass rounded-3xl p-6 opacity-0 animate-fade-in stagger-4">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-mono text-gray-400 tracking-widest">FOLLOW CATEGORIES</span>
        <span className="text-xs font-mono text-pink-400">34 TOTAL</span>
      </div>
      
      <div className="space-y-4">
        {categories.map((cat, i) => (
          <div key={cat.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-300">{cat.name}</span>
              <span className="text-xs text-gray-500 font-mono">{cat.count}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${riskColors[cat.risk as keyof typeof riskColors]} transition-all duration-1000`}
                style={{ width: `${cat.percentage}%`, transitionDelay: `${0.5 + i * 0.1}s` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TimelineChart() {
  const data = [2, 5, 3, 8, 4, 12, 7]
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const maxVal = Math.max(...data)
  
  return (
    <div className="glass rounded-3xl p-6 opacity-0 animate-fade-in stagger-3">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-mono text-gray-400 tracking-widest">WEEKLY ACTIVITY</span>
        <span className="text-xs font-mono text-gray-500">41 FOLLOWS</span>
      </div>
      
      <div className="flex items-end justify-between h-32 gap-2">
        {data.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full relative flex items-end justify-center" style={{ height: '100px' }}>
              <div 
                className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-pink-500/50 to-pink-400 transition-all duration-1000"
                style={{ height: `${(val / maxVal) * 100}%`, transitionDelay: `${0.6 + i * 0.1}s` }}
              />
            </div>
            <span className="text-[10px] text-gray-600 font-mono">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [threatScore] = useState(73)
  
  return (
    <div className="min-h-screen bg-[#0a0a0b] relative">
      <div className="noise-overlay" />
      <div className="scan-line animate-scan" />
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8 opacity-0 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Good evening, <span className="gradient-text">Detective</span>
            </h2>
            <p className="text-gray-500 text-sm">Here's what we've uncovered in the last 24 hours.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <ThreatMeter score={threatScore} />
              <TimelineChart />
              <CategoryBreakdown />
            </div>
            
            <div className="lg:col-span-8 space-y-6">
              <div className="glass rounded-3xl p-6 opacity-0 animate-fade-in stagger-1">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-mono text-gray-400 tracking-widest">RECENT ACTIVITY</span>
                    <p className="text-[10px] text-gray-600 mt-1">Real-time follow monitoring</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Filter:</span>
                    <button className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-xs font-medium border border-pink-500/30">
                      All
                    </button>
                    <button className="px-3 py-1 rounded-full text-gray-500 text-xs hover:bg-white/5 transition-colors">
                      High Risk
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {mockActivities.map((activity, i) => (
                    <ActivityCard key={activity.id} activity={activity} index={i} />
                  ))}
                </div>
              </div>
              
              <div className="glass rounded-3xl p-6 opacity-0 animate-fade-in stagger-5">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono text-gray-400 tracking-widest">INTELLIGENCE ALERTS</span>
                  <span className="px-2 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-mono border border-rose-500/30">
                    3 NEW
                  </span>
                </div>
                
                <div className="space-y-3">
                  {mockAlerts.map((alert, i) => (
                    <AlertCard key={alert.id} alert={alert} index={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="py-8 text-center">
          <p className="text-xs text-gray-600">
            Requested by <a href="https://twitter.com/hiighphill" className="text-gray-500 hover:text-pink-400 transition-colors">@hiighphill</a> · Built by <a href="https://twitter.com/clonkbot" className="text-gray-500 hover:text-pink-400 transition-colors">@clonkbot</a>
          </p>
        </footer>
      </div>
    </div>
  )
}