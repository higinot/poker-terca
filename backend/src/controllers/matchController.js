const Match = require('../models/Match');

const createMatch = async (req, res) => {
  const { date, creatorEmail } = req.body;
  
  if (!date || !creatorEmail) {
    return res.status(400).json({ success: false, message: 'Data e criador são obrigatórios.' });
  }

  try {
    const newMatch = await Match.create({
      date,
      creator: creatorEmail,
      players: [creatorEmail],
      results: {}
    });

    res.json({ success: true, message: 'Partida criada com sucesso!', match: newMatch });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criar partida no banco de dados.' });
  }
};

const listOpenMatches = async (req, res) => {
  try {
    const openMatches = await Match.find({ status: 'OPEN' }).sort({ createdAt: -1 });
    res.json({ success: true, matches: openMatches });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao listar partidas.' });
  }
};

const joinMatch = async (req, res) => {
  const { id } = req.params;
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ success: false, message: 'Email do usuário é obrigatório.' });
  }

  try {
    const match = await Match.findById(id);
    
    if (!match) {
      return res.status(404).json({ success: false, message: 'Partida não encontrada.' });
    }

    if (match.players.includes(userEmail)) {
      return res.status(400).json({ success: false, message: 'Você já está nesta mesa!' });
    }

    match.players.push(userEmail);
    await match.save();
    
    res.json({ success: true, message: 'Você entrou na partida com sucesso!', match });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao entrar na partida.' });
  }
};

const getMatchDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const match = await Match.findById(id);

    if (!match) {
      return res.status(404).json({ success: false, message: 'Partida não encontrada.' });
    }

    res.json({ success: true, match });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar detalhes da partida.' });
  }
};

const submitResult = async (req, res) => {
  const { id } = req.params;
  const { userEmail, cashResult } = req.body;

  try {
    const match = await Match.findById(id);
    
    if (!match) {
      return res.status(404).json({ success: false, message: 'Partida não encontrada.' });
    }

    if (!match.players.includes(userEmail)) {
      return res.status(400).json({ success: false, message: 'Você não faz parte desta partida.' });
    }

    // Registra o resultado em Cash Game
    match.results.set(userEmail, parseFloat(cashResult));
    await match.save();

    res.json({ success: true, message: 'Resultado salvo com sucesso!', match });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao salvar resultado.' });
  }
};

module.exports = {
  createMatch,
  listOpenMatches,
  joinMatch,
  getMatchDetails,
  submitResult
};
