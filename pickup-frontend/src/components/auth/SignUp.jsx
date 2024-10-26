import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../services/firebase';
import '../../styles/SignUp.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
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
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Add username to the user profile
      await updateProfile(userCredential.user, {
        displayName: formData.username
      });

      // Redirect to home page after successful signup
      setError("SUCCESSFUL sign up");
       // Use navigate instead of window.location.href
      navigate('/profileForm');
      
    } catch (err) {
      let errorMessage = '';
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.';
          break;
        default:
          errorMessage = 'An error occurred during registration.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="entry-page">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up!</h2>
        <fieldset>
          <legend>Create Account</legend>
          {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}
          <ul>
            <li>
              <label htmlFor="username">Username:</label>
              <input 
                type="text" 
                id="username" 
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </li>
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
                minLength="6"
              />
            </li>
          </ul>
        </fieldset>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Submit'}
        </button>
        <button 
          type="button" 
          onClick={() => window.location.href = '/login'}
          disabled={loading}
        >
          Have an Account?
        </button>
      </form>
    </section>
  );
};

export default SignUp;