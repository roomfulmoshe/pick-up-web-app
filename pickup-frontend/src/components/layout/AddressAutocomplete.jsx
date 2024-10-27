import React, { useEffect, useState } from 'react';

const api_key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-script';

const AddressAutocomplete = ({ 
  value, 
  onChange,
  error 
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [loadError, setLoadError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!api_key) {
        console.log(api_key)
      setLoadError('Google Maps API key is missing');
      return;
    }

    // Check if script is already loaded
    if (document.getElementById(GOOGLE_MAPS_SCRIPT_ID)) {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
      }
      return;
    }

    const loadGoogleMapsScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = GOOGLE_MAPS_SCRIPT_ID;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          setIsLoaded(true);
          resolve();
        };
        
        script.onerror = () => {
          setLoadError('Failed to load Google Maps API');
          reject(new Error('Failed to load Google Maps API'));
        };

        document.head.appendChild(script);
      });
    };

    loadGoogleMapsScript().catch(console.error);

    // Cleanup function
    return () => {
      // Don't remove the script on unmount as it might be needed by other components
      setIsLoaded(false);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }

    const inputElement = document.getElementById('address-input');
    if (!inputElement) return;

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
        types: ['address'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry) {
          setLoadError('Please select an address from the dropdown.');
          return;
        }

        const addressData = {
          address: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };

        setInputValue(place.formatted_address);
        onChange(addressData);
        setLoadError(null);
      });
    } catch (error) {
      console.error('Error initializing Google Maps Autocomplete:', error);
      setLoadError('Error initializing address autocomplete');
    }
  }, [isLoaded, onChange]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Clear any existing error when user starts typing
    if (loadError) setLoadError(null);
  };

  return (
    <>
      <input
        id="address-input"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={isLoaded ? "Enter the game location address" : "Loading address autocomplete..."}
        className={error || loadError ? 'error' : ''}
        disabled={!isLoaded}
      />
      {loadError && <span className="error">{loadError}</span>}
      {error && <span className="error">{error}</span>}
    </>
  );
};

export default AddressAutocomplete;