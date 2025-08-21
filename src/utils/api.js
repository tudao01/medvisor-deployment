// utils/api.js
import { Client } from "@gradio/client";

class SpacesAPI {
  constructor(spaceId = "tudao01/medvisor-ai") {
    this.spaceId = spaceId;
    this.clientPromise = Client.connect(this.spaceId);
  }

  async processImageWithDiscDetection(imageFile) {
    const client = await this.clientPromise;
    const result = await client.predict("/process_image", {
      image: imageFile,
    });
    return result;
  }

  async chatWithBot(message, history = []) {
    const client = await this.clientPromise;
    const result = await client.predict("/chat_with_bot", {
      message,
      history,
    });
    return result;
  }

  async resetChat() {
    const client = await this.clientPromise;
    const result = await client.predict("/lambda", {});
    return result;
  }
}

const spacesAPI = new SpacesAPI();
export default spacesAPI;
