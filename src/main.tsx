import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { NewReferral } from './pages/NewReferral'
import { ReferralsList } from './pages/ReferralsList'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="new-referral" element={<NewReferral />} />
          <Route path="referrals" element={<ReferralsList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
