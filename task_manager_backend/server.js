const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
oracledb.initOracleClient({ libDir: 'C:\\instantclient_19_19' });
const app = express();
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const queries = require('./sqlQueries');
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());



// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/taskmanager', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Task Schema
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    images: [String],
    completed: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', taskSchema);

// Routes
// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Create a new task
app.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
