// DOM elements
const textInput = document.getElementById('textInput');
const detectBtn = document.getElementById('detectBtn');
const result = document.getElementById('result');
const buttonText = document.querySelector('.button-text');
const loader = document.querySelector('.loader');
const resultIcon = document.querySelector('.result-icon');
const resultText = document.querySelector('.result-text');

// Event listener for detect button
detectBtn.addEventListener('click', detectSpam);

// Allow Enter key to trigger detection (Ctrl/Cmd + Enter)
textInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        detectSpam();
    }
});

async function detectSpam() {
    const text = textInput.value.trim();
    
    // Validate input
    if (!text) {
        alert('Please enter some text to analyze.');
        return;
    }

    // Check if API key is configured
    if (!CONFIG.OPENAI_API_KEY || CONFIG.OPENAI_API_KEY === 'your-openai-api-key-here') {
        alert('Please configure your OpenAI API key in config.js file.');
        return;
    }

    // Show loading state
    setLoadingState(true);
    result.style.display = 'none';

    try {
        // Call OpenAI API
        const isSpam = await checkSpamWithLLM(text);
        
        // Display result
        displayResult(isSpam);
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while checking for spam. Please check the console for details.');
    } finally {
        setLoadingState(false);
    }
}

async function checkSpamWithLLM(text) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a spam detection assistant. Analyze the given text and determine if it is spam or not. Respond with ONLY "SPAM" if it is spam, or "NOT_SPAM" if it is not spam. Consider the following as spam indicators: unsolicited advertisements, phishing attempts, scams, excessive promotional content, suspicious links, urgency tactics, too-good-to-be-true offers, requests for personal information, or poor grammar with marketing intent.'
                },
                {
                    role: 'user',
                    content: `Analyze this text and determine if it's spam:\n\n"${text}"`
                }
            ],
            temperature: 0.3,
            max_tokens: 10
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content.trim().toUpperCase();
    
    return answer.includes('SPAM') && !answer.includes('NOT_SPAM');
}

function displayResult(isSpam) {
    result.style.display = 'flex';
    
    if (isSpam) {
        result.className = 'result spam';
        resultIcon.textContent = '⚠️';
        resultText.textContent = 'This is spam';
    } else {
        result.className = 'result not-spam';
        resultIcon.textContent = '✓';
        resultText.textContent = 'This is not spam';
    }
}

function setLoadingState(isLoading) {
    if (isLoading) {
        detectBtn.disabled = true;
        buttonText.textContent = 'Analyzing...';
        loader.style.display = 'block';
    } else {
        detectBtn.disabled = false;
        buttonText.textContent = 'Detect Spam';
        loader.style.display = 'none';
    }
}
