import Sidebar from '../components/Sidebar'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateProfile, updatePassword } from '../api/auth'

function SettingsPage() {
  const navigate = useNavigate()

  // Load real user from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [profile, setProfile] = useState({
    name:  storedUser.name  || '',
    email: storedUser.email || '',
  })
  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: ''
  })
  const [notifications, setNotifications] = useState({
    billing: true, storage: true, updates: false,
  })
  const [profileMsg, setProfileMsg]   = useState('')
  const [passMsg, setPassMsg]         = useState('')
  const [profileError, setProfileError] = useState(false)
  const [passError, setPassError]       = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [passLoading, setPassLoading]       = useState(false)

  const saveProfile = async () => {
    if (!profile.name || !profile.email) {
      setProfileError(true)
      return setProfileMsg('Please fill in all fields.')
    }
    try {
      setProfileLoading(true)
      const res = await updateProfile({ name: profile.name, email: profile.email })
      // Update localStorage so the name shows correctly everywhere
      const updatedUser = { ...storedUser, name: res.data.user.name, email: res.data.user.email }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setProfileError(false)
      setProfileMsg('Profile updated successfully!')
    } catch (err) {
      setProfileError(true)
      setProfileMsg(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setProfileLoading(false)
    }
  }

  const savePassword = async () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setPassError(true)
      return setPassMsg('Please fill in all fields.')
    }
    if (passwords.newPass !== passwords.confirm) {
      setPassError(true)
      return setPassMsg('New passwords do not match.')
    }
    if (passwords.newPass.length < 6) {
      setPassError(true)
      return setPassMsg('New password must be at least 6 characters.')
    }
    try {
      setPassLoading(true)
      await updatePassword({
        currentPassword: passwords.current,
        newPassword:     passwords.newPass,
      })
      setPassError(false)
      setPassMsg('Password changed successfully!')
      setPasswords({ current: '', newPass: '', confirm: '' })
    } catch (err) {
      setPassError(true)
      setPassMsg(err.response?.data?.message || 'Failed to update password.')
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 text-sm font-bold">
              {storedUser?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-gray-600 hidden sm:block">{storedUser?.name || 'User'}</span>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 max-w-2xl w-full">

          {/* Profile */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-700">Profile Information</p>
            </div>
            <div className="px-5 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              {profileMsg && (
                <p className={`text-sm font-medium px-4 py-2 rounded-lg ${
                  profileError ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
                }`}>{profileMsg}</p>
              )}
              <button onClick={saveProfile} disabled={profileLoading}
                className={`text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors ${
                  profileLoading ? 'bg-violet-300 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'
                }`}>
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-700">Change Password</p>
            </div>
            <div className="px-5 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input type="password" placeholder="••••••••" value={passwords.current}
                  onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" placeholder="••••••••" value={passwords.newPass}
                  onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input type="password" placeholder="••••••••" value={passwords.confirm}
                  onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              {passMsg && (
                <p className={`text-sm font-medium px-4 py-2 rounded-lg ${
                  passError ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
                }`}>{passMsg}</p>
              )}
              <button onClick={savePassword} disabled={passLoading}
                className={`text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors ${
                  passLoading ? 'bg-violet-300 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'
                }`}>
                {passLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-700">Notification Preferences</p>
            </div>
            <div className="px-5 py-5 space-y-4">
              {[
                { key: 'billing',  label: 'Billing Alerts',    desc: 'Get notified when a new invoice is generated' },
                { key: 'storage',  label: 'Storage Warnings',  desc: 'Alert when storage usage exceeds 80%' },
                { key: 'updates',  label: 'Product Updates',   desc: 'Receive news about new features' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      notifications[item.key] ? 'bg-violet-500' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                      notifications[item.key] ? 'left-6' : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-xl border border-red-100 shadow-sm">
            <div className="px-5 py-4 border-b border-red-100">
              <p className="text-sm font-semibold text-red-500">Danger Zone</p>
            </div>
            <div className="px-5 py-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Delete Account</p>
                <p className="text-xs text-gray-400">Permanently delete your account and all data</p>
              </div>
              <button className="border border-red-300 text-red-500 hover:bg-red-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

export default SettingsPage