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
    
    // Validate input length to prevent abuse
    if (!text) {
        alert('Please enter some text to analyze.');
        return;
    }

    if (text.length > 5000) {
        alert('Text is too long. Maximum 5000 characters allowed.');
        return;
    }

    // Check if API key is configured
    if (!CONFIG.COMET_API_KEY || CONFIG.COMET_API_KEY === 'your-comet-api-key-here') {
        alert('Please configure your COMET API key in config.js file.');
        return;
    }

    // Show loading state
    setLoadingState(true);
    result.style.display = 'none';

    try {
        // Call COMET API
        const isSpam = await checkSpamWithLLM(text);
        
        // Display result
        displayResult(isSpam);
    } catch (error) {
        console.error('Error:', error);
        // Sanitize error message to prevent XSS
        const safeMessage = String(error.message).replace(/[<>]/g, '');
        displayError(safeMessage);
    } finally {
        setLoadingState(false);
    }
}

async function checkSpamWithLLM(text) {
    // Try Cohere API endpoint
    const response = await fetch('https://api.cohere.com/v1/chat', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${CONFIG.COMET_API_KEY}`
        },
        body: JSON.stringify({
            model: 'command-r-08-2024',
            message: `Analyze this text and determine if it's spam. Respond with ONLY "SPAM" if it is spam, or "NOT_SPAM" if it is not spam.\n\nText to analyze: "${text}"`,
            temperature: 0.3,
            max_tokens: 10
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || response.statusText;
        throw new Error(errorMessage);
    }

    const data = await response.json();
    const answer = data.text ? data.text.trim().toUpperCase() : '';
    
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

function displayError(message) {
    result.style.display = 'flex';
    result.className = 'result spam';
    resultIcon.textContent = '❌';
    // Use textContent instead of innerHTML to prevent XSS
    resultText.textContent = `Error: ${message}`;
}

function setLoadingState(isLoading) {
    if (isLoading) {
        detectBtn.disabled = true;
        buttonText.textContent = 'Analyzing...';
        loader.style.display = 'block';
    } else {
        detectBtn.disabled = false;
        buttonText.textContent = 'Analyze';
        loader.style.display = 'none';
    }
}
