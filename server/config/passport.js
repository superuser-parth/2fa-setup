const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/Users'); // Adjust path according to your project structure
const keys = require('../utils/authKeys'); // Your secret keys


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromExtractors([(req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt']; // Assuming the token is stored in a cookie named 'jwt'
  }
  return token;
}]);
opts.secretOrKey = keys.jwtSecretKey;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};