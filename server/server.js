const express = require('express');
const cors = require('cors');
const requestIP = require('request-ip');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.static('dist/weather-app'));
const googleapi = ''
const tomorrowAPI = ''
const ipinfoAPI = ''

app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(requestIP.mw());

// Define API endpoints
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});

app.get('/api/IPInfo', async(req,res)=>{
  const ip = req.clientIp;
  res.json({IP: ip});

});

app.get('/api/newsubmit', async (req,res)=>{
  //var street = req.query.street;
  var city = req.query.city;
  //var state = req.query.state;
  //var address = street +' '+ city +' '+ state;
  //console.log(address);
  //geocode = await fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+googleapi);
  //console.log(geocode);
  //const geojson = await geocode.json();
  //const geocodingresults = geojson.results;
  //const geometry = geocodingresults[0].geometry;
  //const location = geometry.location;
  //const lat = location.lat
  //const lng = location.lng
  //console.log(lat);
  //console.log(lng);
  url = "https://api.tomorrow.io/v4/timelines?location="+city+"&fields=temperature&fields=temperatureApparent&fields=temperatureMin&fields=temperatureMax&fields=windSpeed&fields=windDirection&fields=humidity&fields=pressureSeaLevel&fields=uvIndex&fields=weatherCode&fields=precipitationProbability&fields=precipitationType&fields=sunriseTime&fields=sunsetTime&fields=visibility&fields=moonPhase&fields=cloudCover&units=imperial&timesteps=1d&startTime=now";
  weather = await fetch(url,{headers:{"accept": "application/json",
        "Accept-Encoding": "gzip",
        "content-type": "application/json",
        "apikey": tomorrowAPI}});
  weatherjson = await weather.json();
  //weatherjson.lat = lat;
  //weatherjson.lng = lng;
  weatherjson.city = city;
  res.json(weatherjson);
});

app.get('/api/newsubmit2', async (req,res)=>{
  console.log("Here");
  //var lat2 = req.query.lat;
  //var lng2 = req.query.lng;
  var city = req.query.city;

  url2 = "https://api.tomorrow.io/v4/timelines?location="+city+"&fields=temperature&fields=temperatureApparent&fields=temperatureMin&fields=temperatureMax&fields=windSpeed&fields=windDirection&fields=humidity&fields=pressureSeaLevel&units=imperial&timesteps=1h&startTime=now";
  weather2 = await fetch(url2,{headers:{"accept": "application/json",
        "Accept-Encoding": "gzip",
        "content-type": "application/json",
        "apikey": tomorrowAPI}});
  weatherjson2 = await weather2.json();
  res.json(weatherjson2);
});

app.get('/api/submit', async (req,res)=>{
  var street = req.query.street;
  var city = req.query.city;
  var state = req.query.state;
  var address = street +' '+ city +' '+ state;
  console.log(address);
  geocode = await fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+googleapi);
  console.log(geocode);
  const geojson = await geocode.json();
  const geocodingresults = geojson.results;
  return geocodingresults;
  console.log(geocodingresults);
  const geometry = geocodingresults[0].geometry;
  const location = geometry.location;
  const lat = location.lat
  const lng = location.lng
  console.log(lat);
  console.log(lng);
  url = "https://api.tomorrow.io/v4/timelines?location="+lat+"%2C%20"+lng+"&fields=temperature&fields=temperatureApparent&fields=temperatureMin&fields=temperatureMax&fields=windSpeed&fields=windDirection&fields=humidity&fields=pressureSeaLevel&fields=uvIndex&fields=weatherCode&fields=precipitationProbability&fields=precipitationType&fields=sunriseTime&fields=sunsetTime&fields=visibility&fields=moonPhase&fields=cloudCover&units=imperial&timesteps=1d&startTime=now";
  weather = await fetch(url,{headers:{"accept": "application/json",
        "Accept-Encoding": "gzip",
        "content-type": "application/json",
        "apikey": tomorrowAPI}});
  weatherjson = await weather.json();
  weatherjson.lat = lat;
  weatherjson.lng = lng;
  weatherjson.address = address;
  res.json(weatherjson);
});

app.get('/api/submit2', async (req,res)=>{
  console.log("Here");
  var lat2 = req.query.lat;
  var lng2 = req.query.lng;

  url2 = "https://api.tomorrow.io/v4/timelines?location="+lat2+"%2C%20"+lng2+"&fields=temperature&fields=temperatureApparent&fields=temperatureMin&fields=temperatureMax&fields=windSpeed&fields=windDirection&fields=humidity&fields=pressureSeaLevel&units=imperial&timesteps=1h&startTime=now";
  weather2 = await fetch(url2,{headers:{"accept": "application/json",
        "Accept-Encoding": "gzip",
        "content-type": "application/json",
        "apikey": tomorrowAPI}});
  weatherjson2 = await weather2.json();
  res.json(weatherjson2);
});



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});