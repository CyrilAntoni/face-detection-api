const http = require ('http');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');



const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true,
  }
});

// ping the app every 5 minutes so the app stays awake on heroku
setInterval(() => {
  http.get('https://face-detection-api-ca.herokuapp.com/');
  http.get('https://face-detection-cyril-antoni.herokuapp.com/');
  console.log('app pinged!');
}, 300000);

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send('Api is live...'); });
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});
app.put('/image', (req, res) => {image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => {image.handleImageApi(req, res)});

const PORT = process.env.PORT;
app.listen(PORT || 8000, () => {
  console.log('server running...');
});