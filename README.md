# AIM MedVisor: Simplifying MRI Analysis with AI

## Project Overview

AIM MedVisor is an AI-powered medical tool designed to streamline the diagnosis of spinal abnormalities through advanced MRI analysis. By leveraging dual-model AI systems, MedVisor reduces the barriers to diagnosis, making spinal health assessments more efficient and accessible.

## Problem Statement

The path from identifying symptoms like "my back hurts" to diagnosing conditions such as intervertebral disc degeneration is complex and time-consuming. Current spinal assessment practices, which analyze MRI scans per vertebra, are hindered by manual processes and a steep learning curve.

## Solution

AIM MedVisor introduces a two-model system to address these challenges:

1. **Segmentation Model**: Processes full spine MRI scans to identify individual vertebrae and discs. The segmentation model is trained on a **UNet architecture** and utilizes **OpenCV** for boxing regions of interest.
2. **Classification Model**: Classifies individual vertebrae to detect and grade disk deviations based on established grading systems like Pfirrmann and Modic. The diagnosis model is powered by a **ResNet50 architecture** for precise and reliable classification.

## Key Features

- **Dual-Model Architecture**: Enhances the accuracy of segmentation and classification tasks.
- **Tech Stack**:
  - **Model Development**: TensorFlow, PyTorch, Keras, SimpleITK, OpenCV
  - **Application**: React (Chakra UI), Python (Flask)
- **Expandable Scope**: Designed for future capabilities, including symptom progression prediction and user-friendly interfaces for non-professionals.

## How It Works

1. **Input**: Full spine MRI scan.
2. **Step 1**: Segmentation Model isolates individual vertebrae and discs using a UNet model with OpenCV for region boxing.
3. **Step 2**: Classification Model grades and diagnoses detected abnormalities using ResNet50.

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- TensorFlow and PyTorch installed

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/YourUsername/AIM-MedVisor.git
   cd AIM-MedVisor
   ```
2. Set up the backend:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    python app.py
    ```
3. Set up the frontend:
   ```bash
   npm install
   npm start
   ```
