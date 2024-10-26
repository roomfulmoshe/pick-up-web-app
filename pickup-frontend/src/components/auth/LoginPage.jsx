import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import '../../styles/SignUp.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in with email and password
      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Redirect to home page after successful login
        // Use navigate instead of window.location.href
    navigate('/');
     setError("SUCCESSFUL LOGIN");
      
    } catch (err) {
      let errorMessage = '';
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        default:
          errorMessage = 'An error occurred during login.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="entry-page">
      <form onSubmit={handleSubmit}>
        <h2>Welcome Back!</h2>
        <fieldset>
          <legend>Login to Your Account</legend>
          {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}
          <ul>
            <li>
              <label htmlFor="email">Email:</label>
              <input 
                type="email" 
                id="email" 
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </li>
            <li>
              <label htmlFor="password">Password:</label>
              <input 
                type="password" 
                id="password" 
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </li>
            <li>
              <em></em>
              <a>
                Forgot password? Sorry lol
              </a>
            </li>
          </ul>
        </fieldset>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <button 
          type="button" 
          onClick={() => window.location.href = '/signup'}
          disabled={loading}
        >
          Create an Account
        </button>
      </form>
    </section>
  );
};

export default LoginPage;