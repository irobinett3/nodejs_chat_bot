document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('messageForm');
    const userInput = document.getElementById('userInput');
    const chatbox = document.getElementById('chatbox');

    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const message = userInput.value.trim();
        if (message === '') return;
    
        appendMessage('You', message, 'user');
        userInput.value = '';
    
        try {
            const response = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
    
            if (!response.ok) {
                const errorMessage = `Error ${response.status}: ${response.statusText}`;
                throw new Error(errorMessage);
            }
    
            const data = await response.json();
            appendMessage('Bot', data.message, 'assistant');
        } catch (error) {
            console.error('Fetch Error:', error.message);
            // Display or handle the error on the UI as needed
        }
    });

    function appendMessage(sender, content, role) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', role);
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${content}`;
        chatbox.appendChild(messageDiv);

        // Scroll to bottom of chatbox
        chatbox.scrollTop = chatbox.scrollHeight;
    }
});