const express = require('express');
const axios = require('axios');
const http = require('http');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql2/promise');
const bodyParser = require("body-parser");
const { Eta } = require("eta");
const routes = require('./routes');
const user = require('./routes/user');
const env = require("./env");

const app = express();

//URL API newsletter AI
const newsletterApiUrl = 'https://newsapi.org/v2/everything?q=ai&apiKey=21621e6958904a52a48bc37611c0cbe0';

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

// Ruta para mostrar las noticias (Página de inicio)
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(newsletterApiUrl);
    const newsData = response.data;
	res.send(global.eta.render("newsletter", { newsData }));
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).send('Error al obtener noticias');
  }
});

// Resto de las rutas
app.get('/subscribe', user.subscribe);
app.post('/subscribe', user.subscribe);

// Iniciar el servidor
const server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log(`Servidor en funcionamiento en http://localhost:${app.get('port')}`);
});
