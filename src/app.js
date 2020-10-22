const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Mr. White'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Mr. White'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Mr. White'
    });
});

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'No address!'
        });
    }

    geocode(req.query.address, (error, {latitude,longitude,location} = {}) => {
        if(error) {
            return res.send({ error });
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({ error });
            }
            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            });
        });
    });

    
});

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'No search query'
        });
    }
    
    res.send({
        products: []
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'White',
        errorMessage: 'Page not found'
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000.');
});