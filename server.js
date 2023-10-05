// Import required modules
const express = require('express');
const mongoose = require('mongoose');

// Create an Express application
const app = express();
const port = process.env.PORT || 3000; // Use the provided PORT environment variable or default to 3000

// Connect to the MongoDB database using Mongoose
mongoose.connect('mongodb+srv://luiz:1234@cluster0.tetfoho.mongodb.net/?retryWrites=true&w=majority');


const markers = mongoose.model('markers', {
    name: String,
    position: [Number],
})

// Middleware for JSON request body parsing
app.use(express.json());

app.get('/location', async (req, res) => {
    try {
        const location = await markers.find()
        res.status(200).json(location)
    } catch (error) {
        res.json({ erro: error })
    }
})

app.get('/location/:id', async (req, res) => {
    const id = req.params.id
    try {
        const location = await markers.findOne({ _id: id })
        if (!location) {
            res.status(422).json({ message: 'Localização não encontrada!' })
            return
        }
        res.status(200).json(location)
    } catch (error) {
        res.json({ erro: error })
    }
})

app.post('/newlocation', async (req, res) => {
    const { name, position } = req.body
    const loc = {
        name,
        position
    }
    try {
        const data = await markers.create(loc)
        res.json({ message: 'Cadastrado com sucesso!', data })
    } catch (error) {
        res.json({ erro: error })
    }
})

app.patch('/updatelocation/:id', async (req, res) => {
    const id = req.params.id
    const { name, position } = req.body
    const marker = {
        name,
        position
    }
    try {
        
        const updatedMarker = await markers.updateOne({ _id: id }, marker)
        if (updatedMarker.matchedCount === 0) {
            res.status(422).json({ message: 'Não foi possivel encontrar!' })
            return
        }
        res.status(200).json(marker)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

app.delete('/deletelocation/:id', async (req, res) => {
    const id = req.params.id
    
    const marker = await markers.findOne({ _id: id })
    if (!marker) {
        res.status(422).json({ message: 'Não foi possivel encontrar' })
        return
    }
    try {
        await markers.deleteOne({ _id: id })
        res.status(200).json({ message: 'LOcalização deletada!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

app.listen(3000, console.log('Server runnig in http://localhost:3000.'))