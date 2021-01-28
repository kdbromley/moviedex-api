require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet')
const cors = require('cors');
const MOVIEDEX = require('./movidex.json');

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());


app.use(function validateToken(req, res, next)  {
    const apiToken = process.env.API_TOKEN;
    const bearerToken = req.get('Authorization');
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

app.use((error, req, res, next) => {
    let response;
    if(process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }; 
    } else {
        response = { error }
    }
    res.status(500).json(response)
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
});