const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// home route
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// making the post request for the client
app.post("/", function (req, res) {
    const query = req.body.cityName;
    const apiKey = process.env.MY_KEY;
    https.get("https://api.openweathermap.org/data/2.5/weather?APPID=" + apiKey + "&units=metric&q=" + query + "#", function (response) {
        response.on('data', function (data) {
            // converting all data in JSON format
            const weatherData = JSON.parse(data);
            // collecting all the required data
            const weatherTemp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const weatherIcon = weatherData.weather[0].icon;
            const weatherIconUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
            // serving the required data
            res.write("<h1>The temperature in " + query + " is " + weatherTemp + " Celsius.</h1>");
            res.write("<h3>The Weather Description of " + query + " is " + weatherDescription + " .</h3>");
            res.write("<img src=" + weatherIconUrl + ">");
            res.send();
        });
    });
});

// listening to the port 3000
app.listen(3000, function (req, res) {
    console.log("server running at port 3000.");
});