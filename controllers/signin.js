const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  
  if(!email || !password) {
    return res.status(400).json('error signing in');
  }
  
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
};

module.exports = {
  handleSignin,
};