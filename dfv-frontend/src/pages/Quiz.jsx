import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const questions = [
  {
    id: 1,
    question: 'What is a passive digital footprint?',
    options: [
      'Data you deliberately post on social media',
      'Data collected about you without your direct input',
      'Emails you send to friends',
      'Files you upload to Google Drive',
    ],
    correct: 1,
    explanation: 'Passive footprints are data trails collected automatically by servers and platforms without you actively providing them — such as IP addresses, cookies, and location metadata.',
  },
  {
    id: 2,
    question: 'Which of the following is the MOST secure password practice?',
    options: [
      'Using the same strong password everywhere',
      'Using your name and birth year',
      'Using a unique password for every account with a password manager',
      'Writing passwords in a notebook',
    ],
    correct: 2,
    explanation: 'A unique password per account managed by a password manager is the gold standard. Reusing even a strong password means one breach compromises all your accounts.',
  },
  {
    id: 3,
    question: 'What does Two-Factor Authentication (2FA) protect against?',
    options: [
      'Viruses and malware on your device',
      'Unauthorized account access even if your password is stolen',
      'Phishing websites stealing your data',
      'Cookies tracking your browsing',
    ],
    correct: 1,
    explanation: '2FA adds a second verification step beyond your password. Even if an attacker steals your password, they cannot access your account without the second factor.',
  },
  {
    id: 4,
    question: 'When you accept all cookies on a website, what are you allowing?',
    options: [
      'The website to send you physical mail',
      'The website to track your behavior across the internet',
      'The website to access your camera',
      'The website to download files to your device',
    ],
    correct: 1,
    explanation: 'Accepting all cookies — especially third-party tracking cookies — allows advertising networks to build a detailed profile of your browsing behavior across many different websites.',
  },
  {
    id: 5,
    question: 'Which of the following is an example of an ACTIVE digital footprint?',
    options: [
      'Your IP address being logged by a website',
      'A cookie tracking your shopping habits',
      'A photo you post on Instagram',
      'Your device fingerprint recorded by a browser',
    ],
    correct: 2,
    explanation: 'Active footprints are intentional disclosures — things you consciously post, share, or submit online. A photo you post on Instagram is a deliberate action you took.',
  },
  {
    id: 6,
    question: 'What is the "privacy paradox"?',
    options: [
      'When a website has too many privacy settings',
      'When people say they care about privacy but behave in ways that undermine it',
      'When two privacy laws contradict each other',
      'When private browsing mode fails to protect your data',
    ],
    correct: 1,
    explanation: 'The privacy paradox describes the well-documented gap between individuals expressing concern about their privacy and then engaging in high-disclosure, low-protection behaviors in practice.',
  },
  {
    id: 7,
    question: 'Which action MOST effectively reduces your social media footprint?',
    options: [
      'Using a nickname instead of your real name',
      'Setting your profile to private and reviewing app permissions',
      'Only posting photos without text',
      'Logging out after each session',
    ],
    correct: 1,
    explanation: 'Setting your profile to private limits who can see your content, while reviewing app permissions stops third-party apps from harvesting your data in the background.',
  },
  {
    id: 8,
    question: 'What does a data broker do with your digital footprint?',
    options: [
      'Helps you delete your online data',
      'Collects and sells your personal data to advertisers and other companies',
      'Encrypts your browsing history',
      'Reports cybercriminals to the police',
    ],
    correct: 1,
    explanation: 'Data brokers aggregate personal information from public records, social media, purchase histories, and tracking cookies, then sell comprehensive profiles to advertisers, employers, and other buyers.',
  },
  {
    id: 9,
    question: 'Which of the following best describes end-to-end encryption?',
    options: [
      'Only the sender and recipient can read the message',
      'The message is encrypted only on the sender\'s device',
      'The platform provider can read messages for safety',
      'Messages are deleted after 24 hours',
    ],
    correct: 0,
    explanation: 'End-to-end encryption ensures that messages are encrypted on the sender\'s device and can only be decrypted by the intended recipient — not even the platform provider can read them.',
  },
  {
    id: 10,
    question: 'Under the Nigeria Data Protection Act (NDPA) 2023, what right do citizens have regarding their personal data?',
    options: [
      'The right to sell their data to the government',
      'The right to access, correct, and request deletion of their personal data',
      'The right to access other people\'s data',
      'The right to opt out of all internet services',
    ],
    correct: 1,
    explanation: 'The NDPA 2023 grants Nigerian citizens rights over their personal data including the right to access data held about them, correct inaccuracies, and request deletion — aligning Nigeria with global data protection standards.',
  },
]

export default function Quiz() {
  const [phase, setPhase] = useState('intro') // intro | quiz | results
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [showExplanation, setShowExplanation] = useState(false)
  const navigate = useNavigate()

  const handleAnswer = (index) => {
    if (selected !== null) return
    setSelected(index)
    setShowExplanation(true)
  }

  const handleNext = () => {
    const newAnswers = [...answers, {
      question: questions[currentQ].question,
      selected,
      correct: questions[currentQ].correct,
      isCorrect: selected === questions[currentQ].correct,
    }]
    setAnswers(newAnswers)
    setSelected(null)
    setShowExplanation(false)

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1)
    } else {
      const score = newAnswers.filter(a => a.isCorrect).length
      localStorage.setItem('quizScore', JSON.stringify({
        score,
        total: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        answers: newAnswers,
      }))
      setPhase('results')
    }
  }

  const score = answers.filter(a => a.isCorrect).length
  const percentage = Math.round((score / questions.length) * 100)

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-lg w-full">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📝</span>
            </div>
            <h1 className="text-white text-2xl font-bold mb-2">
              Privacy Awareness Quiz
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              Test your digital privacy knowledge with 10 questions. This helps measure how much your awareness improves after using the DFV dashboard.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: '❓', label: '10 Questions' },
                { icon: '⏱️', label: '~5 Minutes' },
                { icon: '📊', label: 'Instant Score' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-3 text-center">
                  <p className="text-2xl mb-1">{item.icon}</p>
                  <p className="text-gray-400 text-xs">{item.label}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPhase('quiz')}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Start Quiz →
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'results') {
    const grade =
      percentage >= 80 ? { label: 'Excellent', color: '#10b981', icon: '🏆' } :
      percentage >= 60 ? { label: 'Good', color: '#f59e0b', icon: '👍' } :
      percentage >= 40 ? { label: 'Fair', color: '#f97316', icon: '📚' } :
                         { label: 'Needs Work', color: '#ef4444', icon: '💪' }

    return (
      <div className="min-h-screen bg-gray-950 px-4 py-10">
        <div className="max-w-lg mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center mb-6">
            <p className="text-5xl mb-4">{grade.icon}</p>
            <h1 className="text-white text-2xl font-bold mb-1">Quiz Complete!</h1>
            <p className="text-gray-400 text-sm mb-6">Here's how you scored</p>
            <div
              className="rounded-2xl p-6 mb-4"
              style={{ backgroundColor: `${grade.color}15`, border: `1px solid ${grade.color}40` }}
            >
              <p className="text-6xl font-black mb-1" style={{ color: grade.color }}>
                {percentage}%
              </p>
              <p className="text-white font-semibold">{grade.label}</p>
              <p className="text-gray-400 text-sm mt-1">
                {score} out of {questions.length} correct
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              {percentage >= 80
                ? 'Outstanding privacy awareness! Keep up the great work.'
                : percentage >= 60
                ? 'Good foundation. Review the explanations to strengthen your knowledge.'
                : 'Keep learning! The DFV dashboard and recommendations will help improve your privacy knowledge.'}
            </p>
          </div>

          {/* Answer Review */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <h2 className="text-white font-bold mb-4">Answer Review</h2>
            <div className="space-y-3">
              {answers.map((ans, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-xl border
                    ${ans.isCorrect
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-red-500/5 border-red-500/20'
                    }`}
                >
                  <span className="text-lg flex-shrink-0">
                    {ans.isCorrect ? '✅' : '❌'}
                  </span>
                  <p className="text-gray-300 text-sm">{ans.question}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setPhase('intro')
                setCurrentQ(0)
                setAnswers([])
                setSelected(null)
              }}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[currentQ]

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">
              Question {currentQ + 1} of {questions.length}
            </span>
            <span className="text-violet-400 text-sm font-medium">
              {answers.filter(a => a.isCorrect).length} correct so far
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-violet-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQ) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-4">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">
            Question {currentQ + 1}
          </p>
          <h2 className="text-white text-xl font-bold mb-6 leading-snug">
            {q.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((option, i) => {
              let style = 'bg-gray-800 border-gray-700 text-gray-300 hover:border-violet-500 hover:text-white'
              if (selected !== null) {
                if (i === q.correct) {
                  style = 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                } else if (i === selected && selected !== q.correct) {
                  style = 'bg-red-500/10 border-red-500 text-red-300'
                } else {
                  style = 'bg-gray-800 border-gray-700 text-gray-500 opacity-50'
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${style}`}
                >
                  <span className="font-bold mr-2 opacity-60">
                    {['A', 'B', 'C', 'D'][i]}.
                  </span>
                  {option}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-4 p-4 rounded-xl bg-gray-800 border border-gray-700">
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1">
                {selected === q.correct ? '✅ Correct!' : '❌ Incorrect'}
              </p>
              <p className="text-gray-300 text-sm">{q.explanation}</p>
            </div>
          )}
        </div>

        {/* Next Button */}
        {selected !== null && (
          <button
            onClick={handleNext}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {currentQ + 1 < questions.length ? 'Next Question →' : 'See Results →'}
          </button>
        )}
      </div>
    </div>
  )
}