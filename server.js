const fetch = require('node-fetch');
if (!global.fetch) {
    global.fetch = fetch;
    global.Headers = fetch.Headers;
    global.Request = fetch.Request;
    global.Response = fetch.Response;
}

const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { corsWithOptions } = require('./cors');
const { port } = require('./config/dot-env');
const socketManager = require('./sockets');

// Services
const challengeCounterService = require('./services/challenge-counter.service');
const filterCounterService = require('./services/filter-counter.service');
const globalCounterService = require('./services/global-counter.service');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsWithOptions);

require('./config/passport')(passport);
app.use(passport.initialize());

// Socket
const io = socketManager(server);

// ✅ IMPORTANT : Partager io avec les contrôleurs
app.set('io', io);

// Init Services
Promise.all([
  challengeCounterService.init(),
  filterCounterService.init(),
  globalCounterService.init()
]).then(() => console.log('✅ Services prêts'));

// Synchro DB
setInterval(() => {
  challengeCounterService.sync();
  filterCounterService.sync();
  globalCounterService.sync();
}, 5000);

// Routes
app.use('/api', require('./routes'));

server.listen(port, () => {
  console.log(`🚀 Serveur sur port ${port}`);
});

process.on('SIGINT', async () => {
  await Promise.all([
    challengeCounterService.sync(),
    filterCounterService.sync(),
    globalCounterService.sync()
  ]);
  process.exit(0);
});