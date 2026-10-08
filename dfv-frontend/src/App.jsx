import Quiz from './pages/Quiz'
import AIAssistant from './pages/AIAssistant'
import Visualizations from './pages/Visualizations'
import Recommendations from './pages/Recommendations'
import RiskScore from './pages/RiskScore'
import Survey from './pages/Survey'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/risk" element={<RiskScore />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/visualizations" element={<Visualizations />} />
        <Route path="/assistant" element={<AIAssistant />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App