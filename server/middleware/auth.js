const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    req.isAuthenticated = false;

    return next();
  }

  const [, token] = authHeader.split(' ');

  if (!token || token === '') {
    req.isAuthenticated = false;

    return next();
  }

  try {
    const decodedToken = await jwt.verify(token, config.TOKEN_SECRET_KEY);

    req.userId = decodedToken.userId;
    req.isAuthenticated = true;

    return next();
  } catch (error) {
    req.isAuthenticated = false;

    return next();
  }
};
