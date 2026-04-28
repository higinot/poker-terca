// Banco de dados em memória (reseta se o servidor reiniciar)
let matches = [];
let nextId = 1;

const createMatch = (req, res) => {
  const { date, creatorEmail } = req.body;
  
  if (!date || !creatorEmail) {
    return res.status(400).json({ success: false, message: 'Data e criador são obrigatórios.' });
  }

  const newMatch = {
    id: nextId++,
    date,
    status: 'OPEN',
    creator: creatorEmail,
    players: [creatorEmail], // O criador já entra na mesa automaticamente
    results: {}, // Armazena { "email@teste.com": 150.50 }
    createdAt: new Date()
  };

  matches.push(newMatch);
  res.json({ success: true, message: 'Partida criada com sucesso!', match: newMatch });
};

const listOpenMatches = (req, res) => {
  const openMatches = matches.filter(m => m.status === 'OPEN');
  res.json({ success: true, matches: openMatches });
};

const joinMatch = (req, res) => {
  const matchId = parseInt(req.params.id);
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ success: false, message: 'Email do usuário é obrigatório.' });
  }

  const matchIndex = matches.findIndex(m => m.id === matchId);
  
  if (matchIndex === -1) {
    return res.status(404).json({ success: false, message: 'Partida não encontrada.' });
  }

  const match = matches[matchIndex];

  if (match.players.includes(userEmail)) {
    return res.status(400).json({ success: false, message: 'Você já está nesta mesa!' });
  }

  // Adiciona o jogador à mesa
  match.players.push(userEmail);
  
  res.json({ success: true, message: 'Você entrou na partida com sucesso!', match });
};

const getMatchDetails = (req, res) => {
  const matchId = parseInt(req.params.id);
  const match = matches.find(m => m.id === matchId);

  if (!match) {
    return res.status(404).json({ success: false, message: 'Partida não encontrada.' });
  }

  res.json({ success: true, match });
};

const submitResult = (req, res) => {
  const matchId = parseInt(req.params.id);
  const { userEmail, cashResult } = req.body;

  const matchIndex = matches.findIndex(m => m.id === matchId);
  if (matchIndex === -1) {
    return res.status(404).json({ success: false, message: 'Partida não encontrada.' });
  }

  const match = matches[matchIndex];

  if (!match.players.includes(userEmail)) {
    return res.status(400).json({ success: false, message: 'Você não faz parte desta partida.' });
  }

  // Registra o resultado em Cash Game (pode ser positivo ou negativo)
  match.results[userEmail] = parseFloat(cashResult);

  res.json({ success: true, message: 'Resultado salvo com sucesso!', match });
};

module.exports = {
  createMatch,
  listOpenMatches,
  joinMatch,
  getMatchDetails,
  submitResult
};
