const btn = document.querySelector('.input');
const content = document.querySelector('.content');

// Function for speaking text
function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

// Function to wish the user based on the time of day
function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

// Initialize the assistant when the page loads
window.addEventListener('load', () => {
    speak("Initializing JULIE...");
    wishMe();
});

// Initialize Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Handle the result from speech recognition
recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

// Error Handling for Speech Recognition
recognition.onerror = (event) => {
    console.error("Error occurred in speech recognition: " + event.error);
    speak("Sorry, there was an error with the voice recognition. Please try again.");
};

// Start listening when button is clicked
btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

// Handle different commands
function takeCommand(message) {
    if (message.includes('hey ') || message.includes('hello ')) {
        speak("Hello Sir, How May I Help You?");
    }
    // Open Websites (Amazon, Wikipedia, etc.)
    else if (message.includes("open amazon")) {
        openWebsite("https://www.amazon.com");
        speak("Opening Amazon.");
    } 
    else if (message.includes("open wikipedia")) {
        openWebsite("https://www.wikipedia.org");
        speak("Opening Wikipedia.");
    }
    function makePhoneCall(phoneNumber) {
        if (phoneNumber && phoneNumber.trim()) {
            // Initiate the phone call using the 'tel:' URI scheme
            window.location.href = `tel:${phoneNumber.trim()}`;
            speak(`Calling ${phoneNumber.trim()}...`);
        } else {
            speak("Please provide a valid phone number.");
        }
    }
    function addToGoogleKeep(note) {
        // You'll need to authenticate with Google APIs, follow their OAuth 2.0 setup
        const token = "YOUR_GOOGLE_API_ACCESS_TOKEN";
        fetch('https://keep.googleapis.com/v1/notes', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: note.title,
                text: note.text,
            })
        })
            .then(response => response.json())
            .then(data => {
                speak("Note added successfully.");
            })
            .catch(error => {
                speak("Sorry, I couldn't add the note.");
            });
    }
    
    // Send Text Message (SMS via an API)
    else if (message.includes('send text') || message.includes('send sms')) {
        const textMessage = message.replace('send text', '').replace('send sms', '').trim();
        speak(`Sending text: ${textMessage}`);
        // Here you would integrate with an SMS API like Twilio to send the message.
    } 
    // Get News by Category (e.g., Sports, Technology)
    else if (message.includes('get news') || message.includes('sports news')) {
        openWebsite("https://www.google.com/search?q=sports+news");
        speak("Fetching the latest sports news.");
    } 
    else if (message.includes('technology news')) {
        openWebsite("https://www.google.com/search?q=technology+news");
        speak("Fetching the latest technology news.");
    }
    // Play YouTube Video
    else if (message.includes('play youtube video')) {
        const video = message.replace('play youtube video', '').trim();
        openWebsite(`https://www.youtube.com/results?search_query=${video}`);
        speak(`Playing YouTube video about ${video}`);
    }
    // Set Timer (simple implementation with 10 seconds timer)
    else if (message.includes('set timer')) {
        const time = message.replace('set timer for', '').trim();
        speak(`Setting timer for ${time} minutes.`);
        setTimeout(() => {
            speak("Time's up!");
        }, 60000 * parseInt(time)); // For minutes
    }
    // Find Nearby Places (Google Maps API)
    else if (message.includes('nearby')) {
        const place = message.replace('nearby', '').trim();
        openWebsite(`https://www.google.com/maps/search/nearby+${place}`);
        speak(`Finding nearby ${place}`);
    }
    // Get Latest Stock Price
    else if (message.includes('stock price') || message.includes('share price')) {
        const stockSymbol = message.replace('stock price', '').trim();
        openWebsite(`https://www.google.com/search?q=${stockSymbol}+stock+price`);
        speak(`Fetching stock price for ${stockSymbol}`);
    }
    // Translate Text
    else if (message.includes('translate')) {
        const textToTranslate = message.replace('translate', '').trim();
        openWebsite(`https://translate.google.com/?sl=en&tl=es&text=${textToTranslate}`); // Example to Spanish
        speak(`Translating text: ${textToTranslate}`);
    }
    // Show Date and Time
    else if (message.includes('date and time') || message.includes('current date')) {
        const dateTime = new Date().toLocaleString();
        speak(`The current date and time is: ${dateTime}`);
    }
    // Weather Forecast for the Week
    else if (message.includes('weather forecast')) {
        const location = message.replace('weather forecast in', '').trim();
        openWebsite(`https://www.google.com/search?q=weather+forecast+in+${location}`);
        speak(`Fetching the weather forecast for the week in ${location}`);
    }
    // Advanced Calculations (Square Root, Exponentiation)
    else if (message.includes('calculate square root')) {
        const num = parseFloat(message.replace('calculate square root of', '').trim());
        if (!isNaN(num)) {
            const result = Math.sqrt(num);
            speak(`The square root of ${num} is ${result}`);
        } else {
            speak("Please provide a valid number.");
        }
    }
    else if (message.includes('calculate exponent')) {
        const [base, exponent] = message.replace('calculate exponent', '').split('to');
        const result = Math.pow(parseFloat(base), parseFloat(exponent));
        speak(`The result of ${base} to the power of ${exponent} is ${result}`);
    }
    // Calculate Age (Based on Birthdate)
    else if (message.includes('calculate my age')) {
        const birthdate = message.replace('calculate my age', '').trim();
        const birthYear = parseInt(birthdate.split('-')[0]);
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        speak(`You are ${age} years old.`);
    }
    // Find a Location (Google Maps)
    else if (message.includes('find location')) {
        const location = message.replace('find location', '').trim();
        openWebsite(`https://www.google.com/maps?q=${location}`);
        speak(`Finding location for ${location}`);
    }
    // Get Jokes or Fun Facts
    else if (message.includes('tell me a joke')) {
        fetch('https://official-joke-api.appspot.com/random_joke')
            .then(response => response.json())
            .then(data => {
                speak(`${data.setup}... ${data.punchline}`);
            })
            .catch(err => speak("Sorry, I couldn't fetch a joke right now."));
    }
    // Control System Volume (Mute, Unmute, Increase, Decrease)
    else if (message.includes('mute')) {
        document.querySelector('audio').muted = true;
        speak("Muted the audio.");
    }
    else if (message.includes('unmute')) {
        document.querySelector('audio').muted = false;
        speak("Unmuted the audio.");
    }
    else if (message.includes('increase volume')) {
        let volume = Math.min(1, document.querySelector('audio').volume + 0.1);
        document.querySelector('audio').volume = volume;
        speak("Increased the volume.");
    }
    else if (message.includes('decrease volume')) {
        let volume = Math.max(0, document.querySelector('audio').volume - 0.1);
        document.querySelector('audio').volume = volume;
        speak("Decreased the volume.");
    }
    // Show Calendar Events (Requires API or system-level access)
    else if (message.includes('show calendar events')) {
        speak("Fetching calendar events.");
        // You can integrate Google Calendar API or Outlook Calendar API here.
    }
    // Take Screenshot
    else if (message.includes('take screenshot')) {
        speak("Sorry, I cannot take screenshots at the moment.");
    }
    // Play a Basic Game (e.g., Number Guessing)
    else if (message.includes('play game')) {
        speak("Let's play a number guessing game.");
        const randomNumber = Math.floor(Math.random() * 10) + 1;
        speak(`Guess the number between 1 and 10. I'll tell you if you're correct.`);
        // Integrate a simple guessing game logic here.
    }
    // Get Random Quotes
    else if (message.includes('tell me a quote')) {
        fetch('https://api.quotable.io/random')
            .then(response => response.json())
            .then(data => {
                speak(`Here is a quote: "${data.content}" - ${data.author}`);
            })
            .catch(err => speak("Sorry, I couldn't fetch a quote right now."));
    } 
    // Default Fallback (for unknown commands)
    else {
        openWebsite(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "I found some information for " + message + " on Google";
        speak(finalText);
    }
}
