import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConsentModal from '../components/ConsentModal'

const navItems = [
  { icon: '📊', label: 'Overview', id: 'overview' },
  { icon: '📝', label: 'My Survey', id: 'survey' },
  { icon: '🛡️', label: 'Risk Score', id: 'risk' },
  { icon: '📈', label: 'Visualizations', id: 'visualizations' },
  { icon: '💡', label: 'Recommendations', id: 'recommendations' },
  { icon: '🤖', label: 'AI Assistant', id: 'assistant' },
  { icon: '📄', label: 'My Report', id: 'report' },
]

export default function Dashboard() {
  const [consentGiven, setConsentGiven] = useState(false)
  const [showModal, setShowModal] = useState(true)
  const [activePage, setActivePage] = useState('overview')
  const navigate = useNavigate()

  const handleAccept = () => {
    setConsentGiven(true)
    setShowModal(false)
  }

  const handleDecline = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Consent Modal */}
      {showModal && (
        <ConsentModal onAccept={handleAccept} onDecline={handleDecline} />
      )}

      {consentGiven && (
        <div className="flex h-screen overflow-hidden">

          {/* Sidebar */}
          <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
                  <span className="text-white text-lg">🔍</span>
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg leading-none">DFV</h1>
                  <p className="text-gray-500 text-xs mt-0.5">Footprint Visualizer</p>
                </div>
              </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150
                    ${activePage === item.id
                      ? 'bg-violet-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800">
                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">Student</p>
                  <p className="text-gray-500 text-xs truncate">University of Ibadan</p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-500 hover:text-red-400 text-xs transition-colors"
                >
                  ⏻
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {/* Top bar */}
            <div className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur border-b border-gray-800 px-8 py-4">
              <h2 className="text-white font-semibold text-lg capitalize">
                {navItems.find(n => n.id === activePage)?.icon}{' '}
                {navItems.find(n => n.id === activePage)?.label}
              </h2>
            </div>

            {/* Page content */}
            <div className="p-8">
              
            </div>
          </main>
        </div>
      )}
    </div>
  )
}

function OverviewPage() {
  const stats = [
    { label: 'Risk Score', value: '—', sub: 'Complete survey to calculate', color: 'violet' },
    { label: 'Risk Tier', value: '—', sub: 'Not yet assessed', color: 'blue' },
    { label: 'Recommendations', value: '—', sub: 'Pending analysis', color: 'emerald' },
    { label: 'Awareness Score', value: '—', sub: 'Take the quiz to find out', color: 'amber' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-white text-2xl font-bold mb-1">Your Privacy Overview</h3>
        <p className="text-gray-400">Complete the survey to see your digital footprint analysis.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
            <p className="text-white text-4xl font-bold mb-1">{stat.value}</p>
            <p className="text-gray-600 text-xs">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-violet-600/10 border border-violet-500/30 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h4 className="text-white font-semibold mb-1">Ready to see your footprint?</h4>
          <p className="text-gray-400 text-sm">Take the 5-minute survey to get your full risk analysis.</p>
        </div>
        <button
  onClick={() => window.location.href = '/survey'}
  className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap ml-4"
>
  Start Survey →
        </button>
      </div>
    </div>
  )
}