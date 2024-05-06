const states = require('../data/states').map(state => state.abbreviation);


function verifyStateParameter(req, res, next) {
  const stateCode = req.params.state;

  // Check if the state code is valid
  if (!stateCode || typeof stateCode !== 'string') {
    return res.status(400).json({ error: 'State abbreviation code is required and must be a string' });
  }

  const normalizedStateCode = stateCode.toUpperCase();

  if (!states.includes(normalizedStateCode)) {
    return res.status(400).json({ error: 'Invalid state abbreviation code' });
  }

  // Attach the normalized state code to the request object
  req.state = normalizedStateCode;

  next();
}

module.exports = {verifyStateParameter};