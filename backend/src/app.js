const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api', authRoutes);

// Rota de Teste Base
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'Backend do Poker Terça está online! 🃏',
    timestamp: new Date()
  });
});

module.exports = app;
