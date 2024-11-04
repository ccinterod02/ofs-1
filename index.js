const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]


app.get('/api/persons', (req, res) => {
    res.send(persons)
})

app.get('/info', (req, res) => {
    const msg = `
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>${Date().toString()}</p>
        `
    res.send(msg)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find((element) => element.id === id)
    person ? res.send(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(element => element.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {

    const body = req.body
    if (!body) return res.status(400).json({ error: 'content missing' })

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    res.status(202).json(person)
})


const generateId = () => {
    const maxId =
        persons.length > 0
            ? Math.max(...persons.map(n => n.id))
            : 0
    return maxId + 1
}


const PORT = 3001
app.listen(PORT)
console.log(`Servidor corriendo en el puerto ${PORT}`)