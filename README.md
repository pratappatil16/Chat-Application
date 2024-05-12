# User Authentication and Real-Time Chat System

This project aims to implement a user authentication system along with real-time chat functionality. The system utilizes  Socket.io for efficient real-time communication, and MongoDB for message storage.

# Features

1. User Authentication:
Users can register with a unique email and password.

2. Chat Functionality:
Users can send and receive real-time messages.
Socket.io is employed for efficient real-time communication.

3.Message Storage:
All messages are stored in MongoDB.
Messages in the chat are retrievable for conversation history.

4.User Online Status and Language Model Integration (LLM):
Users can set their status as 'AVAILABLE' or 'BUSY'.
Chat requests are only sent if the recipient is online.
If the recipient is 'BUSY', an appropriate response is generated using a language model API.

# Technologies Used
Node.js: Backend runtime environment.
Express.js: Web application framework for Node.js.
MongoDB: NoSQL database for message storage.
Socket.io: Real-time communication library.
Language Model API: Utilized for generating responses when a user is 'BUSY'.

# Setup Instructions
Clone the repository.
Install dependencies using npm install.
Set up MongoDB and configure the connection string.
Set up the language model API and obtain the necessary credentials/API keys.
Configure environment variables.
# Run the application using 
# npm run dev for the front end part 
# start the backend using nodemon index.js.

API Endpoints
/register: Endpoint for user registration.
/login: Endpoint for user login.
/chat: Endpoint for real-time chat functionality.
/status: Endpoint for updating user status.
