const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'root',
    database : 'face-detection'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  db('login').select('email', 'hash')
  .where({email})
  .then(data => {
    const isValid = bcrypt.compareSync(password, data[0].hash);
    if(isValid) {
      return db.select('*').from('users')
      .where({email})
      .then(user => {
        res.json(user[0]);
      })
      .catch(err => res.status(400).json('unable to get user'));
    }
    res.status(400).json('wrong credentials');
  })
  .catch(err => res.status(400).json('unable to get credentials'));
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);
  
  db.transaction(trx => {
    trx.insert({
      email: email,
      hash: hash
    })
    .into('login')
    .returning('email')
    .then(emailLogin => {
      return trx('users')
      .returning('*')
      .insert({
      name: name,
      email: emailLogin[0],
      joined: new Date()
      })
      .then(user => res.json(user[0]))
    })
    .then(trx.commit)
    .catch(trx.rollback);
  })
  .catch(err => res.status(400).json('Unable to register!'));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({id})
    .then(user => {
    if (user.length) {
      return res.json(user[0]);
    } else {
      res.status(400).json('Use not found!');
    }
  })
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('*')
  .then(user => {
    res.json(user[0].entries);
  })
  .catch(err => res.status(400).json('unable to get entries'));
  ;
});


app.listen(3001, () => {
  console.log('server running...');
});