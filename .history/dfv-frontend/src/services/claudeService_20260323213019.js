const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export const analyseRisk = async (surveyData) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are a cybersecurity privacy risk analyst. 
You will receive a student's digital footprint survey data as JSON. 
Return ONLY a valid JSON object with exactly this structure, no extra text:
{
  "overallScore": <number 0-100, 100 = highest risk>,
  "riskTier": <"Low" | "Medium" | "High" | "Critical">,
  "dimensions": {
    "socialMedia": { "score": <0-100>, "topRisk": "<string>" },
    "email": { "score": <0-100>, "topRisk": "<string>" },
    "browsing": { "score": <0-100>, "topRisk": "<string>" },
    "security": { "score": <0-100>, "topRisk": "<string>" },
    "platformPrivacy": { "score": <0-100>, "topRisk": "<string>" }
  },
  "topThreats": ["<threat 1>", "<threat 2>", "<threat 3>"],
  "summary": "<2 sentences explaining their overall risk in plain English>"
}`,
      messages: [
        {
          role: 'user',
          content: `Analyse this student's digital footprint survey data and return the risk analysis JSON: ${JSON.stringify(surveyData)}`
        }
      ]
    })
  })

  const data = await response.json()
  const text = data.content[0].text
  return JSON.parse(text)
}