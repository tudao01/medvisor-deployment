// utils/api.js
import { Client } from "@gradio/client";

class SpacesAPI {
  constructor(spaceId = "tudao01/medvisor-ai") {
    this.spaceId = spaceId;
    this.clientPromise = Client.connect(this.spaceId);
  }

  async processImageWithDiscDetection(imageFile) {
    try {
      console.log('Connecting to Hugging Face Space:', this.spaceId);
      const client = await this.clientPromise;
      
      console.log('Processing image with file:', imageFile.name, 'size:', imageFile.size);
      
      const result = await client.predict("/process_image", {
        image: imageFile,
      });
      
      console.log('Raw API result:', result);
      
      // The result should contain:
      // - result.data[0]: processed image
      // - result.data[1]: JSON string with disc analysis
      
      return result;
    } catch (error) {
      console.error('Error in processImageWithDiscDetection:', error);
      throw error;
    }
  }

  async chatWithBot(message, history = []) {
    try {
      const client = await this.clientPromise;
      const result = await client.predict("/chat_with_bot", {
        message,
        history,
      });
      return result;
    } catch (error) {
      console.error('Error in chatWithBot:', error);
      throw error;
    }
  }

  async resetChat() {
    try {
      const client = await this.clientPromise;
      const result = await client.predict("/lambda", {});
      return result;
    } catch (error) {
      console.error('Error in resetChat:', error);
      throw error;
    }
  }
}

const spacesAPI = new SpacesAPI();
export default spacesAPI;