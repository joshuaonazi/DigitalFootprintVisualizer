import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'

const tierColors = {
  Low: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', hex: '#10b981' },
  Medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', hex: '#f59e0b' },
  High: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', hex: '#f97316' },
  Critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', hex: '#ef4444' },
}

export default function RiskScore() {
  const [result, setResult] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('riskResult')
    if (stored) setResult(JSON.parse(stored))
  }, [])

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No risk data yet.</p>
          <button
            onClick={() => navigate('/survey')}
            className="bg-violet-600 text-white px-6 py-3 rounded-xl"
          >
            Take the Survey
          </button>
        </div>
      </div>
    )
  }

  const tier = tierColors[result.riskTier] || tierColors.Medium
  const radarData = [
    { subject: 'Social Media', score: result.dimensions.socialMedia.score },
    { subject: 'Email', score: result.dimensions.email.score },
    { subject: 'Browsing', score: result.dimensions.browsing.score },
    { subject: 'Security', score: result.dimensions.security.score },
    { subject: 'Platform Privacy', score: result.dimensions.platformPrivacy.score },
  ]

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-white text-3xl font-bold mb-2">Your Risk Analysis</h1>
          <p className="text-gray-400">Your personalised privacy analysis</p>
        </div>

        {/* Overall Score Card */}
        <div className={`rounded-2xl border p-8 mb-6 text-center ${tier.bg} ${tier.border}`}>
          <p className="text-gray-400 text-sm mb-2">Overall Privacy Risk Score</p>
          <div className="text-8xl font-black text-white mb-3">{result.overallScore}</div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${tier.bg} ${tier.border} ${tier.text}`}>
            {result.riskTier === 'Low' && '🟢'}
            {result.riskTier === 'Medium' && '🟡'}
            {result.riskTier === 'High' && '🟠'}
            {result.riskTier === 'Critical' && '🔴'}
            {result.riskTier} Risk
          </div>
          <p className="text-gray-300 text-sm mt-4 max-w-xl mx-auto leading-relaxed">
            {result.summary}
          </p>
        </div>

        {/* Radar Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold text-lg mb-4">Risk by Dimension</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Radar
                name="Risk Score"
                dataKey="score"
                stroke={tier.hex}
                fill={tier.hex}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dimension Breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold text-lg mb-4">Dimension Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(result.dimensions).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300 text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-white text-sm font-bold">{val.score}/100</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 mb-1">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${val.score}%`,
                      backgroundColor: val.score > 70 ? '#ef4444' : val.score > 40 ? '#f59e0b' : '#10b981'
                    }}
                  />
                </div>
                <p className="text-gray-500 text-xs">{val.topRisk}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Threats */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-bold text-lg mb-4">⚠️ Top Threats Identified</h2>
          <div className="space-y-3">
            {result.topThreats.map((threat, i) => (
              <div key={i} className="flex items-start gap-3 bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                <span className="text-red-400 font-bold text-sm mt-0.5">{i + 1}</span>
                <p className="text-gray-300 text-sm">{threat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/survey')}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Retake Survey
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            View Dashboard →
          </button>
        </div>
      </div>
    </div>
  )
}