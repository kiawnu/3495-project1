const express = require('express');
const PORT = process.env.PORT || 3200;
const path = require("path");
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const { createProxyMiddleware } = require("http-proxy-middleware");
app.use(express.urlencoded({ extended: true })); // Allows parsing of form data
app.use(express.json()); // Allows parsing of JSON requests


const users = [
{ id: 1, username: 'user', password: 'password' }
];

// Use session middleware
app.use(session({
secret: 'your-secret-key',
resave: false,
saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(
(username, password, done) => {
const user = users.find(u => u.username === username);
if (!user) {
return done(null, false, { message: 'Incorrect username.' });
}
if (user.password !== password) {
return done(null, false, { message: 'Incorrect password.' });
}
return done(null, user);
}
));

passport.serializeUser((user, done) => {
done(null, user.id);
});
passport.deserializeUser((id, done) => {
const user = users.find(u => u.id === id);
done(null, user);
});

app.post('/login',
passport.authenticate('local', {
successRedirect: 'http://localhost:3000/',
failureRedirect: '/login',
// failureFlash: true
})
);

app.get('/profile', (req, res) => {
if (req.isAuthenticated()) {
res.send('Welcome to your profile');
} else {
res.redirect('/login');
}
});
app.get('/login', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) {
return next();
}
res.redirect('/login');
}
app.get('/protected', ensureAuthenticated, (req, res) => {
res.send('This is a protected route');
});

app.use('/web', ensureAuthenticated, createProxyMiddleware({
    target: 'http://localhost:3000/', // Internal service
    changeOrigin: true
}));

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});