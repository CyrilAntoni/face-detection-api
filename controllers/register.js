const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);
  
  if ( !name || !email || !password ) {
    return res.status(400).json('unable to register');
  }
  
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
}

module.exports = {
  handleRegister,
};