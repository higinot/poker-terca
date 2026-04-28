// O Controller lida com o Request (req) e Response (res) HTTP
// Num projeto real, ele chamaria um authService.js aqui.

const login = (req, res) => {
  const { email, password } = req.body;
  console.log('Tentativa de login:', email);
  
  if (email && password) {
    res.json({ success: true, message: 'Login realizado com sucesso!', user: { email } });
  } else {
    res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios.' });
  }
};

const register = (req, res) => {
  const { email, password } = req.body;
  console.log('Novo cadastro:', email);
  
  if (email && password) {
    res.json({ success: true, message: 'Usuário cadastrado com sucesso!' });
  } else {
    res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios para cadastro.' });
  }
};

module.exports = {
  login,
  register
};
