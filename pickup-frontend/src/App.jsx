// import { Routes, Route, Navigate } from 'react-router-dom';
// import SignUp from './components/auth/SignUp';
// import LoginPage from './components/auth/LoginPage';

import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SignUp from './components/auth/SignUp';
import ProfileForm from './components/auth/ProfileForm';
import LoginPage from './components/auth/LoginPage';
import HomePage from './components/HomePage';
import HostGames from './pages/HostGames';
import { useAuth } from './context/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />
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