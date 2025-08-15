// script.js (Final version with smooth "New Chat" and all features)
document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const ttsInput = document.getElementById('tts-input');
    const recordButton = document.getElementById('record-button');
    const speakButton = document.getElementById('speak-button');
    const sessionList = document.getElementById('session-list');
    const chatLog = document.getElementById('chat-log');
    const newChatBtn = document.getElementById('new-chat-btn');
    const audioPlayer = document.getElementById('audio-player'); // Use the invisible player from HTML
    
    let sessionId = null;

    // --- Helper function to add a message to the chat log UI ---
    const addMessageToLog = (role, text) => {
        if (!chatLog) return;
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message');
        const roleDiv = document.createElement('div');
        roleDiv.classList.add('role');
        roleDiv.textContent = role;
        const textDiv = document.createElement('div');
        textDiv.textContent = text;
        messageDiv.appendChild(roleDiv);
        messageDiv.appendChild(textDiv);
        chatLog.appendChild(messageDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    // --- Main Initialization function, runs on page load ---
    const initializePage = async () => {
        // Manage Session ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('session_id')) {
            sessionId = urlParams.get('session_id');
            try {
                const response = await fetch(`http://127.0.0.1:8000/agent/chat/${sessionId}`);
                if (response.ok) {
                    const data = await response.json();
                    chatLog.innerHTML = '';
                    data.history.forEach(message => {
                        addMessageToLog(message.role, message.parts[0]);
                    });
                } else {
                    // If server doesn't recognize the session, start a new one
                    startNewChat(false); // false means don't add to sidebar yet
                }
            } catch (error) { console.error("Failed to load chat history:", error); }
        } else {
            startNewChat(false);
        }

        // Fetch and display all past sessions in the sidebar
        await populateSidebar();
    };

    // --- NEW: Helper to populate the sidebar ---
    const populateSidebar = async () => {
         try {
            const response = await fetch('http://127.0.0.1:8000/agent/sessions');
            const data = await response.json();
            sessionList.innerHTML = '';
            data.session_ids.forEach(id => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `?session_id=${id}`;
                link.textContent = id;
                if (id === sessionId) { link.classList.add('active'); }
                listItem.appendChild(link);
                sessionList.appendChild(listItem);
            });
        } catch (error) { console.error("Failed to load sessions:", error); }
    };

    // --- NEW: Function to handle starting a new chat ---
    const startNewChat = (addToSidebar = true) => {
        // Add the previous session to the sidebar if it had content
        if (addToSidebar && chatLog.children.length > 0) {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `?session_id=${sessionId}`;
            link.textContent = sessionId;
            // Prepend to show the most recent chats first
            sessionList.prepend(listItem); 
        }

        // Clear the current UI
        chatLog.innerHTML = '';
        ttsInput.value = '';

        // Generate a new session ID and update the URL without reloading
        sessionId = `session_${Date.now()}`;
        window.history.pushState({sessionId: sessionId}, '', `?session_id=${sessionId}`);
        
        // Update the active link in the sidebar
        document.querySelectorAll('#session-list li a.active').forEach(el => el.classList.remove('active'));
    };

    // --- Helper function to get the AI's spoken response ---
    const getAiAudioResponse = async (textToProcess) => {
        if (!textToProcess || !textToProcess.trim()) return;
        addMessageToLog('user', textToProcess);
        ttsInput.value = '';
        
        try {
            const response = await fetch(`http://127.0.0.1:8000/agent/chat/${sessionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToProcess }),
            });
            if (!response.ok) throw new Error('Server error');
            
            const data = await response.json();
            addMessageToLog('model', data.responseText);
            
            const audioUrl = `data:audio/mpeg;base64,${data.audioData}`;
            audioPlayer.src = audioUrl;
            audioPlayer.play();

        } catch (error) {
            console.error('Error getting AI response:', error);
            addMessageToLog('system', `Error: ${error.message}`);
        }
    };

    // --- Event Listeners ---
    
    // NEW: Smart "New Chat" button
    newChatBtn.addEventListener('click', () => {
        startNewChat(true); // true means save the previous chat to the sidebar
    });

    speakButton.addEventListener('click', () => getAiAudioResponse(ttsInput.value));
    ttsInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') { getAiAudioResponse(ttsInput.value); }
    });

    // Speech Recognition Logic
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.onresult = (event) => getAiAudioResponse(event.results[0][0].transcript);
        recordButton.addEventListener('click', () => recognition.start());
    } else {
        alert("Speech Recognition is not supported by your browser.");
    }
    
    initializePage();
});