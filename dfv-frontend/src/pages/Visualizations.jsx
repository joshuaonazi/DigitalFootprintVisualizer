import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts'

const mockRiskData = {
  overallScore: 72,
  riskTier: 'High',
  dimensions: {
    socialMedia: { score: 85, topRisk: 'Public profile with frequent location sharing' },
    email: { score: 60, topRisk: 'Single email used for all sign-ups' },
    browsing: { score: 70, topRisk: 'Cookies always accepted without review' },
    security: { score: 78, topRisk: 'Password reuse across multiple platforms' },
    platformPrivacy: { score: 65, topRisk: 'App permissions never reviewed' },
  },
  topThreats: [
    'High social media exposure enables targeted phishing attacks',
    'Password reuse creates credential stuffing vulnerability',
    'Unrestricted cookie acceptance enables cross-site tracking',
  ]
}

const COLORS = ['#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626']

const tierColor = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444',
}

export default function Visualizations() {
  const result = (() => {
    try {
      const stored = localStorage.getItem('riskResult')
      return stored ? JSON.parse(stored) : mockRiskData
    } catch { return mockRiskData }
  })()

  const radarData = [
    { subject: 'Social Media', score: result.dimensions.socialMedia.score },
    { subject: 'Email', score: result.dimensions.email.score },
    { subject: 'Browsing', score: result.dimensions.browsing.score },
    { subject: 'Security', score: result.dimensions.security.score },
    { subject: 'Platform Privacy', score: result.dimensions.platformPrivacy.score },
  ]

  const barData = Object.entries(result.dimensions).map(([key, val]) => ({
    name: key.replace(/([A-Z])/g, ' $1').trim(),
    score: val.score,
  }))

  const pieData = [
    { name: 'Social Media', value: result.dimensions.socialMedia.score },
    { name: 'Email', value: result.dimensions.email.score },
    { name: 'Browsing', value: result.dimensions.browsing.score },
    { name: 'Security', value: result.dimensions.security.score },
    { name: 'Platform Privacy', value: result.dimensions.platformPrivacy.score },
  ]

  const trendData = [
    { session: 'Session 1', score: result.overallScore },
    { session: 'Session 2', score: result.overallScore },
  ]

  const color = tierColor[result.riskTier] || '#f97316'

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">
            Visualizations
          </h1>
          <p className="text-gray-400">
            Interactive breakdown of your digital footprint exposure.
          </p>
        </div>

        {/* Overall Score Banner */}
        <div
          className="rounded-2xl p-6 mb-8 flex items-center justify-between"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}40` }}
        >
          <div>
            <p className="text-gray-400 text-sm mb-1">Overall Privacy Risk Score</p>
            <p className="text-white text-5xl font-black">{result.overallScore}</p>
            <span
              className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
            >
              {result.riskTier} Risk
            </span>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-gray-500 text-sm">Top Threat</p>
            <p className="text-gray-300 text-sm max-w-xs text-right">
              {result.topThreats[0]}
            </p>
          </div>
        </div>

        {/* Grid of charts */}
        <div className="grid grid-cols-1 gap-6">

          {/* Radar Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-1">
              🕸️ Risk Radar
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Exposure level across all five footprint dimensions.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Radar
                  name="Risk Score"
                  dataKey="score"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-1">
              📊 Dimension Scores
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Side-by-side comparison of risk per category.
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.score > 70 ? '#ef4444' :
                        entry.score > 40 ? '#f59e0b' : '#10b981'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-1">
              🥧 Risk Distribution
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Proportion of total risk contributed by each dimension.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 min-w-max">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-400 text-sm">{entry.name}</span>
                    <span className="text-white text-sm font-bold ml-auto pl-4">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Progress Bars */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-1">
              📉 Detailed Breakdown
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Per-dimension risk scores with top identified risk.
            </p>
            <div className="space-y-5">
              {Object.entries(result.dimensions).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300 text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{
                        color: val.score > 70 ? '#ef4444' :
                               val.score > 40 ? '#f59e0b' : '#10b981'
                      }}
                    >
                      {val.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5 mb-1">
                    <div
                      className="h-2.5 rounded-full transition-all duration-700"
                      style={{
                        width: `${val.score}%`,
                        backgroundColor: val.score > 70 ? '#ef4444' :
                                         val.score > 40 ? '#f59e0b' : '#10b981'
                      }}
                    />
                  </div>
                  <p className="text-gray-600 text-xs">{val.topRisk}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Trend */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-1">
              📈 Risk Trend
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Your risk score over time. Retake the survey to track improvement.
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis
                  dataKey="session"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={color}
                  strokeWidth={3}
                  dot={{ fill: color, strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  )
}