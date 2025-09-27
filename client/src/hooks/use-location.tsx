import { useState, useEffect } from "react";

interface LocationData {
  city: string;
  state?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
  hasPermission: boolean;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const reverseGeocode = async (lat: number, lng: number): Promise<LocationData> => {
    try {
      // Using a free geocoding service (you can replace with your preferred service)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get location data');
      }
      
      const data = await response.json();
      
      return {
        city: data.city || data.locality || data.principalSubdivision || "Unknown City",
        state: data.principalSubdivision,
        country: data.countryName,
        coordinates: { lat, lng }
      };
    } catch (err) {
      // Fallback location data
      return {
        city: "Mumbai",
        state: "Maharashtra", 
        country: "India",
        coordinates: { lat, lng }
      };
    }
  };

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First check permission
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setHasPermission(permission.state === 'granted');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const locationData = await reverseGeocode(latitude, longitude);
            setLocation(locationData);
            setHasPermission(true);
            setLoading(false);
            
            // Store in localStorage for future visits
            localStorage.setItem('userLocation', JSON.stringify(locationData));
          } catch (err) {
            setError("Failed to get location details");
            setLoading(false);
          }
        },
        (err) => {
          let errorMessage = "Unable to get your location";
          
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = "Location access denied by user";
              setHasPermission(false);
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case err.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
          }
          
          setError(errorMessage);
          setLoading(false);
          
          // Fallback to default location
          setLocation({
            city: "Mumbai",
            state: "Maharashtra",
            country: "India"
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } catch (err) {
      setError("Failed to request location");
      setLoading(false);
    }
  };

  // Check for stored location on mount
  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      try {
        setLocation(JSON.parse(storedLocation));
        setHasPermission(true);
      } catch (err) {
        console.error('Failed to parse stored location:', err);
      }
    } else {
      // Set default location
      setLocation({
        city: "Mumbai",
        state: "Maharashtra",
        country: "India"
      });
    }
  }, []);

  return {
    location,
    loading,
    error,
    requestLocation,
    hasPermission
  };
}