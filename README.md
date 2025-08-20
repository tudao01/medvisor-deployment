# MedVisor AI - Frontend Integration

This is the React frontend for MedVisor AI, integrated with the Hugging Face Spaces backend for medical image analysis and AI chat functionality.

## 🏥 Features

- **Medical Image Analysis**: Upload and analyze spine images using UNet segmentation
- **Disc Detection**: Automatic detection and analysis of individual spinal discs
- **AI Chat Assistant**: Interactive chatbot for medical queries
- **Modern UI**: Built with React and Chakra UI for a professional medical interface

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medvisor-deployment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_SPACES_URL=https://tudao01-medvisor-ai.hf.space
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Backend Integration

### Hugging Face Spaces Backend

The frontend is integrated with the Hugging Face Spaces backend (`medvisor-ai`) which provides:

- **UNet Segmentation**: Spine structure detection and segmentation
- **Disc Analysis**: Individual disc extraction and pathology analysis
- **AI Chat**: Medical information chatbot using NLTK

### API Endpoints

The frontend communicates with the backend through these endpoints:

- **Image Processing**: `/run/process_image` - Analyzes medical images
- **Chat**: `/run/chat_with_bot` - Handles chatbot conversations

### Data Flow

1. **Image Upload**: User selects a medical image
2. **Backend Processing**: Image is sent to Hugging Face Spaces
3. **UNet Segmentation**: Spine structures are detected and segmented
4. **Disc Extraction**: Individual discs are identified and analyzed
5. **Results Display**: Analysis results are shown in the UI

## 📁 Project Structure

```
medvisor-deployment/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── HomePage.js    # Main image analysis interface
│   │   └── ChatBot.js     # AI chat component
│   ├── utils/
│   │   └── api.js         # API utilities for HF Spaces
│   ├── App.js             # Main app component
│   └── index.js           # Entry point
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🎯 Key Components

### HomePage.js
- **File Upload Interface**: Drag-and-drop image upload
- **Image Processing**: Integration with Hugging Face Spaces backend
- **Results Display**: Shows processed images and disc analysis
- **Responsive Design**: Mobile-friendly interface

### ChatBot.js
- **Floating Chat Interface**: Always-accessible chat widget
- **AI Integration**: Connected to Hugging Face Spaces chatbot
- **Message History**: Maintains conversation context

### api.js
- **SpacesAPI Class**: Handles all backend communication
- **Error Handling**: Robust error handling and user feedback
- **Data Formatting**: Converts backend responses to frontend format

## 🔌 API Integration Details

### Image Processing

```javascript
// Process image with disc detection
const result = await spacesAPI.processImageWithDiscDetection(imageFile);

// Extract results
const processedImage = result.data[0];        // Processed image
const analysisResults = result.data[1];       // Analysis text
```

### Chat Integration

```javascript
// Send message to chatbot
const result = await spacesAPI.chatWithBot(message, history);

// Extract response
const botResponse = result.data[0];
```

## 🎨 UI/UX Features

- **Professional Medical Design**: Clean, trustworthy interface
- **Responsive Layout**: Works on all device sizes
- **Loading States**: Clear feedback during processing
- **Error Handling**: User-friendly error messages
- **Success Notifications**: Toast notifications for user feedback

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in the `build/` directory can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

### Environment Configuration
Ensure the following environment variables are set:
- `REACT_APP_SPACES_URL`: Hugging Face Spaces backend URL

## 🔍 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Check if Hugging Face Space is running
   - Verify the `REACT_APP_SPACES_URL` environment variable
   - Check browser console for CORS errors

2. **Image Processing Errors**
   - Ensure image format is supported (JPEG, PNG)
   - Check image size (should be reasonable, not too large)
   - Verify backend models are loaded

3. **Chat Not Working**
   - Check if chat endpoint is accessible
   - Verify message format is correct
   - Check browser console for API errors

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'true');
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👥 Team

- Love Bhusal
- Tu Dao
- Elden Delguia
- Riley Mckinney
- Sai Peram
- Rishil Uppaluru

## 📞 Support

For technical support or questions:
- Check the Hugging Face Space: https://tudao01-medvisor-ai.hf.space
- Review the backend repository: `medvisor-ai`
- Check browser console for error messages

---

**Note**: This tool is for educational and research purposes only. Always consult with healthcare professionals for medical decisions.
