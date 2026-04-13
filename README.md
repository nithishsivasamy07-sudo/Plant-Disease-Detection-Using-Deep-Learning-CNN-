# 🌿 Plant Disease Detection System

A modern, AI-powered web application designed to help farmers and gardeners identify plant diseases quickly and accurately using Deep Learning.

![AI Detection](https://images.unsplash.com/photo-1597338830232-d8248b8fd96c?auto=format&fit=crop&q=80&w=1200)

## 🚀 Overview

This system allows users to upload images of plant leaves or use their device's camera for real-time analysis. Using advanced Convolutional Neural Network (CNN) logic (powered by Supabase Edge Functions), the app identifies the disease, provides a confidence score, and suggests remedies, including pesticides and treatment protocols.

## ✨ Key Features

- **🔍 AI Disease Detection**: Instant identification of plant diseases from leaf images.
- **📸 Live Camera Capture**: Real-time preview and capture for on-the-spot analysis.
- **💬 AI Chatbot Support**: Interactive assistant to help with plant care and disease-related queries.
- **📜 Detection History**: Keep track of previous diagnoses and monitor plant health over time.
- **🌐 Multi-language Support**: Accessible interface for diverse users.
- **🔒 Secure Authentication**: User accounts to save data securely via Supabase.

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend & Database**: Supabase (Auth, Storage, Database)
- **AI Processing**: Supabase Edge Functions (Deno Runtime)
- **Deployment**: Lovable.dev

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/plant-disease-detection.git
   cd plant-disease-detection
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:8081](http://localhost:8081)

## 📁 Project Structure

- `src/pages`: Main application views (Detect, History, Auth, Index).
- `src/components`: Reusable UI components (Navbar, ChatBot, Layout).
- `src/integrations`: Supabase client configuration.
- `supabase/functions`: Edge functions for AI detection logic.

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Developed with ❤️ to empower agriculture through technology.*
