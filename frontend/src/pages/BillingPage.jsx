import Sidebar from '../components/Sidebar'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBillingSummary } from '../api/billing'

function BillingPage() {
  const navigate = useNavigate()
  const [billing, setBilling]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [paid, setPaid]           = useState(false)
  const [payLoading, setPayLoading] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const res = await getBillingSummary()
        setBilling(res.data)
      } catch (err) {
        if (err.response?.status === 401) { localStorage.clear(); navigate('/') }
      } finally {
        setLoading(false)
      }
    }
    fetchBilling()
  }, [])

  const handlePay = () => {
  setPayLoading(true)
  // Simulate payment processing for 2 seconds
  setTimeout(() => {
    setPayLoading(false)
    setPaid(true)
  }, 2000)
}

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Billing</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-gray-600 hidden sm:block">{user?.name || 'User'}</span>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-violet-500 text-sm font-medium animate-pulse">Calculating your bill...</div>
            </div>
          ) : (
            <>
              {/* Current bill banner */}
<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div>
    <p className="text-sm text-gray-400 mb-1">Total Amount Due</p>
    <p className="text-4xl font-bold text-gray-800">₹{billing?.totalCost ?? 0}</p>
    {paid ? (
      <div className="flex items-center gap-2 mt-2">
        <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block"></span>
        <p className="text-sm text-green-600 font-medium">Paid — Thank you!</p>
      </div>
    ) : (
      <div className="flex items-center gap-2 mt-2">
        <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full inline-block animate-pulse"></span>
        <p className="text-sm text-yellow-500 font-medium">Unpaid</p>
      </div>
    )}
  </div>
  <div className="flex flex-col gap-2 items-center">
    {paid ? (
      <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-4 text-center">
        <p className="text-2xl mb-1">🎉</p>
        <p className="text-green-700 font-semibold text-sm">Payment Successful</p>
        <p className="text-green-500 text-xs mt-1">₹{billing?.totalCost} paid successfully</p>
        <p className="text-gray-400 text-xs mt-1">
          {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    ) : (
      <button
        onClick={handlePay}
        disabled={payLoading}
        className={`font-semibold px-8 py-3 rounded-xl transition-colors text-white ${
          payLoading ? 'bg-violet-300 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'
        }`}
      >
        {payLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Processing...
          </span>
        ) : (
          `Pay ₹${billing?.totalCost}`
        )}
      </button>
    )}
  </div>
</div>
          

              {/* Breakdown + plan */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Breakdown */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-700">Usage Breakdown</p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    <div className="px-5 py-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Storage Cost</p>
                        <p className="text-xs text-gray-400">{billing?.totalStorageMB} MB × ₹2/MB</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">₹{billing?.storageCost}</span>
                    </div>
                    <div className="px-5 py-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Upload Cost</p>
                        <p className="text-xs text-gray-400">{billing?.totalFiles} files × ₹1/file</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">₹{billing?.uploadCost}</span>
                    </div>
                  </div>
                  <div className="px-5 py-4 border-t border-gray-100 flex justify-between bg-gray-50 rounded-b-xl">
                    <span className="text-sm font-bold text-gray-700">Total Bill</span>
                    <span className="text-sm font-bold text-violet-600">₹{billing?.totalCost}</span>
                  </div>
                </div>

                {/* Stats card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                  <p className="text-sm font-semibold text-gray-700">Your Usage Stats</p>
                  <div className="bg-violet-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-violet-700 text-lg">Current Plan</span>
                      <span className="text-sm text-violet-400">₹2/MB · ₹1/file</span>
                    </div>
                    <p className="text-xs text-violet-400">Pay as you go — based on actual usage</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Total Files</span>
                        <span>{billing?.totalFiles} files</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-violet-500 h-2 rounded-full" style={{ width: `${Math.min(billing?.totalFiles * 10, 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Storage Used</span>
                        <span>{billing?.totalStorageMB} MB</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-purple-400 h-2 rounded-full" style={{ width: `${Math.min(billing?.totalStorageMB, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default BillingPage