const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());
// 없으면 404, 잘못요청하면 400

const genres = [{
        id: 1,
        name: 'comic'
    },
    {
        id: 2,
        name: 'romance'
    },
    {
        id: 3,
        name: 'action'
    }
]

app.get('/', (req, res) => {
    res.send(welcome());
})

function welcome() {
    return `<h1>Hi, VIDLY :D</h1>`
}

// Read == Get
app.get('/api/genres', (req, res) => {
    res.send(genres)
});
app.get('/api/genres/:id', (req, res) => {
    // validate id
    const genre = genres.find(c => c.id == req.params.id) // * parseInt안해도 되네?;
    if (!genre) { // 없으면 404
        return res.status(404).send(`The genre with given ID is not existed.`);
    }
    res.send(genre);
});

// Create == POST
app.post('/api/genres', (req, res) => {
    // validation 
    const result = genreValidation(req.body.name);
    if (result.error) {
        return res.status(400).send(result.error.message);
    }
    const newGenre = {
        id: genres.length + 1, // *
        name: req.body
    };
    genres.push(newGenre);
    res.send(newGenre);
})

// Delete == Delete
app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id == req.params.id) // *
    if (!genre) {
        return res.status(400).send(`The genre with given ID is not existed.`);
    }
    genres.splice(genre, 1); // * 인덱스 안구하고 그냥 삭제해도 삭제가 되긴되네.. 원래는 indexOf
    res.send(genre);
});

// Update == PUT
app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id == req.params.id) // *
    if (!genre) {
        return res.status(400).send(`The genre with given ID is not existed.`);
    }
    // id confirmed, update a name
    const result = genreValidation(req.body.name);
    if (result.error) {
        return res.status(400).send(result.error.message);
    }
    // console.log(genres[genre.id]);
    // ******** genres[genre.id] = req.body;
    genre.name = req.body.name; // * reference 니까 원배열도 바뀌네
    res.send(genre);
})

function genreValidation(genre) {
    const schema = Joi.string().min(3).max(10).required();
    return schema.validate(genre); // * req.body.name
}

// RESTful = representational
const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`I'm listening...`) });