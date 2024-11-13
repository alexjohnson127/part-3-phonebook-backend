//const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json()) //allows req body to be read
app.use(cors()) //allows requests from all origins
app.use(express.static('dist')) //allows static content to be shown
morgan.token('type', function(req, res){ return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    {
        "id":"5",
        "name":"Corinna Pena-Johnson",
        "number":"69-420"
    },
    {
        "id":"6",
        "name":"alex",
        "number":"4503845"
    }
]

//node server implementation
//const app = http.createServer((req, res) => {
//    res.writeHead(200, {'content-type':'application/json'})
//    res.end(JSON.stringify(notes))
//})

function checkName(currentEntry){
    let invalidName = 0
    persons.forEach(person =>{
        if (person.name === currentEntry.name){
            invalidName = 1
        }
    })
    return invalidName
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req,res)=>{
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}`)
})

app.get('/api/persons/:id', (req,res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    res.json(person)
})

app.delete('/api/persons/:id', (req,res)=>{
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req,res) => {
    const person = req.body
    person.id = Math.floor(Math.random()*1000000)
    if(person.name === undefined){
        return res.status(400).json({
            error: 'please enter a name'
    })
    }
    else if(person.number === undefined){
        return res.status(400).json({
            error: 'please enter a number'
        })
    }
    else if(checkName(person)){
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})
