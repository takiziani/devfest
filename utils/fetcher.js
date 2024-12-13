import axios from 'axios';

export async function getMessages() {
    try {
        const response = await axios.get("https://graph.facebook.com/v21.0/110638258103644/conversations", {
            params: {
                fields: "messages.limit(2){from,id,to,message,created_time},id,updated_time",
                access_token: "EAAb8QjRjKJIBOycIio9ScBW1hQxCZBl3sT3Ge52TtThFZCjohIw5PkGZCpnn3OlwIbiyIscbwmhjQeromPc0ZCmvsbrL6AzCK35RoZAFS9KRgVLrSfkTIhEZAYorEDzIIGETJJaIzrJNaJbdgo48MPERROZBDVKGRrIiCOZCzAdSvu3a3QBOJAvFUR4QnVmIY6AR",
                limit: 1
            }
        });

        console.log("hi " + response.data.data.messages); // Log the actual response data
        return response.data;       // Return the data to use elsewhere
    } catch (error) {
        console.error('Error fetching messages:', error.response?.data || error.message);
        throw error;
    }
}

export async function sendMessage(text) {
    try {
        const response = await axios.post('https://graph.facebook.com/v21.0/110638258103644/messages?access_token=EAAb8QjRjKJIBOycIio9ScBW1hQxCZBl3sT3Ge52TtThFZCjohIw5PkGZCpnn3OlwIbiyIscbwmhjQeromPc0ZCmvsbrL6AzCK35RoZAFS9KRgVLrSfkTIhEZAYorEDzIIGETJJaIzrJNaJbdgo48MPERROZBDVKGRrIiCOZCzAdSvu3a3QBOJAvFUR4QnVmIY6AR', {
            "message": { "text": text },
            "recipient": { "id": "8946555632068082" },
            "messaging_type": "RESPONSE",
            "access_token": "EAAb8QjRjKJIBOycIio9ScBW1hQxCZBl3sT3Ge52TtThFZCjohIw5PkGZCpnn3OlwIbiyIscbwmhjQeromPc0ZCmvsbrL6AzCK35RoZAFS9KRgVLrSfkTIhEZAYorEDzIIGETJJaIzrJNaJbdgo48MPERROZBDVKGRrIiCOZCzAdSvu3a3QBOJAvFUR4QnVmIY6AR"
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}