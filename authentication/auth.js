const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(
    new LocalStrategy((username, password, done) => {
        // Verification of user credentials
        if (username === 'user' && password === 'password') {
            return done(null, { id: 1, username: 'user' })
        } else {
            return done(null, false, { message: 'Inavlid credentials' });
        }
    })
)