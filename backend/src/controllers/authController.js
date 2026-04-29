const User = require('../models/User');

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email já cadastrado.' });
    }

    const newUser = await User.create({ email, password });
    
    // Na vida real, não retorne a senha e use Hash (bcrypt).
    res.json({ success: true, message: 'Usuário cadastrado com sucesso!', user: { email: newUser.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário no banco.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }

    res.json({ success: true, message: 'Login bem-sucedido!', user: { email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao fazer login no banco.' });
  }
};

module.exports = {
  register,
  login
};
