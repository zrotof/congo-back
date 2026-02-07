const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { corsWithOptions } = require('./cors');
const { port } = require('./config/dot-env');
const socketManager = require('./sockets');

// ✅ Import des 3 services compteurs
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

const io = socketManager(server);

// ✅ Init des 3 services
Promise.all([
  challengeCounterService.init(),
  filterCounterService.init(),
  globalCounterService.init()
]).then(() => console.log('✅ Tous les services prêts'));

// ✅ Synchro des 3 services
setInterval(() => {
  challengeCounterService.sync();
  filterCounterService.sync();
  globalCounterService.sync();
}, 5000);

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