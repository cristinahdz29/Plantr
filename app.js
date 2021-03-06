require('dotenv').config();
const PORT = process.env.PORT || 8080;
const SESSION_PASS = process.env.SESSION_PASS;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const { dirname } = require('path');
const VIEW_PATH = path.join(__dirname, '/views');
const models = require('./models');
const { Op } = require('sequelize');
const authenticate = require('./authenticate');
const indexRoutes = require('./routes/index');
const accountRoutes = require('./routes/account');
const newsfeedRoutes = require('./routes/newsfeed');
const commentRoutes =  require('./routes/comment');

global.__basedir = __dirname;

app.use(session({
    secret: SESSION_PASS,
    resave: false,
    saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use('/styles', express.static('styles'));
app.use('/images', express.static('images'));
app.use('/uploads', express.static('uploads'));
app.use('/js', express.static('js'));
app.engine('mustache', mustacheExpress(VIEW_PATH + '/partials', '.mustache'));
app.set('views', VIEW_PATH);
app.set('view engine', 'mustache');
app.use('/index', indexRoutes);
app.use('/account', authenticate.authenticate, accountRoutes);
app.use('/newsfeed', authenticate.authenticate, newsfeedRoutes);
app.use('/comment', authenticate.authenticate, commentRoutes);

app.get('/', (req, res) => {
    res.redirect('/index')
})

app.listen(PORT, () => {
    console.log("Server is running...");
});
