// MedVisor AI Frontend Configuration
// Update these values based on your deployment environment

const config = {
  // Hugging Face Spaces Backend URL
  SPACES_BASE_URL: process.env.REACT_APP_SPACES_URL || 'https://tudao01-medvisor-ai.hf.space',
  
  // API Configuration
  API_TIMEOUT: 30000, // 30 seconds
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  
  // Supported Image Formats
  SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png'],
  
  // UI Configuration
  UPLOAD_AREA_HEIGHT: 300,
  MAX_PREVIEW_HEIGHT: 400,
  
  // Debug Mode
  DEBUG_MODE: process.env.NODE_ENV === 'development',
};

export default config;
