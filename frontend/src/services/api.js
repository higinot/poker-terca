// Lógica centralizada para detectar a URL da API
const getApiUrl = () => {
  const defaultUrl = 'http://localhost:5000';
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.dev')) {
    // Garante que só vai trocar a porta no final do link (antes do .app.github.dev)
    return `https://${window.location.hostname.replace(/-\d+\.app\.github\.dev/, '-5000.app.github.dev')}`;
  }
  return defaultUrl;
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
