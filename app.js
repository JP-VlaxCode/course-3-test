const express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
const session = require('express-session');
const app = express();
const mysql = require('mysql2/promise');
const bodyParser = require("body-parser");
const { Eta } = require("eta")

const env = require("./env");

const connection = mysql.createConnection({
  host: env.default.host,
  user: env.default.user,
  password: env.default.password,
  database: env.default.database,
  port: 3306
});

global.db = connection;

app.set('port', process.env.PORT || 8080);

let viewpath = path.join(__dirname + '/views');

let eta = new Eta({ views: viewpath, cache: true });

app.engine("eta", eta.render)
app.set("view engine", "eta")
app.set('views', viewpath);

global.eta = eta;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.get('/', routes.index);
app.get('/signup', user.signup);
app.post('/signup', user.signup);
app.get('/login', routes.index);
app.post('/login', user.login);
app.get('/home/dashboard', user.dashboard);
app.get('/home/logout', user.logout);
app.get('/home/profile', user.profile);

app.listen(8080)