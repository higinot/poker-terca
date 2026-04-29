// Lógica centralizada para detectar a URL da API
const getApiUrl = () => {
  // 1. Se estivermos rodando no Codespaces, tentar achar a URL mapeada.
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.dev')) {
    return `https://${window.location.hostname.replace(/-\d+\.app\.github\.dev/, '-5000.app.github.dev')}`;
  }
  // 2. Se houver uma variável de ambiente do Vercel/Produção (EXPO_PUBLIC_API_URL).
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // 3. Fallback para localhost local.
  return 'http://localhost:5000';
};

const API_URL = getApiUrl();

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  register: async (email, password) => {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }
};

export const matchService = {
  create: async (date, creatorEmail) => {
    const response = await fetch(`${API_URL}/api/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, creatorEmail })
    });
    return response.json();
  },
  
  getOpenMatches: async () => {
    const response = await fetch(`${API_URL}/api/matches/open`);
    return response.json();
  },

  join: async (matchId, userEmail) => {
    const response = await fetch(`${API_URL}/api/matches/${matchId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail })
    });
    return response.json();
  },

  getMatchDetails: async (matchId) => {
    const response = await fetch(`${API_URL}/api/matches/${matchId}`);
    return response.json();
  },

  submitResult: async (matchId, userEmail, cashResult) => {
    const response = await fetch(`${API_URL}/api/matches/${matchId}/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, cashResult })
    });
    return response.json();
  }
};

