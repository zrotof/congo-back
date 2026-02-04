const fs = require('fs');
const path = require('path');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { rsa } = require('./dot-env');
const { models } = require('../models');

// Charger la clé publique RSA
const publicKeyPath = path.join(__dirname, '..', rsa.keysDir, rsa.publicKeyFilename);
const RSA_PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');

// Extraire le token du cookie
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['admin_token'];
  }
  return token;
};

const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    cookieExtractor,
    ExtractJwt.fromAuthHeaderAsBearerToken()
  ]),
  secretOrKey: RSA_PUBLIC_KEY,
  algorithms: ['RS256']
};

module.exports = (passport) => {
  passport.use('admin-jwt', new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await models.User.findByPk(payload.id);

      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }));
};