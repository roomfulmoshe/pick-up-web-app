import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import SignUp from './components/auth/SignUp';
import ProfileForm from './components/auth/ProfileForm';
import LoginPage from './components/auth/LoginPage';
import HomePage from './components/HomePage';
import HostGames from './pages/HostGames';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/host" 
          element={
            <ProtectedRoute>
              <HostGames/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profileForm" 
          element={
            <ProtectedRoute>
              <ProfileForm/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;