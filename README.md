# 🤖 Enchanted Holo-Deck Voice Agent

[![View on GitHub](https://img.shields.io/badge/GitHub-View_Source-blue?logo=github)](https://github.com/adyashaaa28/holo-deck-voice-agent)

A full-stack, conversational AI voice agent built as part of the **#30DaysofVoiceAgents** challenge. This project features a magical "Enchanted Holo-Deck" user interface where users can have multi-turn, contextual conversations with an AI that has a selectable personality and special, real-world skills.

**Live Demo:** **[Link to your Live Deployed App]**

---

## ✨ Features

-   **🗣️ Voice & Text Conversations:** Interact with the agent using either your voice (via the browser's Web Speech API) or by typing.
-   **🎭 Selectable AI Personalities:** Choose from a list of personas (e.g., Helpful Assistant, Pirate Captain) to change the AI's tone and style.
-   **🧠 Conversational Memory & Persistent History:** The agent remembers the context of your conversation. All chats are saved to a file, so they persist even after the server restarts.
-   **📜 Conversation History UI:** A sidebar displays links to all previous chat sessions, allowing you to review and reload them.
-   **🛠️ Special Skills (Gemini Function Calling):** The agent can use tools to answer questions beyond its training data:
    -   **🌦️ Real-time Weather:** Ask "What's the weather in Tokyo?" to get live weather data.
    -   **🌐 Live Web Search:** Ask "Who won the latest F1 race?" to get up-to-date information from the internet.

---

## 🏛️ Architecture

The application uses a modern client-server model.

-   **Frontend (Client):** A dynamic, single-page application built with **HTML, CSS, and vanilla JavaScript**.
-   **Backend (Server):** A **Python** server built with the **FastAPI** framework that manages chat state and orchestrates calls to external AI services.

### Conversational Flow
`User Input (Voice/Text)` -> `JS Frontend` -> `FastAPI Backend` -> `Google Gemini API` -> **[Decides if a Tool is Needed]** -> `[Calls Weather/Search API]` -> `[Returns Data to Gemini]` -> `Final AI Text` -> `gTTS` -> `Audio` -> `JS Frontend`

---

## 🛠️ Tech Stack

-   **Backend:** Python 3.9+, FastAPI, Uvicorn
-   **LLM & Function Calling:** Google Gemini API (`gemini-1.5-flash`)
-   **Special Skills APIs:** Open-Meteo (Weather), Tavily (Web Search)
-   **Text-to-Speech (TTS):** gTTS (Google Text-to-Speech)
-   **Frontend:** HTML5, CSS3, Vanilla JavaScript (Web Speech API)

---

## 🚀 How to Run Locally

### 1. Prerequisites
-   Python 3.9+
-   API keys for [Google Gemini](https://ai.google.dev/gemini-api/docs/quickstart) and [Tavily AI](https://tavily.com/).

### 2. Setup
```bash
# Clone the repository
git clone [https://github.com/adyashaaa28/holo-deck-voice-agent.git](https://github.com/adyashaaa28/holo-deck-voice-agent.git)
cd holo-deck-voice-agent

# Create and activate a virtual environment
python -m venv venv
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate

# Install the required dependencies
pip install -r requirements.txt
```

### 3. Environment Variables
Create a file named `.env` in the root of your project folder and add your secret API keys.

```
# .env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
TAVILY_API_KEY="YOUR_TAVILY_API_KEY_HERE"
```

### 4. Running the Application
This project is configured to run with a **single command**.

**In your terminal, start the server:**
```bash
uvicorn app.main:app --reload
```

### 5. Access the Holo-Deck
Open your web browser and navigate to:
**`http://127.0.0.1:8000`**
