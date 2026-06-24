import { useState } from 'react'

const mockRecommendations = [
  {
    id: 1,
    title: 'Enable Two-Factor Authentication',
    description: 'Add 2FA to all your important accounts especially email, banking, and social media. This single action dramatically reduces your risk of account takeover.',
    impact: 'High',
    estimatedScoreReduction: 18,
    category: 'Security',
    icon: '🔐',
    steps: [
      'Go to your Google account settings',
      'Navigate to Security → 2-Step Verification',
      'Follow the setup instructions',
      'Repeat for Instagram, Twitter, and banking apps'
    ],
    completed: false,
  },
  {
    id: 2,
    title: 'Use a Password Manager',
    description: 'Stop reusing passwords across platforms. A password manager generates and stores unique strong passwords for every site you use.',
    impact: 'High',
    estimatedScoreReduction: 15,
    category: 'Security',
    icon: '🗝️',
    steps: [
      'Download Bitwarden (free) or 1Password',
      'Create your master password — make it strong',
      'Import your existing passwords',
      'Update weak/reused passwords one by one'
    ],
    completed: false,
  },
  {
    id: 3,
    title: 'Set Social Media Profiles to Private',
    description: 'Public profiles allow anyone including data brokers and scammers to build a profile about you. Switch your accounts to private immediately.',
    impact: 'High',
    estimatedScoreReduction: 14,
    category: 'Social Media',
    icon: '🔒',
    steps: [
      'Instagram: Settings → Privacy → Private Account',
      'Twitter/X: Settings → Privacy → Protect your posts',
      'Facebook: Settings → Privacy → Who can see your posts',
      'Review tagged photos and location check-ins'
    ],
    completed: false,
  },
  {
    id: 4,
    title: 'Review App Permissions',
    description: 'Many apps collect far more data than they need. Review which apps have access to your location, microphone, camera, and contacts.',
    impact: 'Medium',
    estimatedScoreReduction: 10,
    category: 'Platform Privacy',
    icon: '📱',
    steps: [
      'Android: Settings → Apps → Permissions',
      'Revoke location access from apps that don\'t need it',
      'Disable microphone access for non-communication apps',
      'Check which apps have access to your contacts'
    ],
    completed: false,
  },
  {
    id: 5,
    title: 'Use a Separate Email for Sign-ups',
    description: 'Using one email for everything links all your online activity together. Create a separate email for newsletters, shopping, and sign-ups.',
    impact: 'Medium',
    estimatedScoreReduction: 9,
    category: 'Email',
    icon: '📧',
    steps: [
      'Create a new Gmail or ProtonMail account',
      'Use it exclusively for non-essential sign-ups',
      'Keep your primary email for banking and important accounts',
      'Unsubscribe from unnecessary newsletters'
    ],
    completed: false,
  },
  {
    id: 6,
    title: 'Clear Cookies & Browser History Regularly',
    description: 'Cookies allow websites and advertisers to track you across the web. Clearing them regularly limits how much of your browsing behaviour is tracked.',
    impact: 'Low',
    estimatedScoreReduction: 6,
    category: 'Browsing',
    icon: '🌐',
    steps: [
      'Chrome: Settings → Privacy → Clear browsing data',
      'Set browser to clear cookies on close',
      'Install uBlock Origin extension to block trackers',
      'Consider using Firefox with Enhanced Tracking Protection'
    ],
    completed: false,
  },
]

const impactColors = {
  High: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
  Medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  Low: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
}

export default function Recommendations() {
  const [recs, setRecs] = useState(mockRecommendations)
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('All')

  const toggleComplete = (id) => {
    setRecs(recs.map(r => r.id === id ? { ...r, completed: !r.completed } : r))
  }

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id)
  }

  const completed = recs.filter(r => r.completed).length
  const totalReduction = recs
    .filter(r => r.completed)
    .reduce((sum, r) => sum + r.estimatedScoreReduction, 0)

  const categories = ['All', 'Security', 'Social Media', 'Email', 'Browsing', 'Platform Privacy']
  const filtered = filter === 'All' ? recs : recs.filter(r => r.category === filter)

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">Privacy Recommendations</h1>
          <p className="text-gray-400">Personalised actions to reduce your digital footprint risk.</p>
        </div>

        {/* Progress Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Checklist Progress</p>
              <p className="text-white text-2xl font-bold">{completed}/{recs.length} completed</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">Estimated Score Reduction</p>
              <p className="text-emerald-400 text-2xl font-bold">-{totalReduction} pts</p>
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className="bg-violet-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completed / recs.length) * 100}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs mt-2">
            {completed === 0
              ? 'Start completing actions to improve your privacy score'
              : completed === recs.length
              ? '🎉 All actions completed! Your privacy is significantly improved.'
              : `Keep going — ${recs.length - completed} actions remaining`}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
                ${filter === cat
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Recommendations list */}
        <div className="space-y-4">
          {filtered.map((rec) => {
            const impact = impactColors[rec.impact]
            const isExpanded = expanded === rec.id

            return (
              <div
                key={rec.id}
                className={`bg-gray-900 border rounded-2xl overflow-hidden transition-all duration-200
                  ${rec.completed ? 'border-emerald-500/30 opacity-75' : 'border-gray-800'}`}
              >
                {/* Card Header */}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleComplete(rec.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors
                        ${rec.completed
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-gray-600 hover:border-violet-500'
                        }`}
                    >
                      {rec.completed && <span className="text-white text-xs">✓</span>}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-lg">{rec.icon}</span>
                        <h3 className={`text-white font-semibold ${rec.completed ? 'line-through text-gray-500' : ''}`}>
                          {rec.title}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{rec.description}</p>

                      {/* Tags */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${impact.bg} ${impact.border} ${impact.text}`}>
                          {rec.impact} Impact
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400">
                          {rec.category}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet-600/10 border border-violet-500/30 text-violet-400">
                          -{rec.estimatedScoreReduction} pts
                        </span>
                      </div>
                    </div>

                    {/* Expand button */}
                    <button
                      onClick={() => toggleExpand(rec.id)}
                      className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                  </div>
                </div>

                {/* Expanded steps */}
                {isExpanded && (
                  <div className="border-t border-gray-800 px-5 py-4 bg-gray-800/50">
                    <p className="text-gray-300 text-sm font-semibold mb-3">How to do it:</p>
                    <div className="space-y-2">
                      {rec.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-gray-400 text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}