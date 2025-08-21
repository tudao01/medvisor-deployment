// API utilities for communicating with Hugging Face Spaces backend
import config from '../config.js';

class SpacesAPI {
  constructor(baseURL = config.SPACES_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Health check to see if the space is running
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      if (response.ok) {
        return await response.json();
      }
      return { status: 'error', message: 'Space not responding' };
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: error.message };
    }
  }

  // Process image using the Gradio interface
  async processImage(imageFile) {
    try {
      // For Gradio, we need to use their API format
      const formData = new FormData();
      formData.append('data', imageFile);
      
      const response = await fetch(`${this.baseURL}/run/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Image processing failed:', error);
      throw error;
    }
  }

  // Process image using the default Gradio endpoint
  async processImageWithDiscDetection(imageFile) {
    try {
      // Validate file before sending
      if (!imageFile || !(imageFile instanceof File)) {
        throw new Error('Invalid file object');
      }
      
      // Additional validation
      if (imageFile.size === 0) {
        throw new Error('File is empty');
      }
      
      console.log('File details:', {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type
      });
      
      // Create a fresh FormData object
      const formData = new FormData();
      
      // Try to create a new File object to avoid corruption
      try {
        const freshFile = new File([imageFile], imageFile.name, { type: imageFile.type });
        formData.append('data', freshFile);
        console.log('Fresh file created, size:', freshFile.size);
      } catch (fileError) {
        console.warn('Could not create fresh file, using original:', fileError);
        formData.append('data', imageFile);
      }
      
      // Use the default Gradio endpoint - this will call your process_image function
      const response = await fetch(`${this.baseURL}/run/predict`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Length header - let the browser handle it
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result); // Debug logging
      return result;
    } catch (error) {
      console.error('Image processing with disc detection failed:', error);
      throw error;
    }
  }

  // Chat with the bot using the chat_with_bot function
  async chatWithBot(message, history = []) {
    try {
      const response = await fetch(`${this.baseURL}/run/chat_with_bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [message, history]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Chat with bot failed:', error);
      throw error;
    }
  }

  // Alternative: Use Gradio's queue API for chat
  async chatWithGradio(message, history = []) {
    try {
      const response = await fetch(`${this.baseURL}/run/chat_with_bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [message, history]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Gradio chat failed:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const spacesAPI = new SpacesAPI();

export default spacesAPI;
