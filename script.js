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
    speak("Initializing ZARA...");
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

// Start listening when button is clicked
btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

// List of songs or audio files to play (replace with your own files or URLs)
const songs = {
    'song 1': 'Song1.mp3',
    'song 2': 'Song2.mp3',
    'song 3': 'Song3.mp3'
};

// Initialize the audio player variable
let currentAudio = null;

// Function to play a song
function playSong(song) {
    if (currentAudio) {
        currentAudio.pause(); // Pause the current song if playing
    }
    if (songs[song]) {
        currentAudio = new Audio(songs[song]);
        currentAudio.play();
        speak(`Playing ${song}`);
    } else {
        speak("Sorry, I could not find that song. Please try again.");
    }
}

// Function to pause the song
function pauseSong() {
    if (currentAudio) {
        currentAudio.pause();
        speak("Song paused.");
    } else {
        speak("No song is currently playing.");
    }
}

// Function to resume the song
function resumeSong() {
    if (currentAudio) {
        currentAudio.play();
        speak("Resuming the song.");
    } else {
        speak("No song is currently playing.");
    }
}

// Function to stop the song
function stopSong() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Reset song to the beginning
        speak("Song stopped.");
    } else {
        speak("No song is currently playing.");
    }
}

// Function to open a website
function openWebsite(url) {
    window.open(url, "_blank");
}

// Handle different commands
function takeCommand(message) {
    if (message.includes('hey ') || message.includes('hello ')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
        openWebsite("https://google.com");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        openWebsite("https://youtube.com");
        speak("Opening Youtube...");
    } else if (message.includes("open facebook")) {
        openWebsite("https://facebook.com");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what I found on the internet regarding " + message;
        speak(finalText);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        const finalText = "This is what I found on Wikipedia regarding " + message;
        speak(finalText);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        const finalText = "The current time is " + time;
        speak(finalText);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        const finalText = "Today's date is " + date;
        speak(finalText);
    } else if (message.includes('calculator')) {
        openWebsite('Calculator:///');
        const finalText = "Opening Calculator";
        speak(finalText);
    } else if (message.includes('play song') || message.includes('play music')) {
        const songRequested = message.replace('play song', '').replace('play music', '').trim();
        if (songs[songRequested]) {
            playSong(songRequested);
        } else {
            speak("Sorry, I couldn't find that song. Please try another one.");
        }
    } else if (message.includes('pause song')) {
        pauseSong();
    } else if (message.includes('resume song')) {
        resumeSong();
    } else if (message.includes('stop song')) {
        stopSong();
    } else if (message.includes('google search')) {
        const query = message.replace('google search', '').trim();
        openWebsite(`https://www.google.com/search?q=${query}`);
        speak(`Searching Google for ${query}`);
    } else if (message.includes('play youtube video')) {
        const video = message.replace('play youtube video', '').trim();
        openWebsite(`https://www.youtube.com/results?search_query=${video}`);
        speak(`Playing YouTube video about ${video}`);
    } else if (message.includes('weather in')) {
        const location = message.replace('weather in', '').trim();
        openWebsite(`https://www.google.com/search?q=weather+in+${location}`);
        speak(`Fetching weather information for ${location}`);
    } else if (message.includes('joke')) {
        fetch('https://official-joke-api.appspot.com/random_joke')
            .then(response => response.json())
            .then(data => {
                speak(`${data.setup}... ${data.punchline}`);
            })
            .catch(err => speak("Sorry, I couldn't fetch a joke right now."));
    } else if (message.includes('mute')) {
        document.querySelector('audio').muted = true;
        speak("Muted the audio.");
    } else if (message.includes('unmute')) {
        document.querySelector('audio').muted = false;
        speak("Unmuted the audio.");
    } else if (message.includes('increase volume')) {
        let volume = Math.min(1, document.querySelector('audio').volume + 0.1);
        document.querySelector('audio').volume = volume;
        speak("Increased the volume.");
    } else if (message.includes('decrease volume')) {
        let volume = Math.max(0, document.querySelector('audio').volume - 0.1);
        document.querySelector('audio').volume = volume;
        speak("Decreased the volume.");
    } else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "I found some information for " + message + " on Google";
        speak(finalText);
    }
}
