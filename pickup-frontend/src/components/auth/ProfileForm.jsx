import React, { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/profileForm.css';



const SPORTS = [
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'soccer', name: 'Soccer', icon: '⚽' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
  { id: 'baseball', name: 'Baseball', icon: '⚾' },
  { id: 'football', name: 'Football', icon: '🏈' }
];

const SKILL_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'New to the sport' },
  { id: 'intermediate', label: 'Intermediate', description: 'Played recreationally' },
  { id: 'advanced', label: 'Advanced', description: 'Competitive experience' }
];



// Supposed to use props { user, onComplete }
const PostSignupForm = ({ user1, onComplete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();


  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || '',
    preferences: {
      sports: [],
      skillLevels: {}
    },
    location: {
      latitude: null,
      longitude: null
    }
  });

  const [errors, setErrors] = useState({});

  const handleSportToggle = (sportId) => {
    setFormData(prev => {
      const sports = prev.preferences.sports.includes(sportId)
        ? prev.preferences.sports.filter(id => id !== sportId)
        : [...prev.preferences.sports, sportId];

      // If sport is removed, remove its skill level too
      const skillLevels = { ...prev.preferences.skillLevels };
      if (!sports.includes(sportId)) {
        delete skillLevels[sportId];
      }

      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          sports,
          skillLevels
        }
      };
    });
  };

  const handleSkillLevelChange = (sportId, level) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        skillLevels: {
          ...prev.preferences.skillLevels,
          [sportId]: level
        }
      }
    }));
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setErrors(prev => ({
            ...prev,
            location: 'Could not get your location. Please try again.'
          }));
        }
      );
    } else {
      setErrors(prev => ({
        ...prev,
        location: 'Geolocation is not supported by your browser.'
      }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    switch (currentStep) {
      case 1:
        if (!formData.displayName?.trim()) {
          newErrors.displayName = 'Display name is required';
        }
        break;
      case 2:
        if (formData.preferences.sports.length === 0) {
          newErrors.sports = 'Please select at least one sport';
        }
        formData.preferences.sports.forEach(sport => {
          if (!formData.preferences.skillLevels[sport]) {
            newErrors[`skill_${sport}`] = 'Please select a skill level';
          }
        });
        break;
      case 3:
        if (!formData.location.latitude || !formData.location.longitude) {
          newErrors.location = 'Please share your location';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    if (step < 3) {
      setStep(prev => prev + 1);
      return;
    }

    setLoading(true);
    try {
      // Prepare user data for Firestore
      const userData = {
        uid: user.uid,
        displayName: formData.displayName,
        email: user.email,
        photoURL: formData.photoURL,
        likedGames: [],
        unlikedGames: [],
        playerRating: { ratingSum: 0, numPeopleRated: 0 },
        hostRating: { ratingSum: 0, numPeopleRated: 0 },
        preferences: formData.preferences,
        location: formData.location,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp()
      };
       console.log(userData)

      // Update Firestore
      await setDoc(doc(db, 'users', user.uid), userData);
      onComplete?.();
      navigate("/");
    } catch (error) {
      console.error('Error saving user data:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save your profile. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-signup-container">
      <div className="post-signup-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        <div className="steps-labels">
          <span className={step >= 1 ? 'active' : ''}>Profile</span>
          <span className={step >= 2 ? 'active' : ''}>Sports</span>
          <span className={step >= 3 ? 'active' : ''}>Location</span>
        </div>
      </div>

      <div className="post-signup-form">
        {step === 1 && (
          <div className="form-step">
            <h2>Complete Your Profile</h2>
            <p>Let other players know who you are</p>

            <div className="input-group">
              <label>Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  displayName: e.target.value
                }))}
                placeholder="How should we call you?"
                className={errors.displayName ? 'error' : ''}
              />
              {errors.displayName && (
                <span className="error-message">{errors.displayName}</span>
              )}
            </div>

            <div className="input-group">
              <label>Photo URL (OPTIONAL)</label>
              <div className="photo-upload">
                <input
                type="text"
                value={formData.photoURL}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  displayName: e.target.value
                }))}
                placeholder="Profile Photo URL"
              />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h2>Select Your Sports</h2>
            <p>Choose the sports you're interested in and your skill level</p>

            <div className="sports-selection">
              {SPORTS.map(sport => (
                <div key={sport.id} className="sport-card">
                  <button
                    type="button"
                    onClick={() => handleSportToggle(sport.id)}
                    className={`sport-toggle ${
                      formData.preferences.sports.includes(sport.id) ? 'selected' : ''
                    }`}
                  >
                    <span className="sport-icon">{sport.icon}</span>
                    <span className="sport-name">{sport.name}</span>
                  </button>

                  {formData.preferences.sports.includes(sport.id) && (
                    <div className="skill-level-select">
                      {SKILL_LEVELS.map(level => (
                        <button
                          key={level.id}
                          type="button"
                          onClick={() => handleSkillLevelChange(sport.id, level.id)}
                          className={`skill-button ${
                            formData.preferences.skillLevels[sport.id] === level.id ? 'selected' : ''
                          }`}
                        >
                          {level.label}
                          <span className="skill-description">{level.description}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {errors.sports && (
              <span className="error-message">{errors.sports}</span>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h2>Share Your Location</h2>
            <p>This helps us show you games nearby</p>

            <div className="location-section">
              {formData.location.latitude && formData.location.longitude ? (
                <div className="location-confirmed">
                  <span className="success-icon">✓</span>
                  <p>Location successfully captured!</p>
                  <button 
                    type="button" 
                    className="secondary-button"
                    onClick={getUserLocation}
                  >
                    Update Location
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  className="location-button"
                  onClick={getUserLocation}
                >
                  Share Location
                </button>
              )}
              
              {errors.location && (
                <span className="error-message">{errors.location}</span>
              )}
            </div>
          </div>
        )}

        <div className="form-actions">
          {step > 1 && (
            <button
              type="button"
              className="secondary-button"
              onClick={() => setStep(prev => prev - 1)}
            >
              Back
            </button>
          )}
          
          <button
            type="button"
            className="primary-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : step === 3 ? 'Complete Setup' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostSignupForm;