import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const demoProfiles = [
  {
    label: 'Low Risk Student',
    score: 28,
    tier: 'Low',
    email: 'demo.low@ui.edu.ng',
    color: 'emerald',
    icon: '🟢',
    data: {
      overallScore: 28,
      riskTier: 'Low',
      dimensions: {
        socialMedia: { score: 22, topRisk: 'Limited public sharing with strong privacy settings in place' },
        email: { score: 18, topRisk: 'Uses separate emails for different purposes effectively' },
        browsing: { score: 35, topRisk: 'Occasionally accepts cookies without reviewing consent notices' },
        security: { score: 30, topRisk: 'Good password practices but 2FA not enabled on all accounts' },
        platformPrivacy: { score: 25, topRisk: 'App permissions reviewed regularly with most access denied' },
      },
      topThreats: [
        'Occasional cookie acceptance without review allows some passive tracking by advertisers',
        'Two-factor authentication not consistently enabled across all platforms',
        'Minor browsing habit improvements could further reduce passive footprint exposure',
      ],
      summary: 'Your digital footprint is well-managed and places you in the Low risk tier — you demonstrate strong privacy awareness across most dimensions. Minor improvements to browsing habits and 2FA adoption would make your profile near-optimal.'
    }
  },
  {
    label: 'High Risk Student',
    score: 74,
    tier: 'High',
    email: 'demo.high@ui.edu.ng',
    color: 'orange',
    icon: '🟠',
    data: {
      overallScore: 74,
      riskTier: 'High',
      dimensions: {
        socialMedia: { score: 88, topRisk: 'Public profile with frequent location sharing and daily activity posts' },
        email: { score: 62, topRisk: 'Single email address used for all platform registrations' },
        browsing: { score: 71, topRisk: 'Cookies always accepted without review enabling cross-site tracking' },
        security: { score: 79, topRisk: 'Password reuse across multiple platforms with no 2FA enabled' },
        platformPrivacy: { score: 65, topRisk: 'App permissions never reviewed — location and microphone access granted broadly' },
      },
      topThreats: [
        'High social media exposure enables targeted phishing and social engineering attacks',
        'Password reuse across platforms means one data breach compromises all accounts simultaneously',
        'Unrestricted cookie acceptance allows advertising networks to build a detailed behavioral profile',
      ],
      summary: 'Your digital footprint places you in the High risk tier, with social media behavior and security practices representing your most critical exposure points. Immediate action on two-factor authentication and privacy settings could reduce your overall score by approximately 25 points.'
    }
  },
  {
    label: 'Critical Risk Student',
    score: 91,
    tier: 'Critical',
    email: 'demo.critical@ui.edu.ng',
    color: 'red',
    icon: '🔴',
    data: {
      overallScore: 91,
      riskTier: 'Critical',
      dimensions: {
        socialMedia: { score: 96, topRisk: 'All profiles public, posts location data daily, phone number visible on profiles' },
        email: { score: 88, topRisk: 'Real full name in email address, same email for banking and social media' },
        browsing: { score: 92, topRisk: 'Always accepts all cookies, never uses private browsing, location always shared' },
        security: { score: 94, topRisk: 'Same weak password across all platforms, no 2FA, previously hacked twice' },
        platformPrivacy: { score: 87, topRisk: 'All app permissions granted including contacts, microphone, and location at all times' },
      },
      topThreats: [
        'Combination of public profiles and location sharing creates a real-time trackable personal profile exploitable for stalking and fraud',
        'Reuse of weak passwords across banking and social platforms represents an imminent credential theft risk',
        'Granting all app permissions including contacts exposes the student\'s entire social network to third-party data harvesting',
      ],
      summary: 'Your digital footprint places you in the Critical risk tier — the highest possible classification. Your current digital habits create serious, immediate vulnerabilities across every dimension assessed. Urgent action is required starting with password security and social media privacy settings.'
    }
  }
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showDemo, setShowDemo] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (email && password) {
      navigate('/dashboard')
    }
  }

  const loadDemoProfile = (profile) => {
    localStorage.setItem('riskResult', JSON.stringify(profile.data))
    localStorage.setItem('consentGiven', 'true')
    localStorage.removeItem('generatedReport')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-600 mb-4">
            <span className="text-white text-2xl">🔍</span>
          </div>
          <h1 className="text-white text-3xl font-bold">DFV</h1>
          <p className="text-gray-400 mt-1">Digital Footprint Visualizer</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800 mb-4">
          <h2 className="text-white text-xl font-semibold mb-6">Welcome back</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                required
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-violet-500 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-violet-500 placeholder-gray-600"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
            >
              Sign In
            </button>
          </form>
          <p className="text-gray-500 text-sm text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300">
              Register here
            </Link>
          </p>
        </div>

        {/* Demo Profiles */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <span className="text-gray-300 text-sm font-medium">Defense Demo Profiles</span>
            </div>
            <span className="text-gray-500 text-xs">{showDemo ? '▲ Hide' : '▼ Show'}</span>
          </button>

          {showDemo && (
            <div className="px-4 pb-4 space-y-2 border-t border-gray-800 pt-3">
              <p className="text-gray-600 text-xs px-2 mb-3">
                Click any profile to instantly load pre-built demo data — no survey needed.
              </p>
              {demoProfiles.map((profile, i) => (
                <button
                  key={i}
                  onClick={() => loadDemoProfile(profile)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors
                    ${profile.color === 'emerald' ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10' :
                      profile.color === 'orange' ? 'bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10' :
                      'bg-red-500/5 border-red-500/20 hover:bg-red-500/10'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{profile.icon}</span>
                    <div className="text-left">
                      <p className={`text-sm font-semibold
                        ${profile.color === 'emerald' ? 'text-emerald-400' :
                          profile.color === 'orange' ? 'text-orange-400' : 'text-red-400'}`}>
                        {profile.label}
                      </p>
                      <p className="text-gray-500 text-xs">{profile.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-black
                      ${profile.color === 'emerald' ? 'text-emerald-400' :
                        profile.color === 'orange' ? 'text-orange-400' : 'text-red-400'}`}>
                      {profile.score}
                    </p>
                    <p className="text-gray-600 text-xs">{profile.tier} Risk</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}