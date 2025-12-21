# 🛡️ Spam Detector

A simple web application that uses AI (OpenAI's GPT) to detect whether text is spam or not.

## Features

- Clean and intuitive user interface
- Real-time spam detection using OpenAI's GPT model
- Simple text input with instant results
- Responsive design for all devices

## Setup Instructions

### 1. Get an OpenAI API Key

1. Go to [OpenAI's website](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key and copy it

### 2. Configure the Application

1. Open the `config.js` file
2. Replace `'your-openai-api-key-here'` with your actual OpenAI API key:

```javascript
const CONFIG = {
    OPENAI_API_KEY: 'sk-your-actual-api-key-here'
};
```

### 3. Run the Application

Simply open the `index.html` file in your web browser:

- **Option 1**: Double-click the `index.html` file
- **Option 2**: Right-click `index.html` and select "Open with" → your preferred browser
- **Option 3**: Use a local server (recommended for development):
  ```bash
  # Using Python 3
  python3 -m http.server 8000
  
  # Then open http://localhost:8000 in your browser
  ```

## How to Use

1. Paste or type any text into the text field
2. Click the "Detect Spam" button
3. Wait for the AI to analyze the text
4. View the result:
   - ✅ **"This is not spam"** - The text appears legitimate
   - 🚫 **"This is spam"** - The text appears to be spam

## Examples to Test

### Spam Examples:
- "CONGRATULATIONS! You've WON $1,000,000! Click here NOW to claim your prize!"
- "Urgent: Your account has been suspended. Verify your information immediately by clicking this link."
- "Make $5000 per week working from home! No experience needed! Sign up now!"

### Not Spam Examples:
- "Hi, just checking in to see how you're doing. Let me know if you're free for coffee this week."
- "Your package from Amazon will arrive tomorrow between 2-5 PM."
- "Meeting reminder: Our team sync is scheduled for 3 PM today."

## Important Security Notes

⚠️ **Security Warning**: This application stores the API key in client-side JavaScript, which is not secure for production use. Anyone can view your API key in the browser.

### For Production Use:
- Create a backend server (Node.js, Python, etc.)
- Store API keys securely on the server
- Make API calls from the server, not the client
- Add rate limiting and authentication

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and layout
- `app.js` - JavaScript logic for spam detection
- `config.js` - Configuration file for API key
- `README.md` - This file

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- OpenAI GPT-3.5-turbo API

## Cost

Using OpenAI's API incurs costs based on usage. GPT-3.5-turbo is relatively inexpensive, but be aware of your usage. Check [OpenAI's pricing page](https://openai.com/pricing) for current rates.

## Troubleshooting

### "Please configure your OpenAI API key"
- Make sure you've edited `config.js` with your actual API key

### API Error Messages
- Check that your API key is valid
- Ensure you have credits in your OpenAI account
- Verify your internet connection

### No response from the API
- Check the browser console (F12) for error messages
- Verify the API key is correctly formatted

## License

This project is free to use for educational and personal purposes.
