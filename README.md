# 🤖 Holo-Deck Voice Agent

A full-stack, conversational AI voice agent built as part of the **#30DaysofVoiceAgents** challenge. This project features a futuristic "Holo-Deck" user interface where users can have multi-turn, contextual conversations with an AI powered by Google's Gemini.

---

## ✨ Features

-   **🗣️ Voice & Text Conversations:** Interact with the agent using either your voice or by typing.
-   **🧠 Conversational Memory:** The agent remembers previous parts of the conversation within a session, allowing for follow-up questions and contextual understanding.
-   **🔊 AI-Generated Voice Responses:** The agent's replies are spoken back to the user using a Text-to-Speech engine.
-   **📜 Conversation History:** A sidebar displays links to previous chat sessions, allowing you to review them.
-   **🚀 Futuristic UI:** A custom-styled interface with animations and a "Holo-Deck" theme.

---

## 🏛️ Architecture

The application is built on a simple but powerful client-server model.

-   **Frontend (Client):** A static web interface built with **HTML, CSS, and vanilla JavaScript**. It captures the user's voice using the browser's built-in **Web Speech API** (`SpeechRecognition`) and communicates with the backend via `fetch` requests.

-   **Backend (Server):** A **Python** server built with the **FastAPI** framework. It exposes API endpoints to handle the core AI logic.

### Conversational Flow
The primary conversational loop works as follows:
`User Voice` -> `Browser (SpeechRecognition)` -> `User Text` -> `FastAPI Backend` -> `Google Gemini API` -> `AI Response Text` -> `gTTS` -> `Audio Output` -> `Browser`

---

## 🛠️ Tech Stack

-   **Backend:** Python 3.9+, FastAPI, Uvicorn
-   **LLM (Language Model):** Google Gemini API (`gemini-1.5-flash`)
-   **Text-to-Speech (TTS):** gTTS (Google Text-to-Speech)
-   **Frontend:** HTML5, CSS3, Vanilla JavaScript
-   **Key Browser APIs:** Web Speech API (`SpeechRecognition`), Fetch API

---

## 🚀 How to Run Locally

Follow these steps to set up and run the project on your local machine.

### 1. Prerequisites
-   Python 3.9+
-   An API key from [Google AI Studio](https://ai.google.dev/gemini-api/docs/quickstart) for the Gemini API.

### 2. Backend Setup
First, set up and run the Python server.

```bash
# Clone the repository (replace with your own git repo URL if you have one)
git clone <your-repo-url>
cd <your-project-folder>

# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

# Install the required dependencies
pip install -r requirements.txt
```

### 3. Environment Variables
Create a file named `.env` in the root of your project folder. This file will store your secret API key.

```
# .env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

### 4. Running the Application
This project requires **two terminals** running at the same time.

**In your first terminal, start the backend server:**
```bash
uvicorn app:app --reload
```
This will run on `http://127.0.0.1:8000`. Leave it running.

**In your second terminal, start the frontend server:**
```bash
# Make sure you are in the same main project folder
python -m http.server 8001
```

### 5. Access the Holo-Deck
Open your web browser and navigate to:
**`http://localhost:8001`**

You can now start a conversation with your voice agent!