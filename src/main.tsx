import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ReferralsProvider } from './context/ReferralsContext'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { NewReferral } from './pages/NewReferral'
import { ReferralsList } from './pages/ReferralsList'
import { UsersManagement } from './pages/UsersManagement'
import { Login } from './pages/Login'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ReferralsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="new-referral" element={<NewReferral />} />
              <Route path="referrals" element={<ReferralsList />} />
              <Route path="users" element={<UsersManagement />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ReferralsProvider>
    </AuthProvider>
  </React.StrictMode>,
)
