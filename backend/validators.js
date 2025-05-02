const checkIfAuthenticated = (req, res, next, sessions) => {
  if (req.path === '/login') return next();

  const authTokenQuery = req.query.authToken;
  const authTokenCookie = req.cookies.authToken;

  if (sessions.has(authTokenQuery) || sessions.has(authTokenCookie)) {
    return next();
  }
  res.status(401).send({error: 'You are not authenticated'})
}

module.exports = {
  checkIfAuthenticated,
}
