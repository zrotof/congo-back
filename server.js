const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { corsWithOptions } = require('./cors');
const { port } = require('./config/dot-env');
const socketManager = require('./sockets');
const viewService = require('./services/view.service');

const app = express();
const server = http.createServer(app);

// ══════════════════════════════════════════════════════
//                    MIDDLEWARES
// ══════════════════════════════════════════════════════

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsWithOptions);

// ══════════════════════════════════════════════════════
//                    PASSPORT
// ══════════════════════════════════════════════════════

require('./config/passport')(passport);
app.use(passport.initialize());

// ══════════════════════════════════════════════════════
//                    SOCKET.IO
// ══════════════════════════════════════════════════════

const io = socketManager(server);

// ══════════════════════════════════════════════════════
//                    VIEW SERVICE
// ══════════════════════════════════════════════════════

viewService.init().then(() => {
  console.log('✅ ViewService prêt');
});

setInterval(() => {
  viewService.syncToDatabase();
}, 5000);

// ══════════════════════════════════════════════════════
//                    ROUTES
// ══════════════════════════════════════════════════════

app.use('/api', require('./routes'));

app.get('/', (req, res) => {
  res.json({
    message: 'Reveal Challenge API',
    version: '1.0.0'
  });
});

// ══════════════════════════════════════════════════════
//                    ERREURS
// ══════════════════════════════════════════════════════

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.message);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Erreur interne'
  });
});

// ══════════════════════════════════════════════════════
//                    DÉMARRAGE
// ══════════════════════════════════════════════════════

server.listen(port, () => {
  console.log('═══════════════════════════════════════════');
  console.log(`🚀 Serveur démarré sur le port ${port}`);
  console.log(`📡 API: http://localhost:${port}/api`);
  console.log(`🔌 Socket.io: ws://localhost:${port}`);
  console.log('═══════════════════════════════════════════');
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await viewService.syncToDatabase();
  process.exit(0);
});