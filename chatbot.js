/**
 * VirtuLab AI Chatbot
 * Powered by Groq API
 */

// ==========================================
// CONFIGURATION
// ==========================================
// API Key for Groq
const GROQ_API_KEY = "YOUR API KEY";

// ==========================================
// LANGUAGE CONFIGURATION
// ==========================================

let currentLanguage = 'english';

const LANGUAGE_PROMPTS = {
    english: `You are the AI Assistant for VirtuLab.
Your goal is to teach physics, chemistry, and math in the SIMPLEST way possible.

GUIDELINES:
1. Use **Bold** for major headings or key terms.
2. Use *Italics* for emphasis.
3. Use Bullet points for lists.
4. Simple Language: Explain like I'm a beginner.
5. Context: The user is exploring simulations for SHM, Gravity, Decay, and Pi.`,

    hindi: `आप VirtuLab के AI सहायक हैं।
आपका लक्ष्य भौतिकी, रसायन विज्ञान और गणित को सबसे सरल तरीके से सिखाना है।

नियम:
1. सभी उत्तर केवल हिंदी में दें — अंग्रेजी का उपयोग बिल्कुल न करें।
2. **बोल्ड** का उपयोग मुख्य शब्दों के लिए करें।
3. *इटैलिक* का उपयोग विशेष शब्दों के लिए करें।
4. सूचियों के लिए बुलेट पॉइंट का उपयोग करें।
5. बहुत सरल भाषा में समझाएं जैसे शुरुआती छात्र को समझा रहे हों।
6. उपयोगकर्ता SHM, गुरुत्वाकर्षण, रेडियोधर्मिता और Pi के सिमुलेशन देख रहा है।`,

    punjabi: `ਤੁਸੀਂ VirtuLab ਦੇ AI ਸਹਾਇਕ ਹੋ।
ਤੁਹਾਡਾ ਟੀਚਾ ਭੌਤਿਕ ਵਿਗਿਆਨ, ਰਸਾਇਣ ਵਿਗਿਆਨ ਅਤੇ ਗਣਿਤ ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਤਰੀਕੇ ਨਾਲ ਸਿਖਾਉਣਾ ਹੈ।

ਨਿਯਮ:
1. ਸਾਰੇ ਜਵਾਬ ਸਿਰਫ਼ ਪੰਜਾਬੀ (ਗੁਰਮੁਖੀ) ਵਿੱਚ ਦਿਓ — ਅੰਗਰੇਜ਼ੀ ਦੀ ਵਰਤੋਂ ਨਾ ਕਰੋ।
2. **ਬੋਲਡ** ਮੁੱਖ ਸ਼ਬਦਾਂ ਲਈ ਵਰਤੋ।
3. ਸੂਚੀਆਂ ਲਈ ਬੁਲੇਟ ਪੁਆਇੰਟ ਵਰਤੋ।
4. ਬਹੁਤ ਸਰਲ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝਾਓ ਜਿਵੇਂ ਕਿਸੇ ਸ਼ੁਰੂਆਤੀ ਵਿਦਿਆਰਥੀ ਨੂੰ ਦੱਸ ਰਹੇ ਹੋ।
5. ਵਰਤੋਂਕਾਰ SHM, ਗੁਰੂਤਾ, ਰੇਡੀਓਐਕਟੀਵਿਟੀ ਅਤੇ Pi ਦੇ ਸਿਮੂਲੇਸ਼ਨ ਦੇਖ ਰਿਹਾ ਹੈ।`,

    bengali: `আপনি VirtuLab-এর AI সহকারী।
আপনার লক্ষ্য পদার্থবিজ্ঞান, রসায়ন এবং গণিত সবচেয়ে সহজ উপায়ে শেখানো।

নিয়ম:
1. সমস্ত উত্তর শুধুমাত্র বাংলায় দিন — ইংরেজি ব্যবহার করবেন না।
2. **বোল্ড** মূল শব্দের জন্য ব্যবহার করুন।
3. তালিকার জন্য বুলেট পয়েন্ট ব্যবহার করুন।
4. খুব সহজ ভাষায় ব্যাখ্যা করুন যেন একজন শিক্ষার্থীকে বোঝাচ্ছেন।
5. ব্যবহারকারী SHM, মহাকর্ষ, তেজস্ক্রিয়তা এবং Pi-এর সিমুলেশন দেখছেন।`,

    malayalam: `നിങ്ങൾ VirtuLab-ന്റെ AI അസിസ്റ്റന്റ് ആണ്.
ഭൗതികശാസ്ത്രം, രസതന്ത്രം, ഗണിതം എന്നിവ ഏറ്റവും ലളിതമായ രീതിയിൽ പഠിപ്പിക്കുക എന്നതാണ് നിങ്ങളുടെ ലക്ഷ്യം.

ചട്ടങ്ങൾ:
1. എല്ലാ ഉത്തരങ്ങളും മലയാളത്തിൽ മാത്രം നൽകുക — ഇംഗ്ലീഷ് ഉപയോഗിക്കരുത്.
2. **ബോൾഡ്** പ്രധാന പദങ്ങൾക്ക് ഉപയോഗിക്കുക.
3. ലിസ്റ്റുകൾക്ക് ബുള്ളറ്റ് പോയിന്റ് ഉപയോഗിക്കുക.
4. ഒരു തുടക്കക്കാരനോട് സംസാരിക്കുന്നതുപോലെ ലളിതമായ ഭാഷയിൽ വിശദീകരിക്കുക.
5. ഉപയോക്താവ് SHM, ഗുരുത്വാകർഷണം, റേഡിയോആക്ടിവിറ്റി, Pi എന്നിവയുടെ സിമുലേഷൻ കാണുന്നു.`
};

const WELCOME_MESSAGES = {
    english: "Hi! I'm VirtuAI. Ask me anything!",
    hindi: "नमस्ते! मैं VirtuAI हूँ। मुझसे कुछ भी पूछें!",
    punjabi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ VirtuAI ਹਾਂ। ਮੈਨੂੰ ਕੁਝ ਵੀ ਪੁੱਛੋ!",
    bengali: "নমস্কার! আমি VirtuAI। আমাকে যেকোনো কিছু জিজ্ঞেস করুন!",
    malayalam: "നമസ്കാരം! ഞാൻ VirtuAI ആണ്. എന്തും ചോദിക്കൂ!"
};

const LANGUAGE_LABELS = {
    english: '🌐 EN',
    hindi: '🌐 HI',
    punjabi: '🌐 PA',
    bengali: '🌐 BN',
    malayalam: '🌐 ML'
};


// ==========================================
// STATE & ELEMENTS
// ==========================================
const widget = document.getElementById('chatbot-widget');
const toggler = document.getElementById('chatbot-toggler');
const closeBtn = document.querySelector('.close-chat-btn');
const inputField = document.getElementById('chat-input-field');
const sendBtn = document.getElementById('chat-send-btn');
const messagesContainer = document.getElementById('chat-messages');

let isChatOpen = false;

// ==========================================
// ACTIONS
// ==========================================

function toggleChatWidget() {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        widget.classList.add('active');
        toggler.style.transform = 'scale(0) rotate(90deg)'; // Hide toggler
        // Focus input after transition
        setTimeout(() => inputField.focus(), 300);
    } else {
        widget.classList.remove('active');
        toggler.style.transform = 'scale(1) rotate(0deg)'; // Show toggler
    }
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);

    // Parse Markdown
    msgDiv.innerHTML = parseMarkdown(text);

    messagesContainer.appendChild(msgDiv);
    scrollToBottom();
    return msgDiv;
}

function parseMarkdown(text) {
    // 1. Escape HTML (basic)
    let safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // 2. Bold & Italic
    safeText = safeText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 3. Lists and Paragraphs
    let lines = safeText.split('\n');
    let result = '';
    let inList = false;

    lines.forEach(line => {
        let trimmed = line.trim();
        if (trimmed.startsWith('- ')) {
            if (!inList) {
                result += '<ul>';
                inList = true;
            }
            result += `<li>${trimmed.substring(2)}</li>`;
        } else {
            if (inList) {
                result += '</ul>';
                inList = false;
            }
            if (trimmed.length > 0) {
                result += `<p>${line}</p>`;
            }
        }
    });

    if (inList) result += '</ul>';

    return result;
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function handleSendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    // 1. User Message
    appendMessage(text, 'user');
    inputField.value = '';

    // 2. Loading Indicator
    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'ai', 'loading');
    loadingDiv.id = loadingId;
    loadingDiv.innerHTML = `<span class="dot-animation">Thinking...</span>`;
    messagesContainer.appendChild(loadingDiv);
    scrollToBottom();

    try {
        // 3. API Call
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: LANGUAGE_PROMPTS[currentLanguage] },
                    { role: "user", content: text }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.9,
                max_tokens: 1024
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.error?.message || `API Error: ${response.status}`;
            throw new Error(errorMsg);
        }
        const aiResponse = data.choices[0]?.message?.content || "I'm having trouble connecting to my brain right now.";

        // 4. Replace Loading with AI Response
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();

        appendMessage(aiResponse, 'ai');

    } catch (error) {
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();

        console.error(error);
        if (error.message.includes('401')) {
            appendMessage("⚠️ Error 401: Invalid API Key. Please check your key in chatbot.js.", 'ai');
        } else if (error.message.includes('Failed to fetch')) {
            appendMessage("⚠️ Network Error: Check internet or CORS issues.", 'ai');
        } else {
            appendMessage(`⚠️ Error: ${error.message}`, 'ai');
        }
    }
}

const expandBtn = document.querySelector('.expand-chat-btn');
let isFullScreen = false;

function toggleFullScreen() {
    isFullScreen = !isFullScreen;
    widget.classList.toggle('fullscreen', isFullScreen);

    // Update Icon
    const path = isFullScreen
        ? "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" // Contract
        : "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"; // Expand

    expandBtn.querySelector('path').setAttribute('d', path);
    scrollToBottom();
}

// ==========================================
// EVENT LISTENERS
// ==========================================

toggler.addEventListener('click', toggleChatWidget);
expandBtn.addEventListener('click', toggleFullScreen);

closeBtn.addEventListener('click', () => {
    // Explicit close
    isChatOpen = true; // Force toggle state logic
    toggleChatWidget();
});

sendBtn.addEventListener('click', handleSendMessage);

inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});

// ==========================================
// LANGUAGE TOGGLE
// ==========================================

const langToggleBtn = document.getElementById('lang-toggle-btn');
const langDropdown = document.getElementById('lang-dropdown');

langToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle('open');
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    langDropdown.classList.remove('open');
});

function setLanguage(lang) {
    currentLanguage = lang;

    // Update globe button label
    langToggleBtn.textContent = LANGUAGE_LABELS[lang];

    // Mark active item in dropdown
    langDropdown.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('lang-active');
        if (btn.textContent.trim().startsWith(LANGUAGE_LABELS[lang].split(' ')[0])) {
            btn.classList.add('lang-active');
        }
    });

    // Clear chat and show welcome in selected language
    messagesContainer.innerHTML = '';
    appendMessage(WELCOME_MESSAGES[lang], 'ai');

    // Close dropdown
    langDropdown.classList.remove('open');
}

// Auto-welcome
setTimeout(() => {
    if (messagesContainer.children.length === 0) {
        appendMessage(WELCOME_MESSAGES[currentLanguage], 'ai');
    }
}, 1000);
