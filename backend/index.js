import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://test:123@cluster0.rzfflm5.mongodb.net/?appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Example schema/model
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
});
const User = mongoose.model('User', UserSchema);

// Routes
app.get('/', (req, res) => {
    res.send('🚀 Express + MongoDB server is running!');
});

app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
