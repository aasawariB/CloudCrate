import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../api/auth'

function AuthPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab]     = useState('login')
  const [loginData, setLoginData]     = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirm: '' })
  const [message, setMessage]         = useState('')
  const [loading, setLoading]         = useState(false)
  const [isError, setIsError]         = useState(false)

  const showMsg = (text, error = false) => {
    setMessage(text)
    setIsError(error)
  }

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      return showMsg('Please fill in all fields.', true)
    }
    try {
      setLoading(true)
      const res = await loginUser(loginData)
      // Save the token and user info to localStorage
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      showMsg('Login successful!', false)
      navigate('/dashboard')
    } catch (err) {
      showMsg(err.response?.data?.message || 'Login failed.', true)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirm) {
      return showMsg('Please fill in all fields.', true)
    }
    if (registerData.password !== registerData.confirm) {
      return showMsg('Passwords do not match.', true)
    }
    try {
      setLoading(true)
      const res = await registerUser({
        name:     registerData.name,
        email:    registerData.email,
        password: registerData.password,
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      showMsg('Account created successfully!', false)
      navigate('/dashboard')
    } catch (err) {
      showMsg(err.response?.data?.message || 'Registration failed.', true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-violet-600 rounded-xl mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10l-2 3h3l-2 3" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">CloudCrate</h1>
          <p className="text-sm text-gray-500 mt-1">Usage Metering & Billing Engine</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
          <button
            onClick={() => { setActiveTab('login'); setMessage('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'login' ? 'bg-white text-violet-600 shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >Login</button>
          <button
            onClick={() => { setActiveTab('register'); setMessage('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'register' ? 'bg-white text-violet-600 shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >Register</button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={loginData.email}
                onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full font-semibold py-2.5 rounded-lg transition-colors text-white ${
                loading ? 'bg-violet-300 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={registerData.name}
                onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={registerData.email}
                onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={registerData.password}
                onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={registerData.confirm}
                onChange={e => setRegisterData({ ...registerData, confirm: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <button
              onClick={handleRegister}
              disabled={loading}
              className={`w-full font-semibold py-2.5 rounded-lg transition-colors text-white ${
                loading ? 'bg-violet-300 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'
              }`}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`mt-4 text-center text-sm font-medium py-2 px-4 rounded-lg ${
            isError ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
          }`}>
            {message}
          </div>
        )}

      </div>
    </div>
  )
}

export default AuthPage