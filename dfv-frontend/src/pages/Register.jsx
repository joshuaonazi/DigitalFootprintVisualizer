import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    studentId: '',
    faculty: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    // Mock register — backend comes later
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-600 mb-4">
            <span className="text-white text-2xl">🔍</span>
          </div>
          <h1 className="text-white text-3xl font-bold">DFV</h1>
          <p className="text-gray-400 mt-1">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800">
          <h2 className="text-white text-xl font-semibold mb-6">Student Registration</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Oluwatimilehini Ajiboye"
                required
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-violet-500 placeholder-gray-600"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@university.edu"
                required
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-violet-500 placeholder-gray-600"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-gray-400 text-sm mb-1 block">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  placeholder="e.g. 254770"
                  required
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-violet-500 placeholder-gray-600"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-sm mb-1 block">Faculty</label>
                <select
                  name="faculty"
                  value={form.faculty}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-violet-500"
                >
                  <option value="">Select</option>
                  <option>Computing</option>
                  <option>Engineering</option>
                  <option>Sciences</option>
                  <option>Arts</option>
                  <option>Medicine</option>
                  <option>Law</option>
                  <option>Education</option>
                  <option>Social Sciences</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                required
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-violet-500 placeholder-gray-600"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-violet-500 placeholder-gray-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 mt-2"
            >
              Create Account
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}