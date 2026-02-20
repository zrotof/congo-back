const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { corsWithOptions } = require('./cors');
const { port } = require('./config/dot-env');
const socketManager = require('./sockets');

// Import des services compteurs
const challengeCounterService = require('./services/challenge-counter.service');
const filterCounterService = require('./services/filter-counter.service');
const globalCounterService = require('./services/global-counter.service'); // ✅

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsWithOptions);

// Passport
require('./config/passport')(passport);
app.use(passport.initialize());

// Socket.io
const io = socketManager(server);

// ✅ CRUCIAL : Partager l'instance 'io' pour l'utiliser dans les contrôleurs
app.set('io', io);

// Initialisation des Services RAM
Promise.all([
  challengeCounterService.init(),
  filterCounterService.init(),
  globalCounterService.init()
]).then(() => {
  console.log('✅ Tous les services de compteurs sont prêts');
}).catch(err => {
  console.error('❌ Erreur initialisation services:', err);
});

// Synchronisation BDD (Toutes les 5 secondes)
setInterval(() => {
  challengeCounterService.sync();
  filterCounterService.sync();
  globalCounterService.sync();
}, 5000);

// Routes
app.use('/api', require('./routes'));

// Route racine
app.get('/', (req, res) => {
  res.json({ message: 'Reveal Challenge API', version: '1.0.0' });
});

// Gestion 404
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route non trouvée' });
});

// Gestion Erreurs Globales
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.message);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Erreur interne'
  });
});

// Démarrage Serveur
server.listen(port, () => {
  console.log(`🚀 Serveur démarré sur le port ${port}`);
});

// Arrêt Propre (Graceful Shutdown)
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await Promise.all([
    challengeCounterService.sync(),
    filterCounterService.sync(),
    globalCounterService.sync()
  ]);
  console.log('💾 Données synchronisées. Bye !');
  process.exit(0);
});