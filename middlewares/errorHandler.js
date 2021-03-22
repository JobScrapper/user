module.exports = (err, req, res, next) => {
  if (err.name === 'CustomError') {
    res.status(err.status).json({ error: err.msg });
  } else {
    res.status(500).json({ error: err });
  }
}