import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'

function Sidebar({ open = true, onToggle }) {
  const navigate  = useNavigate()
  const location  = useLocation()

  const navItems = [
    { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { label: 'Files',     icon: '📁', path: '/upload' },
    { label: 'Billing',   icon: '💳', path: '/billing' },
    { label: 'Settings',  icon: '⚙️', path: '/settings' },
  ]

  return (
    <aside className={`${open ? 'w-56' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 flex-shrink-0`}>

      {/* Logo + name */}
      <div
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-3 px-4 py-5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <Logo size={9} />
        {open && <span className="font-bold text-gray-800 text-sm">CloudCrate</span>}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(item => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              location.pathname === item.path
                ? 'bg-violet-50 text-violet-600 font-medium'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {open && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-gray-100">
        <button
          onClick={() => { localStorage.clear(); navigate('/') }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-50 transition-colors"
        >
          <span className="flex-shrink-0">🚪</span>
          {open && <span>Logout</span>}
        </button>
      </div>

    </aside>
  )
}

export default Sidebar