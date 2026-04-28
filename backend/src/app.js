const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api', authRoutes);
app.use('/api/matches', matchRoutes);

// Rota de Teste Base
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'Backend do Poker Terça está online! 🃏',
    timestamp: new Date()
  });
});

module.exports = app;
