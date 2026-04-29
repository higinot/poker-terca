const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');

// Conectar ao Banco de Dados (só funciona se a variável MONGO_URI estiver no .env)
if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.log('Aviso: MONGO_URI não definida. O banco não conectará automaticamente.');
}

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
