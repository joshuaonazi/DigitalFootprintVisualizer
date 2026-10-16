import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Survey from './pages/Survey'
import RiskScore from './pages/RiskScore'
import Quiz from './pages/Quiz'

function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  const phases = [
    'Initializing DFV...',
    'Loading privacy modules...',
    'Preparing visualizations...',
    'Ready!',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 400)
          return 100
        }
        return prev + 2
      })
    }, 40)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress < 30) setPhase(0)
    else if (progress < 60) setPhase(1)
    else if (progress < 90) setPhase(2)
    else setPhase(3)
  }, [progress])

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-800/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-violet-600 flex items-center justify-center shadow-2xl shadow-violet-600/40">
            <span className="text-4xl">🔍</span>
          </div>
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-violet-400/30 animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        {/* Title */}
        <h1 className="text-white text-4xl font-black mb-2 tracking-tight">DFV</h1>
        <p className="text-gray-400 text-lg mb-2">Digital Footprint Visualizer</p>
        <p className="text-gray-600 text-sm mb-12">University of Ibadan · M.Sc. Cybersecurity</p>

        {/* Progress bar */}
        <div className="w-72 mb-4">
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div
              className="bg-violet-600 h-1.5 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Phase text */}
        <p className="text-gray-500 text-sm h-5 transition-all duration-300">
          {phases[phase]}
        </p>

        {/* Progress percentage */}
        <p className="text-gray-700 text-xs mt-2">{progress}%</p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-gray-700 text-xs">
          Powered by AI · Built with React & Node.js
        </p>
      </div>
    </div>
  )
}

function App() {
  const [loading, setLoading] = useState(true)

  // Only show splash on first visit per session
  useEffect(() => {
    const seen = sessionStorage.getItem('splashSeen')
    if (seen) setLoading(false)
  }, [])

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashSeen', 'true')
    setLoading(false)
  }

  if (loading) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/risk" element={<RiskScore />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App