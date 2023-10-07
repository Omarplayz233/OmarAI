document.addEventListener("DOMContentLoaded", () => {
    const messageInput = document.getElementById("messageInput");
    const sendMessageButton = document.getElementById("sendMessage");
    const clearMessagesButton = document.getElementById("clearMessages");
    const messagesContainer = document.getElementById("messages");
    const conversation = [];

    // Function to set the theme based on user preference
    function setThemeFromPreference() {
        const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (prefersDarkMode) {
            // Apply dark mode
            document.body.classList.add("dark-mode");
            messageInput.classList.add("dark-mode");
            document.getElementById("toggle").textContent = "Light Mode";
        } else {
            // Use light mode (optional, as your initial CSS is for light mode)
            document.body.classList.remove("dark-mode");
            messageInput.classList.remove("dark-mode");
            document.getElementById("toggle").textContent = "Dark Mode";
        }
    }

    // Set the theme based on user preference when the page loads
    setThemeFromPreference();

    // Event listener to toggle dark/light mode and update the button text
    const toggleButton = document.getElementById("toggle");
    toggleButton.addEventListener("click", () => {
        // Toggle the dark mode
        const isDarkMode = document.body.classList.toggle("dark-mode");
        messageInput.classList.toggle("dark-mode");
        toggleButton.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
    });

    // Function to update button layout for mobile
    function updateButtonLayout() {
        const isMobile = window.innerWidth <= 768; // Adjust the width threshold as needed

        if (isMobile) {
            // Change the layout for mobile
            sendMessageButton.style.width = "100%";
            clearMessagesButton.style.width = "100%";
            clearMessagesButton.style.marginTop = "10px";
        } else {
            // Reset the layout for non-mobile
            sendMessageButton.style.width = "auto";
            clearMessagesButton.style.width = "auto";
            clearMessagesButton.style.marginTop = "0";
        }
    }

    // Call the updateButtonLayout function initially and on window resize
    updateButtonLayout();
    window.addEventListener("resize", updateButtonLayout);

    // Event listener to send a message
    sendMessageButton.addEventListener("click", async () => {
        const userMessage = messageInput.value;

        const response = await sendUserMessage(userMessage);

        const userMessageText = "User: " + userMessage;
        const chatbotResponseText = "OmarAI: " + response;

        conversation.push(userMessageText, chatbotResponseText);

        displayMessage(userMessageText);
        displayMessage(chatbotResponseText);

        messageInput.value = "";

        localStorage.setItem("conversation", conversation.join('\n'));
    });

    // Event listener to clear messages
    clearMessagesButton.addEventListener("click", () => {
        // Clear the message box by removing all its child elements
        while (messagesContainer.firstChild) {
            messagesContainer.removeChild(messagesContainer.firstChild);
        }

        // Clear the conversation array
        conversation.length = 0;

        // Clear the saved conversation in local storage
        localStorage.removeItem("conversation");
    });

    async function sendUserMessage(message) {
        try {
            const response = await fetch("/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error("Server error");
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error(error);
            return "Error: Unable to communicate with the chatbot.";
        }
    }

    function displayMessage(message) {
        const messageElement = document.createElement("div");
        messageElement.textContent = message;
        messagesContainer.appendChild(messageElement);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function displayConversation(messages) {
        messages.forEach(message => {
            displayMessage(message);
        });
    }

    messageInput.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default form submission
            sendMessageButton.click(); // Simulate a click on the "Send" button
        }
    });
});
