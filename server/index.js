import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import postRoutes from './routes/posts.js';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';

const app = express();
dotenv.config();

// Middleware
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/posts', postRoutes);
app.use('/user', userRoutes);    // User routes (auth, profile, likes)
app.use('/auth', authRoutes);    // Google auth route

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Something went wrong' });
});

app.get('/', (req, res) => {
    res.send('Hello to Memories API');
});

// const CONNECTION_URL = 'mongodb+srv://hungnuen7:hungnuen277@cluster0.5pzsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server running on port: ${PORT}`);
            console.log('✅ Connected to MongoDB');
            console.log('📍 Routes configured:');
            console.log('   - /user: User operations (auth, profile, likes)');
            console.log('   - /auth: Google authentication');
            console.log('   - /posts: Post operations');
        });
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err));
