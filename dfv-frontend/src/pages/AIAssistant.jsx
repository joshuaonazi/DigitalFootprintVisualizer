import { useState, useRef, useEffect } from 'react'
import { chatWithAssistant } from '../services/claudeService'

const suggestedQuestions = [
  'Why is my social media score so high?',
  'What is a passive digital footprint?',
  'How do I enable 2FA on Google?',
  'What does my risk tier mean?',
  'How can I reduce my overall score?',
  'Is my data safe on WhatsApp?',
]

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: null, // will be set after riskProfile loads
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const riskProfile = (() => {
    try {
      const stored = localStorage.getItem('riskResult')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })()

  // Set personalized welcome message based on risk profile
  useEffect(() => {
    const welcome = riskProfile
      ? `Hi! I'm your Privacy Assistant 🔐 I can see your overall risk score is ${riskProfile.overallScore}/100 (${riskProfile.riskTier} Risk), with your highest exposure in ${Object.entries(riskProfile.dimensions).sort((a,b) => b[1].score - a[1].score)[0][0].replace(/([A-Z])/g, ' $1').trim()}. Ask me anything about your digital footprint and I'll give you personalised advice!`
      : "Hi! I'm your Privacy Assistant 🔐 I'm here to help you understand your digital footprint. Complete the survey first to get personalised advice based on your specific risk profile!"
    setMessages([{
      id: 1,
      role: 'assistant',
      text: welcome,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    if (!text.trim()) return

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const allMessages = [...messages, userMsg]
      const response = await chatWithAssistant(allMessages, riskProfile)

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'Sorry, I encountered an error. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 73px)' }}>

      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Privacy Assistant</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-gray-500 text-xs">
                  {riskProfile
                    ? `Personalised for your ${riskProfile.riskTier} Risk profile`
                    : 'Complete survey for personalised advice'}
                </p>
              </div>
            </div>
          </div>

          {/* Risk score badge */}
          {riskProfile && (
            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border
              ${riskProfile.riskTier === 'Low' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                riskProfile.riskTier === 'Medium' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                riskProfile.riskTier === 'High' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              Score: {riskProfile.overallScore} · {riskProfile.riskTier} Risk
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-1
                ${msg.role === 'assistant'
                  ? 'bg-violet-600/20 border border-violet-500/30'
                  : 'bg-gray-700'}`}>
                <span className="text-xs">{msg.role === 'assistant' ? '🤖' : '👤'}</span>
              </div>
              <div>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                  ${msg.role === 'assistant'
                    ? 'bg-gray-800 text-gray-200 rounded-tl-sm'
                    : 'bg-violet-600 text-white rounded-tr-sm'}`}>
                  {msg.text}
                </div>
                <p className={`text-xs text-gray-600 mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                <span className="text-xs">🤖</span>
              </div>
              <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1 items-center h-4">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-6 pb-3 flex-shrink-0">
          <p className="text-gray-600 text-xs mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs border border-gray-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 pb-6 pt-3 border-t border-gray-800 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={riskProfile ? `Ask about your ${riskProfile.riskTier} Risk profile...` : 'Ask about digital privacy...'}
            disabled={loading}
            className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-violet-500 placeholder-gray-600 text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-medium transition-colors text-sm"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}