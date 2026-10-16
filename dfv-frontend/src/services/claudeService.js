const mockRiskResult = {
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
    'High social media exposure enables targeted phishing and social engineering attacks against you',
    'Password reuse across platforms means one data breach compromises all your accounts simultaneously',
    'Unrestricted cookie acceptance allows advertising networks to build a detailed behavioral profile of your online activity',
  ],
  summary: 'Your digital footprint places you in the High risk tier, with social media behavior and security practices representing your most critical exposure points. Immediate action on two-factor authentication and privacy settings could reduce your overall score by approximately 25 points.'
}

const mockRecommendations = [
  {
    title: 'Enable Two-Factor Authentication on All Accounts',
    description: 'Add 2FA to your email, social media, and banking apps immediately. This single action dramatically reduces your risk of account takeover even if your password is stolen.',
    impact: 'High',
    estimatedScoreReduction: 18,
    category: 'Security',
    steps: ['Go to Google Account Settings → Security → 2-Step Verification', 'Enable 2FA on Instagram via Settings → Security → Two-Factor Authentication', 'Repeat for Twitter/X, WhatsApp, and your banking app', 'Use an authenticator app (Google Authenticator) rather than SMS where possible']
  },
  {
    title: 'Set All Social Media Profiles to Private',
    description: 'Public profiles allow data brokers, scammers, and cybercriminals to build targeting profiles from your posts. Switch all accounts to private immediately.',
    impact: 'High',
    estimatedScoreReduction: 15,
    category: 'Social Media',
    steps: ['Instagram: Settings → Privacy → Private Account → toggle on', 'Twitter/X: Settings → Privacy and Safety → Protect your posts', 'Facebook: Settings → Privacy → Who can see your future posts → Friends', 'Review and remove tagged photos and location check-ins']
  },
  {
    title: 'Use a Password Manager',
    description: 'Stop reusing passwords across platforms. A password manager generates and stores unique strong passwords for every account you use.',
    impact: 'High',
    estimatedScoreReduction: 14,
    category: 'Security',
    steps: ['Download Bitwarden (free) from bitwarden.com', 'Create a strong master password you will remember', 'Import your existing accounts and update weak passwords one by one', 'Install the browser extension for automatic password filling']
  },
  {
    title: 'Review and Restrict App Permissions',
    description: 'Many apps collect far more data than they need. Audit which apps have access to your location, microphone, camera, and contacts.',
    impact: 'Medium',
    estimatedScoreReduction: 10,
    category: 'Platform Privacy',
    steps: ['Android: Settings → Apps → Permissions Manager → review each category', 'Revoke location access from apps that do not genuinely need it', 'Disable microphone access for non-communication apps', 'Remove apps you no longer use — they still collect data in the background']
  },
  {
    title: 'Use Separate Emails for Different Purposes',
    description: 'Using one email for everything links all your online activity together into one exploitable profile. Create a dedicated email for newsletters and sign-ups.',
    impact: 'Medium',
    estimatedScoreReduction: 9,
    category: 'Email',
    steps: ['Create a new Gmail or ProtonMail account exclusively for non-essential sign-ups', 'Keep your primary email only for banking, university, and important accounts', 'Unsubscribe from newsletters you no longer read', 'Use disposable email addresses for one-time sign-ups at temp-mail.org']
  },
  {
    title: 'Clear Cookies and Browser History Regularly',
    description: 'Cookies allow websites and advertisers to track your behavior across the internet. Clearing them regularly limits long-term behavioral profiling.',
    impact: 'Low',
    estimatedScoreReduction: 6,
    category: 'Browsing',
    steps: ['Chrome: Settings → Privacy and Security → Clear browsing data → select Cookies and Cache', 'Install the uBlock Origin browser extension to block trackers automatically', 'Set your browser to clear cookies automatically when closed', 'Consider using Firefox with Enhanced Tracking Protection enabled by default']
  }
]

const mockReport = `PRIVACY AUDIT REPORT — Digital Footprint Visualizer
University of Ibadan | Generated by DFV AI System

EXECUTIVE SUMMARY
Your overall privacy risk score of 74/100 places you in the High risk tier, indicating significant exposure across your digital platforms. This report identifies your key vulnerabilities and provides a prioritized action plan to reduce your risk profile.

RISK SCORE BREAKDOWN
- Social Media: 88/100 (Critical) — Your most significant risk area
- Security Practices: 79/100 (High) — Password and authentication vulnerabilities
- Browsing Habits: 71/100 (High) — Cookie and tracking exposure
- Platform Privacy: 65/100 (Medium) — App permissions need review
- Email Practices: 62/100 (Medium) — Consolidation of email addresses

TOP 3 THREATS IDENTIFIED
1. Social Engineering Risk: Your public social media presence provides attackers with sufficient personal information to craft convincing phishing attacks targeting you specifically.
2. Credential Vulnerability: Password reuse means a single data breach at any platform you use could compromise all your accounts simultaneously — a cascading failure risk.
3. Behavioral Profiling: Unrestricted cookie acceptance across websites allows advertising networks to maintain detailed records of your browsing habits, purchases, and interests.

RECOMMENDED ACTIONS
Priority 1: Enable two-factor authentication on all accounts this week (estimated score reduction: -18 points)
Priority 2: Set all social media profiles to private (estimated score reduction: -15 points)
Priority 3: Install a password manager and create unique passwords (estimated score reduction: -14 points)

CONCLUSION
Implementing the three priority actions above would reduce your estimated risk score from 74 to approximately 27, moving you from the High risk tier into the Low risk tier. Your digital privacy is within your control — the recommended changes require less than two hours of your time and cost nothing.`

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export async function analyseRisk(surveyData) {
  await delay(3000)
  return { ...mockRiskResult }
}

export async function getRecommendations(riskResult) {
  await delay(2000)
  return [...mockRecommendations]
}

export async function generateReport(riskResult) {
  await delay(2500)
  return mockReport
}

export async function chatWithAssistant(messages, riskProfile) {
  await delay(1500)
  const lastMessage = messages[messages.length - 1]?.text?.toLowerCase() || ''

  if (!riskProfile) {
    return 'Please complete the survey first so I can give you personalised advice based on your specific risk profile!'
  }

  const highestDim = Object.entries(riskProfile.dimensions)
    .sort((a, b) => b[1].score - a[1].score)[0]
  const highestName = highestDim[0].replace(/([A-Z])/g, ' $1').trim()
  const highestScore = highestDim[1].score

  if (lastMessage.includes('score') || lastMessage.includes('risk') || lastMessage.includes('result')) {
    return `Your overall risk score is ${riskProfile.overallScore}/100, placing you in the ${riskProfile.riskTier} Risk tier. Your highest exposure is in ${highestName} (${highestScore}/100) — ${highestDim[1].topRisk}. I recommend starting with the recommendations page to see your prioritised action plan.`
  }
  if (lastMessage.includes('social media') || lastMessage.includes('instagram') || lastMessage.includes('facebook') || lastMessage.includes('twitter')) {
    return `Your Social Media score is ${riskProfile.dimensions.socialMedia.score}/100. ${riskProfile.dimensions.socialMedia.topRisk}. The most impactful fix is switching all your profiles to private — this alone could reduce your score by around 14-15 points. Also review which third-party apps have access to your social accounts.`
  }
  if (lastMessage.includes('password') || lastMessage.includes('security')) {
    return `Your Security score is ${riskProfile.dimensions.security.score}/100. ${riskProfile.dimensions.security.topRisk}. I strongly recommend installing Bitwarden (free) as a password manager and enabling 2FA on all your accounts. These two actions together could reduce your overall score by about 32 points.`
  }
  if (lastMessage.includes('2fa') || lastMessage.includes('two-factor') || lastMessage.includes('authentication')) {
    return `To enable 2FA: on Google go to myaccount.google.com → Security → 2-Step Verification. On Instagram go to Settings → Security → Two-Factor Authentication. Use an authenticator app rather than SMS — it\'s more secure. Your Security score is currently ${riskProfile.dimensions.security.score}/100, so this will make a significant difference.`
  }
  if (lastMessage.includes('cookie') || lastMessage.includes('browsing') || lastMessage.includes('browser')) {
    return `Your Browsing score is ${riskProfile.dimensions.browsing.score}/100. ${riskProfile.dimensions.browsing.topRisk}. Install uBlock Origin on your browser to block trackers automatically. Also go to your browser settings and enable automatic cookie clearing when you close the browser. Firefox has Enhanced Tracking Protection built in by default.`
  }
  if (lastMessage.includes('email')) {
    return `Your Email score is ${riskProfile.dimensions.email.score}/100. ${riskProfile.dimensions.email.topRisk}. Create a separate Gmail or ProtonMail account for newsletters, shopping, and non-essential sign-ups. Keep your primary email only for banking, university, and important accounts. This reduces your trackable digital footprint significantly.`
  }
  if (lastMessage.includes('recommend') || lastMessage.includes('improve') || lastMessage.includes('reduce')) {
    return `Based on your ${riskProfile.riskTier} Risk profile (score: ${riskProfile.overallScore}), your top 3 priorities are: 1) Enable 2FA on all accounts (-18 pts), 2) Set social media to private (-15 pts), 3) Use a password manager (-14 pts). Completing these three actions alone would drop your score by approximately 47 points. Check the Recommendations page for step-by-step guides.`
  }
  if (lastMessage.includes('what is') || lastMessage.includes('explain') || lastMessage.includes('passive') || lastMessage.includes('footprint')) {
    return `A digital footprint is the trail of data you leave online. Active footprints are things you deliberately post — photos, comments, sign-up forms. Passive footprints are collected without your direct input — IP addresses, cookies, location data from apps running in the background. Your survey revealed ${riskProfile.topThreats[0].toLowerCase()}.`
  }
  return `Based on your ${riskProfile.riskTier} Risk score of ${riskProfile.overallScore}/100, your most urgent area is ${highestName} (score: ${highestScore}). ${highestDim[1].topRisk}. Would you like specific steps to improve this area, or do you have a question about another part of your risk profile?`
}
