module.exports = (err, req, res, next) => {
  console.log(err, '<<<');
  if (err.name === 'CustomError') {
    res.status(err.status).json({ error: err.msg });
  } else {
    res.status(500).json({ error: err });
  }
}