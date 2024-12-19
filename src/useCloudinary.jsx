import { useState, useEffect } from 'react';

export const useCloudinary = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkCloudinary = () => {
      if (window.cloudinary) {
        setIsLoaded(true);
      } else {
        setTimeout(checkCloudinary, 100);
      }
    };
    
    checkCloudinary();
  }, []);

  return isLoaded;
};