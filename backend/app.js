const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const socketIo = require('socket.io');
const http = require('http');
const User = require('./user.model');
const cors = require('cors');
const Conversation=require('./conversation.model')

// Initialize express app
const app = express();
const server = http.createServer(app); // Creating a server instance with Express app

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection setup
mongoose
  .connect('mongodb+srv://ppratappatil775:Pratap2003@cluster0.gzoxg7s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Register a new user
app.post('/register', async (req, res) => {
  try {
    // Check if the email already exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await user.save();
    res.send({ user: savedUser._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/getUser", async (req, res) => {
    const { id } = req.body;
    try {
      // Find conversations where the user is involved and populate the user details
      const conversations = await Conversation.find({ $or: [{ person1: id }, { person2: id }] })
        .populate({
          path: 'person1',
          select: 'username email',
          model: 'Users' // assuming the model name is 'Users'
        })
        .populate({
          path: 'person2',
          select: 'username email',
          model: 'Users' // assuming the model name is 'Users'
        });
  
      res.json({ status: true, conversations });
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  });
  

// Login
app.post('/login', async (req, res) => {
    
  try {
    
    // Check if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found');

    // Check if the password is correct
    
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({"Invalid password":"invalid password"});
    res.json({status:true,user})

  } catch (err) {
    console.log(err)
    res.status(400).json({err});
  }
});

app.post("/search", async (req, res) => {
    try {
      const { email } = req.body;
  
      // Search for the user by email
      const result = await User.findOne({ email });
  
      if (result) {
        res.json({ status: true, user: result });
      } else {
        res.json({ status: false, message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  });

  

  app.post('/conversation', async (req, res) => {
    try {
      // Extract data from the request body
      const { participants } = req.body;
  
      // Check if participants are valid users
      const users = await User.find({ _id: { $in: participants } });
      if (users.length !== participants.length) {
        return res.status(400).json({ message: 'Invalid user IDs' });
      }
  
      // Create a new conversation with the provided participants
      const conversation = new Conversation({ participants });
      await conversation.save();
  
      res.json({ status: true, conversation });
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ status: false, message: 'Internal server error' });
    }
  });
  // Route to send a message in a conversation
app.post('/sendMessage', async (req, res) => {
    try {
      const { conversationId, sender, text } = req.body;
  
      // Check if the conversation exists
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
      
      // Create a new message object
      const message = {
        text,
        sender,
      };
  
      // Push the message to the conversation's messages array
      conversation.messages.push(message);

      console.log(conversation)
      // Save the conversation with the new message
      await conversation.save();
  
      // Emit the message to all users in the conversation
    //   io.to(conversationId).emit('newMessage', message);
  
      res.json({ status: true, message: 'Message sent successfully' });
      
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ status: false, message: 'Internal server error' });
    }
  });
  
  
  

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
}); // Creating Socket.IO instance by passing the server

io.on('connection', socket => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
