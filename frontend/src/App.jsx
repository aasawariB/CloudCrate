import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage   from './pages/LandingPage'
import AuthPage      from './pages/AuthPage'
import Dashboard     from './pages/Dashboard'
import UploadPage    from './pages/UploadPage'
import BillingPage   from './pages/BillingPage'
import SettingsPage  from './pages/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/auth"      element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload"    element={<UploadPage />} />
        <Route path="/billing"   element={<BillingPage />} />
        <Route path="/settings"  element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App