import MyReport from './MyReport'
import Quiz from './Quiz'
import AIAssistant from './AIAssistant'
import Visualizations from './Visualizations'
import Recommendations from './Recommendations'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConsentModal from '../components/ConsentModal'

const navItems = [
  { icon: '📊', label: 'Overview', id: 'overview' },
  { icon: '📝', label: 'My Survey', id: 'survey' },
  { icon: '📝', label: 'Awareness Quiz', id: 'quiz' },
  { icon: '🛡️', label: 'Risk Score', id: 'risk' },
  { icon: '📈', label: 'Visualizations', id: 'visualizations' },
  { icon: '💡', label: 'Recommendations', id: 'recommendations' },
  { icon: '🤖', label: 'AI Assistant', id: 'assistant' },
  { icon: '📄', label: 'My Report', id: 'report' },
]

export default function Dashboard() {
  const [consentGiven, setConsentGiven] = useState(
  localStorage.getItem('consentGiven') === 'true'
  )
  const [showModal, setShowModal] = useState(
    localStorage.getItem('consentGiven') !== 'true'
  )
  const [activePage, setActivePage] = useState('overview')
  const navigate = useNavigate()

  const handleAccept = () => {
  localStorage.setItem('consentGiven', 'true')
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
                  onClick={() => {
                    if (item.id === 'survey') {
                      window.location.href = '/survey'
                    } else if (item.id === 'risk') {
                      window.location.href = '/risk'
                    } else {
                      setActivePage(item.id)
                    }
                  }}
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
              {activePage === 'overview' && <OverviewPage />}
              {activePage === 'recommendations' && <Recommendations />}
              {activePage === 'visualizations' && <Visualizations />}
              {activePage === 'assistant' && <AIAssistant />}
              {activePage === 'quiz' && <Quiz />}
              {activePage === 'report' && <MyReport />}
              {activePage !== 'overview' &&
              activePage !== 'recommendations' &&
              activePage !== 'visualizations' &&
              activePage !== 'assistant' &&
              activePage !== 'quiz' && 
              activePage !== 'report' && (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <p className="text-4xl mb-3">🚧</p>
                    <p className="text-gray-400">This section is coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  )
}

function OverviewPage() {
  const riskResult = (() => {
    try {
      const stored = localStorage.getItem('riskResult')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })()

  const quizScore = (() => {
    try {
      const stored = localStorage.getItem('quizScore')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })()

  const tierColors = {
    Low: 'text-emerald-400',
    Medium: 'text-amber-400',
    High: 'text-orange-400',
    Critical: 'text-red-400',
  }

  const stats = [
    {
      label: 'Risk Score',
      value: riskResult ? riskResult.overallScore : '—',
      sub: riskResult ? `${riskResult.riskTier} Risk Tier` : 'Complete survey to calculate',
      color: riskResult ? tierColors[riskResult.riskTier] : 'text-white',
    },
    {
      label: 'Highest Risk',
      value: riskResult ? (() => {
        const dims = riskResult.dimensions
        const highest = Object.entries(dims).sort((a, b) => b[1].score - a[1].score)[0]
        return highest[0].replace(/([A-Z])/g, ' $1').trim()
      })() : '—',
      sub: riskResult ? 'Your most exposed dimension' : 'Not yet assessed',
      color: 'text-white',
    },
    {
      label: 'Recommendations',
      value: '6',
      sub: riskResult ? 'Personalised actions available' : 'Complete survey first',
      color: 'text-violet-400',
    },
    {
      label: 'Awareness Score',
      value: quizScore ? `${quizScore.percentage}%` : '—',
      sub: quizScore ? `${quizScore.score}/${quizScore.total} correct` : 'Take the quiz to find out',
      color: quizScore ? 'text-emerald-400' : 'text-white',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-white text-2xl font-bold mb-1">Your Privacy Overview</h3>
        <p className="text-gray-400">
          {riskResult
            ? 'Your digital footprint has been analysed. See your results below.'
            : 'Complete the survey to see your digital footprint analysis.'}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
            <p className={`text-4xl font-bold mb-1 ${stat.color}`}>{stat.value}</p>
            <p className="text-gray-600 text-xs">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Risk summary if survey done */}
      {riskResult && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
          <h4 className="text-white font-semibold mb-2">📋 AI Summary</h4>
          <p className="text-gray-400 text-sm leading-relaxed">{riskResult.summary}</p>
        </div>
      )}

      {/* CTA */}
      <div className="bg-violet-600/10 border border-violet-500/30 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h4 className="text-white font-semibold mb-1">
            {riskResult ? 'View your full analysis' : 'Ready to see your footprint?'}
          </h4>
          <p className="text-gray-400 text-sm">
            {riskResult
              ? 'Explore your visualizations and recommendations.'
              : 'Take the 5-minute survey to get your full risk analysis.'}
          </p>
        </div>
        <button
          onClick={() => window.location.href = riskResult ? '/risk' : '/survey'}
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap ml-4"
        >
          {riskResult ? 'View Results →' : 'Start Survey →'}
        </button>
      </div>
    </div>
  )
}