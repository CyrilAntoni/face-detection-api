const handleProfile = (req, res, db) => {
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
};

module.exports = {
  handleProfile: handleProfile,
};