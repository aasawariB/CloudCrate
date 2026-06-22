import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white z-50 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Logo size={9} />
          <span className="text-lg font-bold text-gray-800">CloudCrate</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/auth')}
            className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors px-4 py-2">
            Login
          </button>
          <button onClick={() => navigate('/auth')}
            className="text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-violet-50 to-white">
        <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          ⚡ Metering Storage. Simplifying Billing.
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight max-w-3xl">
          Store Files.{' '}
          <span className="text-violet-600">Track Usage.</span>{' '}
          Pay Fairly.
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl">
          CloudCrate is a transparent object storage platform that automatically
          meters your usage and generates bills based on exactly what you use —
          nothing more, nothing less.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button onClick={() => navigate('/auth')}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-violet-200">
            Start for Free →
          </button>
          <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            className="border border-gray-300 hover:border-violet-300 text-gray-600 hover:text-violet-600 font-semibold px-8 py-3.5 rounded-xl text-base transition-colors">
            See How It Works
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg w-full">
          {[
            { value: '₹2/MB',   label: 'Storage Rate' },
            { value: '₹1/file', label: 'Per Upload' },
            { value: '100%',    label: 'Transparent Billing' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-violet-600">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need in one place</h2>
            <p className="text-gray-500 mt-3">Simple, powerful, and fully transparent.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: '📁', title: 'Upload & Manage Files',    desc: 'Drag and drop any file. View, manage, and delete from your personal dashboard.',       color: 'bg-violet-50' },
              { icon: '📊', title: 'Real-Time Usage Tracking', desc: 'Every upload is tracked automatically. See exactly how much storage you are using.',    color: 'bg-purple-50' },
              { icon: '💳', title: 'Transparent Billing',      desc: 'Simple formula, no hidden fees. Pay only for what you actually use.',                    color: 'bg-fuchsia-50' },
              { icon: '🔐', title: 'Secure Authentication',    desc: 'JWT-based auth with bcrypt password hashing keeps your account protected.',              color: 'bg-violet-50' },
              { icon: '👤', title: 'Personal Storage Space',   desc: 'Every user gets isolated private storage. Your files are completely yours.',             color: 'bg-purple-50' },
              { icon: '⚙️', title: 'Account Management',       desc: 'Update your profile, change password, and manage notification preferences.',             color: 'bg-fuchsia-50' },
            ].map(f => (
              <div key={f.title} className={`${f.color} rounded-2xl p-6 hover:shadow-md transition-shadow`}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-base font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Billing formula */}
      <section className="py-24 px-6 bg-violet-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Simple, honest pricing</h2>
          <p className="text-violet-200 mb-12">No subscriptions. No hidden charges. Pay only for what you use.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { formula: '₹2 × MB',    label: 'Storage Cost',     desc: 'Per megabyte stored' },
              { formula: '₹1 × Files', label: 'Upload Cost',      desc: 'Per file uploaded' },
              { formula: 'Total Bill', label: 'Storage + Upload', desc: 'Your final bill' },
            ].map((item, i) => (
              <div key={item.label} className="bg-white bg-opacity-10 rounded-2xl p-6 text-white border border-white border-opacity-20">
                <div className="text-2xl font-extrabold mb-2">{item.formula}</div>
                <div className="text-violet-200 text-sm font-semibold mb-1">{item.label}</div>
                <div className="text-violet-300 text-xs">{item.desc}</div>
                {i < 2 && <div className="mt-4 text-violet-300 text-2xl font-light">+</div>}
              </div>
            ))}
          </div>

          {/* Example calc */}
          <div className="mt-10 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl p-5 text-left">
            <p className="text-violet-200 text-sm font-semibold mb-2">Example Calculation</p>
            <p className="text-white text-sm">You upload <span className="font-bold">5 files</span> totalling <span className="font-bold">10 MB</span>:</p>
            <p className="text-violet-200 text-sm mt-2">Storage cost = ₹2 × 10 = <span className="text-white font-bold">₹20</span></p>
            <p className="text-violet-200 text-sm">Upload cost &nbsp;= ₹1 × 5  = <span className="text-white font-bold">₹5</span></p>
            <p className="text-white font-bold text-base mt-2 border-t border-white border-opacity-20 pt-2">Total Bill = ₹25</p>
          </div>
          <button onClick={() => navigate('/auth')}
            className="mt-10 bg-white text-violet-600 font-bold px-8 py-3.5 rounded-xl hover:bg-violet-50 transition-colors shadow-lg">
            Get Started for Free →
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-14">Get started in 3 steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create an Account', desc: 'Register with your name, email, and password. Takes less than 30 seconds.' },
              { step: '02', title: 'Upload Your Files',  desc: 'Drag and drop any file to your personal storage. We track everything automatically.' },
              { step: '03', title: 'View Your Bill',     desc: 'Head to Billing to see a full breakdown of your usage and total cost.' },
            ].map(item => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg mb-5 shadow-lg shadow-violet-200">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-500 mb-8">Create your free account and start uploading in seconds.</p>
          <button onClick={() => navigate('/auth')}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-10 py-4 rounded-xl text-base transition-colors shadow-lg shadow-violet-200">
            Create Free Account →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10l-2 3h3l-2 3" />
              </svg>
            </div>
            <span className="text-white font-bold text-sm">CloudCrate</span>
          </div>
          <p className="text-xs text-center">Usage Metering & Billing Engine — SETU Project 2025–26</p>
          <div className="flex gap-4 text-xs">
            <button onClick={() => navigate('/auth')} className="hover:text-white transition-colors">Login</button>
            <button onClick={() => navigate('/auth')} className="hover:text-white transition-colors">Register</button>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default LandingPage