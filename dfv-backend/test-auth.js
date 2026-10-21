const base = 'http://localhost:5000/api'

const post = async (path, body) => {
  const r = await fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return { status: r.status, data: await r.json() }
}

;(async () => {
  const email = `test${Date.now()}@example.com`
  console.log('REGISTER:', await post('/auth/register', {
    fullName: 'Test Student', email, studentId: '123456', faculty: 'Computing', password: 'password123',
  }))
  console.log('LOGIN (correct):', (await post('/auth/login', { email, password: 'password123' })).status)
  console.log('LOGIN (wrong password):', (await post('/auth/login', { email, password: 'wrong-password' })).status)
})()
