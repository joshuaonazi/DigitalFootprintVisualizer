import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyseRisk } from '../services/claudeService'

const steps = [
  'Social Media',
  'Email & Communication',
  'Browsing Habits',
  'Security Practices',
  'Platform Privacy',
]

export default function Survey() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate()

  const updateAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const handleNext = async () => {
  if (currentStep < steps.length - 1) {
    setCurrentStep(currentStep + 1)
  } else {
    setSubmitting(true)
    try {
      const result = await analyseRisk(answers)
      localStorage.setItem('riskResult', JSON.stringify(result))
      localStorage.setItem('surveyAnswers', JSON.stringify(answers))
      navigate('/risk')
    } catch (err) {
      console.error('Claude error:', err)
      alert('Something went wrong. Check your API key in .env')
    } finally {
      setSubmitting(false)
    }
  }
}

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }


  const [submitting, setSubmitting] = useState(false)
  
  const stepComponents = [
    <SocialMediaStep answers={answers} update={updateAnswer} />,
    <EmailStep answers={answers} update={updateAnswer} />,
    <BrowsingStep answers={answers} update={updateAnswer} />,
    <SecurityStep answers={answers} update={updateAnswer} />,
    <PlatformStep answers={answers} update={updateAnswer} />,
  ]

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-600 mb-4">
            <span className="text-white text-xl">🔍</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Digital Footprint Survey</h1>
          <p className="text-gray-400 text-sm mt-1">Help us understand your online habits</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, i) => (
              <span
                key={i}
                className={`hidden text-xs font-medium sm:inline ${i <= currentStep ? 'text-violet-400' : 'text-gray-600'}`}
              >
                {step}
              </span>
            ))}
          </div>
          <p className="mb-2 text-xs font-medium text-violet-400 sm:hidden">
            {steps[currentStep]}
          </p>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-violet-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs mt-2 text-right">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Step content */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6 sm:p-8">
          <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
            {['📱', '📧', '🌐', '🔐', '⚙️'][currentStep]}
            {steps[currentStep]}
          </h2>
          {stepComponents[currentStep]}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-medium disabled:opacity-30 hover:bg-gray-700 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors"
          >
            {currentStep === steps.length - 1
              ? (submitting ? 'Analysing with Claude AI...' : 'Submit Survey ✓')
            : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Reusable Components ───────────────────────────────────

function Question({ label, children }) {
  return (
    <div className="mb-6">
      <p className="text-gray-200 text-sm font-medium mb-3">{label}</p>
      {children}
    </div>
  )
}

function OptionGrid({ options, selected, onSelect, multi = false }) {
  const isSelected = (val) =>
    multi ? (selected || []).includes(val) : selected === val

  const handleClick = (val) => {
    if (multi) {
      const current = selected || []
      onSelect(current.includes(val)
        ? current.filter(v => v !== val)
        : [...current, val])
    } else {
      onSelect(val)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => handleClick(opt)}
          className={`px-4 py-3 rounded-xl text-sm font-medium text-left border transition-colors
            ${isSelected(opt)
              ? 'bg-violet-600/20 border-violet-500 text-violet-300'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
        >
          {isSelected(opt) ? '✓ ' : ''}{opt}
        </button>
      ))}
    </div>
  )
}

function SliderInput({ value, onChange, min = 0, max = 10, label }) {
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        value={value || min}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-violet-600"
      />
      <div className="flex justify-between text-gray-500 text-xs mt-1">
        <span>{min} — Never</span>
        <span className="text-violet-400 font-semibold">{value || min}</span>
        <span>{max} — Always</span>
      </div>
    </div>
  )
}

// ─── Step 1: Social Media ──────────────────────────────────

function SocialMediaStep({ answers, update }) {
  return (
    <div>
      <Question label="Which social media platforms do you actively use? (Select all that apply)">
        <OptionGrid
          multi
          options={['Facebook', 'Instagram', 'Twitter/X', 'TikTok', 'LinkedIn', 'Snapchat', 'YouTube', 'WhatsApp']}
          selected={answers.platforms}
          onSelect={(v) => update('platforms', v)}
        />
      </Question>

      <Question label="How often do you post on social media?">
        <OptionGrid
          options={['Multiple times a day', 'Once a day', 'A few times a week', 'Rarely']}
          selected={answers.postingFrequency}
          onSelect={(v) => update('postingFrequency', v)}
        />
      </Question>

      <Question label="What type of information do you share publicly? (Select all that apply)">
        <OptionGrid
          multi
          options={['Full name', 'Location/City', 'Photos of yourself', 'Daily activities', 'Phone number', 'University name', 'Opinions/Views', 'Financial info']}
          selected={answers.sharedInfo}
          onSelect={(v) => update('sharedInfo', v)}
        />
      </Question>

      <Question label="How often do you check your social media privacy settings?">
        <OptionGrid
          options={['Regularly', 'Sometimes', 'Rarely', 'Never']}
          selected={answers.privacyCheckFrequency}
          onSelect={(v) => update('privacyCheckFrequency', v)}
        />
      </Question>
    </div>
  )
}

// ─── Step 2: Email & Communication ────────────────────────

function EmailStep({ answers, update }) {
  return (
    <div>
      <Question label="How many email accounts do you actively use?">
        <OptionGrid
          options={['1', '2', '3', '4+']}
          selected={answers.emailCount}
          onSelect={(v) => update('emailCount', v)}
        />
      </Question>

      <Question label="Do you use your real name in your email address?">
        <OptionGrid
          options={['Yes, always', 'Sometimes', 'No, I use a username']}
          selected={answers.emailRealName}
          onSelect={(v) => update('emailRealName', v)}
        />
      </Question>

      <Question label="How often do you sign up for newsletters or promotions?">
        <OptionGrid
          options={['Very often', 'Sometimes', 'Rarely', 'Never']}
          selected={answers.newsletterSignup}
          onSelect={(v) => update('newsletterSignup', v)}
        />
      </Question>

      <Question label="Do you use the same email for all sign-ups (social, banking, shopping)?">
        <OptionGrid
          options={['Yes, one email for everything', 'I use 2-3 emails for different purposes', 'I use separate emails for sensitive accounts']}
          selected={answers.emailSeparation}
          onSelect={(v) => update('emailSeparation', v)}
        />
      </Question>
    </div>
  )
}

// ─── Step 3: Browsing Habits ───────────────────────────────

function BrowsingStep({ answers, update }) {
  return (
    <div>
      <Question label="Do you accept cookies on websites without reading the notice?">
        <OptionGrid
          options={['Always accept', 'Sometimes read it', 'Usually decline', 'Always customise']}
          selected={answers.cookieHabits}
          onSelect={(v) => update('cookieHabits', v)}
        />
      </Question>

      <Question label="Do you use a VPN when browsing?">
        <OptionGrid
          options={['Always', 'Sometimes', 'Rarely', 'Never']}
          selected={answers.vpnUsage}
          onSelect={(v) => update('vpnUsage', v)}
        />
      </Question>

      <Question label="Do you use private/incognito browsing mode?">
        <OptionGrid
          options={['Always', 'Sometimes', 'Rarely', 'Never']}
          selected={answers.incognito}
          onSelect={(v) => update('incognito', v)}
        />
      </Question>

      <Question label="How often do you clear your browser history/cookies?">
        <OptionGrid
          options={['Daily', 'Weekly', 'Monthly', 'Never']}
          selected={answers.clearHistory}
          onSelect={(v) => update('clearHistory', v)}
        />
      </Question>

      <Question label="Do you allow websites to access your location?">
        <OptionGrid
          options={['Always allow', 'Allow when asked', 'Rarely allow', 'Never allow']}
          selected={answers.locationAccess}
          onSelect={(v) => update('locationAccess', v)}
        />
      </Question>
    </div>
  )
}

// ─── Step 4: Security Practices ───────────────────────────

function SecurityStep({ answers, update }) {
  return (
    <div>
      <Question label="How do you manage your passwords?">
        <OptionGrid
          options={['Same password everywhere', 'A few different passwords', 'Unique passwords per site', 'Password manager']}
          selected={answers.passwordHabits}
          onSelect={(v) => update('passwordHabits', v)}
        />
      </Question>

      <Question label="Do you use Two-Factor Authentication (2FA)?">
        <OptionGrid
          options={['On all accounts', 'On important accounts only', 'Rarely', 'Never']}
          selected={answers.twoFactor}
          onSelect={(v) => update('twoFactor', v)}
        />
      </Question>

      <Question label="Have you ever been a victim of any of these? (Select all that apply)">
        <OptionGrid
          multi
          options={['Phishing email', 'Account hack', 'Identity theft', 'Scam call/SMS', 'Data breach notification', 'None of the above']}
          selected={answers.pastIncidents}
          onSelect={(v) => update('pastIncidents', v)}
        />
      </Question>

      <Question label="How quickly do you update your apps and devices?">
        <OptionGrid
          options={['Immediately', 'Within a week', 'Eventually', 'I avoid updates']}
          selected={answers.updateHabits}
          onSelect={(v) => update('updateHabits', v)}
        />
      </Question>
    </div>
  )
}

// ─── Step 5: Platform Privacy ──────────────────────────────

function PlatformStep({ answers, update }) {
  return (
    <div>
      <Question label="Is your social media profile set to public or private?">
        <OptionGrid
          options={['All public', 'Mostly public', 'Mostly private', 'All private']}
          selected={answers.profileVisibility}
          onSelect={(v) => update('profileVisibility', v)}
        />
      </Question>

      <Question label="Do you allow apps to track you across other websites/apps?">
        <OptionGrid
          options={['Always allow', 'Sometimes allow', 'Usually deny', 'Always deny']}
          selected={answers.crossAppTracking}
          onSelect={(v) => update('crossAppTracking', v)}
        />
      </Question>

      <Question label="Have you ever reviewed what data Google/Meta has collected about you?">
        <OptionGrid
          options={['Yes, regularly', 'Yes, once or twice', 'No, but I want to', 'No, never thought about it']}
          selected={answers.dataReview}
          onSelect={(v) => update('dataReview', v)}
        />
      </Question>

      <Question label="Do you use cloud storage (Google Drive, iCloud, OneDrive)?">
        <OptionGrid
          options={['Yes, for everything', 'Yes, for some files', 'Rarely', 'Never']}
          selected={answers.cloudStorage}
          onSelect={(v) => update('cloudStorage', v)}
        />
      </Question>

      <Question label="How concerned are you about your digital privacy? (0-10)">
        <SliderInput
          value={answers.privacyConcern}
          onChange={(v) => update('privacyConcern', v)}
        />
      </Question>
    </div>
  )
}