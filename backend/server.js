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

// Rotas de Autenticação (Simuladas)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Tentativa de login:', email);
  
  // Simulação de sucesso
  if (email && password) {
    res.json({ success: true, message: 'Login realizado com sucesso!', user: { email } });
  } else {
    res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios.' });
  }
});

app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  console.log('Novo cadastro:', email);
  
  res.json({ success: true, message: 'Usuário cadastrado com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
