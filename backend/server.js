const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'Backend do Poker Terça está online! 🃏',
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
