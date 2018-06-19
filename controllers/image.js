const Clarifai = require('clarifai');

//initialize Clarifai API
const app = new Clarifai.App({
 apiKey: 'c6f23f1a98ab4496982d059e4aba3c7d'
});

const handleImageApi = (req, res) => {
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data => res.json(data))
  .catch(err => res.status(400).json('unable to work with API'));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('*')
  .then(user => {
    res.json(user[0].entries);
  })
  .catch(err => res.status(400).json('unable to get entries'));
  ;
};

module.exports = {
  handleImage,
  handleImageApi,
};