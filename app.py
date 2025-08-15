# app.py (Updated to return both text and audio)
import io
import os
import base64 # Import for encoding audio
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from gtts import gTTS
from fastapi.responses import JSONResponse # Use JSONResponse for custom objects
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
from typing import Dict, List

# --- Setup ---
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in .env file.")
genai.configure(api_key=GEMINI_API_KEY)

chat_histories: Dict[str, List[Dict[str, str]]] = {}

app = FastAPI(title="Holo-Deck Voice Agent Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

class QueryRequest(BaseModel):
    text: str

@app.get("/agent/sessions")
async def get_all_sessions():
    return {"session_ids": list(chat_histories.keys())}

@app.get("/agent/chat/{session_id}")
async def get_chat_history(session_id: str):
    if session_id not in chat_histories:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"history": chat_histories.get(session_id, [])}

@app.post("/agent/chat/{session_id}")
async def agent_chat(session_id: str, request: QueryRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text query cannot be empty.")
    try:
        history = chat_histories.get(session_id, [])
        model = genai.GenerativeModel('gemini-1.5-flash')
        chat = model.start_chat(history=history)
        response = chat.send_message(request.text)
        llm_response_text = response.text
        
        chat_histories[session_id] = chat.history

        mp3_fp = io.BytesIO()
        tts = gTTS(text=llm_response_text, lang='en')
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)
        
        # Encode the MP3 data into a Base64 string
        audio_base64 = base64.b64encode(mp3_fp.read()).decode('utf-8')

        # Return both the text and the Base64 audio data
        return JSONResponse(content={
            "responseText": llm_response_text,
            "audioData": audio_base64
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")