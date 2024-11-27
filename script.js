// script.js

let dataset = [];

// Load Dataset from File
function loadDataset(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        dataset = parseDataset(content);
        alert("Dataset loaded successfully!");
    };
    reader.readAsText(file);
}

// Parse Dataset into Question-Answer Pairs
function parseDataset(content) {
    const lines = content.split("\n").filter(line => line.trim() !== "");
    return lines.map(line => {
        const [question, answer] = line.split("\t");
        return { question: question.trim(), answer: answer.trim() };
    });
}

// Toggle Chatbot Popup
function toggleChatbot() {
    const chatbotPopup = document.getElementById("chatbot-popup");
    chatbotPopup.style.display = chatbotPopup.style.display === "block" ? "none" : "block";
}

// Automatically Scroll Chat History to Bottom
function scrollChatToBottom() {
    const chatHistory = document.getElementById("chat-history");
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Send Message Functionality
function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatHistory = document.getElementById("chat-history");

    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Add user message to chat history
    chatHistory.innerHTML += `<div><strong>You:</strong> ${userMessage}</div>`;

    // Find the response
    const response = getResponse(userMessage);

    // Add bot response with speaker icon
    chatHistory.innerHTML += `<div><strong>Bot:</strong> ${response} <span class="speaker" onclick="speakText('${escapeText(response)}')">🔊</span></div>`;

    // Clear input
    userInput.value = "";

    // Scroll to the bottom
    scrollChatToBottom();
}

// Get Response from Dataset
function getResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    const match = dataset.find(item => item.question.toLowerCase() === lowerMessage);
    return match ? match.answer : "Sorry, I don't understand that question.";
}

// Function to Escape Special Characters
function escapeText(text) {
    return text
        .replace(/'/g, "\\'")  // Escape single quotes
        .replace(/"/g, '\\"')  // Escape double quotes
        .replace(/\n/g, '\\n'); // Escape newlines
}

// Function to Speak Text using Speech Synthesis API
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = 1;  // Volume (0 to 1)
        utterance.rate = 1;    // Speed (0.1 to 10)
        utterance.pitch = 1;   // Pitch (0 to 2)
        speechSynthesis.speak(utterance);
    } else {
        alert("Speech synthesis not supported in your browser.");
    }
}
