require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet')
const cors = require('cors');
const MOVIEDEX = require('./movidex.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());


app.use(function validateToken(req, res, next)  {
    const apiToken = process.env.API_TOKEN;
    const bearerToken = req.get('Authorization');
    console.log(`validating token`);
    if (!bearerToken || bearerToken.split(' ')[1] !== apiToken ) {
        return res
            .status(401)
            .json({ error: 'Unauthorized request'});
    };
    next();
})

app.get('/movies', function getMovies(req, res) {
    let response = MOVIEDEX;
    const { genre, country, rating } = req.query;

    if(genre) {
        response = response.filter(movie => 
            movie.genre.toLowerCase().includes(genre.toLowerCase()) 
        )
    }

    if(country) {
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(country.toLowerCase())
        )
    }

    if(rating) {   
        response = response.filter(movie => 
            Number(movie.avg_vote) >= Number(rating)
        ) 
    }
    res.json(response)
})

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
});