import './App.css'
import AdminPage from './pages/AdminPage'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import LandingPage from './pages/LandingPage'
import { useAuth } from './components/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ParticipantPage from './pages/ParticipantPage'
import OrganizerPage from './pages/OrganizerPage'
import AdminLayout from './layouts/AdminLayout'
import ParticipantsLayout from './layouts/ParticipantLayout'

function App() {
  const { user, role, loading } = useAuth()

  const getLandingPath = () => {
    if (role === 'participant') return '/participant'
    if (role === 'organizer') return '/organizer'
    return '/admin'
  }

  // if (loading) {
  //   return <div>Loading...</div>
  // }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />
        
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={getLandingPath()} />
            ) : (
              <div className="app auth-wrapper">
                <div className="auth-inner">
                  <LoginPage />
                </div>
              </div>
            )
          }
        />

        <Route 
          path="/signup" 
          element={
            <div className="app auth-wrapper">
              <div className="auth-inner">
                <SignUpPage />
              </div>
            </div>
          } 
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/participant/*"
          element={
            <ProtectedRoute allowedRoles={['participant']}>
              <ParticipantsLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <OrganizerPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
