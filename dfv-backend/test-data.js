const base = 'http://localhost:5000/api'

const call = async (method, path, body, token) => {
  const r = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  return { status: r.status, data: await r.json() }
}

;(async () => {
  const email = `data${Date.now()}@example.com`
  const reg = await call('POST', '/auth/register', { fullName: 'Data Test', email, password: 'password123' })
  const token = reg.data.token

  const survey = await call('POST', '/survey', { answers: { platforms: ['Instagram'], twoFactor: 'Never' } }, token)
  console.log('SURVEY:', survey.status, survey.data)

  const risk = await call('POST', '/risk', {
    surveyId: survey.data.surveyId, overallScore: 74, riskTier: 'High',
    dimensions: { socialMedia: { score: 88, topRisk: 'Public profile' } },
    topThreats: ['Threat one'], summary: 'Test summary',
  }, token)
  console.log('RISK:', risk.status)

  console.log('QUIZ 1 (expect pre):', (await call('POST', '/quiz', { score: 4, total: 10 }, token)).data.quiz.phase)
  console.log('QUIZ 2 (expect post):', (await call('POST', '/quiz', { score: 7, total: 10 }, token)).data.quiz.phase)

  console.log('BAD RISK (expect 400):', (await call('POST', '/risk', { overallScore: 500 }, token)).status)
  console.log('NO TOKEN (expect 401):', (await call('GET', '/me/summary')).status)

  const sum = await call('GET', '/me/summary', null, token)
  console.log('SUMMARY:', JSON.stringify(sum.data, null, 2))
})()