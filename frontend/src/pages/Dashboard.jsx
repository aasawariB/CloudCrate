import Sidebar from '../components/Sidebar'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyFiles } from '../api/files'
import { getBillingSummary } from '../api/billing'

function Dashboard() {
  const navigate   = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [files, setFiles]             = useState([])
  const [billing, setBilling]         = useState(null)
  const [loading, setLoading]         = useState(true)

  // Get logged in user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filesRes, billingRes] = await Promise.all([
          getMyFiles(),
          getBillingSummary(),
        ])
        setFiles(filesRes.data)
        setBilling(billingRes.data)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
        // If token is invalid, send back to login
        if (err.response?.status === 401) {
          localStorage.clear()
          navigate('/')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const formatSize = (bytes) => {
    if (!bytes) return '0 MB'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const getFileType = (name) => name.split('.').pop().toUpperCase()

  const typeColors = {
    PDF:  'bg-red-100 text-red-600',
    ZIP:  'bg-yellow-100 text-yellow-600',
    SQL:  'bg-blue-100 text-blue-600',
    PNG:  'bg-green-100 text-green-600',
    JPG:  'bg-green-100 text-green-600',
    JPEG: 'bg-green-100 text-green-600',
    MP4:  'bg-purple-100 text-purple-600',
  }

  const stats = [
    {
      label: 'Total Storage Used',
      value: billing ? `${billing.totalStorageMB} MB` : '—',
      sub: 'across all your files',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7M4 7h16M4 7l2-3h12l2 3" />
        </svg>
      ),
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Files Uploaded',
      value: billing ? billing.totalFiles : '—',
      sub: 'total files stored',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Current Bill',
      value: billing ? `₹${billing.totalCost}` : '—',
      sub: `Storage ₹${billing?.storageCost ?? 0} + Uploads ₹${billing?.uploadCost ?? 0}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 14l-4-4 4-4M15 10h6M3 10h6" />
        </svg>
      ),
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      label: 'Upload Charges',
      value: billing ? `₹${billing.uploadCost}` : '—',
      sub: '₹1 per file uploaded',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'bg-purple-50 text-purple-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          </div>
          <div
            onClick={() => navigate('/settings')}
            className="flex items-center gap-3 cursor-pointer hover:opacity-75"
          >
            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-gray-600 hidden sm:block">{user?.name || 'User'}</span>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-violet-500 text-sm font-medium animate-pulse">Loading your data...</div>
            </div>
          ) : (
            <>
              {/* Welcome banner */}
              <div className="bg-violet-600 rounded-2xl px-6 py-5 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋</h3>
                  <p className="text-violet-200 text-sm mt-1">Here's your real-time storage summary.</p>
                </div>
                <button
                  onClick={() => navigate('/upload')}
                  className="bg-white text-violet-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-violet-50 transition-colors"
                >
                  Upload File
                </button>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(stat => (
                  <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-3`}>{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
                    <div className="text-xs text-gray-400 mt-1">{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Storage bar */}
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-700">Storage Usage</span>
                  <span className="text-sm text-gray-400">{billing?.totalStorageMB || 0} MB used</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-violet-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min((billing?.totalStorageMB || 0), 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-400">{billing?.totalStorageMB || 0} MB used</span>
                  <span className="text-xs text-violet-500">₹2 per MB rate</span>
                </div>
              </div>

              {/* Recent files */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Recent Files</span>
                  <button onClick={() => navigate('/upload')} className="text-xs text-violet-500 hover:underline">View all</button>
                </div>
                {files.length === 0 ? (
                  <div className="px-5 py-8 text-center text-gray-400 text-sm">
                    No files uploaded yet.{' '}
                    <span onClick={() => navigate('/upload')} className="text-violet-500 cursor-pointer hover:underline">
                      Upload your first file
                    </span>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {files.slice(0, 5).map(file => (
                      <div key={file._id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${typeColors[getFileType(file.originalName)] || 'bg-gray-100 text-gray-600'}`}>
                            {getFileType(file.originalName)}
                          </span>
                          <div>
                            <div className="text-sm font-medium text-gray-700">{file.originalName}</div>
                            <div className="text-xs text-gray-400">{new Date(file.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">{formatSize(file.size)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard