import { useEffect, useRef } from 'react';
import { useCloudinary } from '../useCloudinary';

const CloudinaryUploadWidget = ({ onUpload }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const isCloudinaryLoaded = useCloudinary();

  useEffect(() => {
    if (isCloudinaryLoaded && !cloudinaryRef.current) {
      cloudinaryRef.current = window.cloudinary;
      widgetRef.current = createWidget();
    }
  }, [isCloudinaryLoaded]);

  const createWidget = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.warn('Cloudinary configuration missing');
      return null;
    }

    return cloudinaryRef.current.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        maxFileSize: 5000000, // 5MB
        resourceType: 'image',
        acceptedFiles: {
          extensions: ['.jpg', '.png', '.gif'],
          mimeTypes: ['image/jpeg', 'image/png', 'image/gif']
        }
      },
      (error, result) => {
        if (error || result.event === 'success') {
          onUpload(error, result);
        }
      }
    );
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return (
    <button 
      type="button"
      onClick={handleClick}
      disabled={!isCloudinaryLoaded}
      className={`w-full text-sm text-gray-500 py-2 px-4 border-0 font-semibold bg-red-600 text-white hover:bg-red-700 cursor-pointer mt-1 rounded ${!isCloudinaryLoaded ? 'opacity-50' : ''}`}
    >
      {isCloudinaryLoaded ? 'Subir imagen' : 'Cargando...'}
    </button>
  );
};

export default CloudinaryUploadWidget;