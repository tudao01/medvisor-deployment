// API utilities for communicating with Hugging Face Spaces backend
import config from '../../config.js';

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

  // Process image using the specific process_image function
  async processImageWithDiscDetection(imageFile) {
    try {
      const formData = new FormData();
      formData.append('data', imageFile);
      
      const response = await fetch(`${this.baseURL}/run/process_image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
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
