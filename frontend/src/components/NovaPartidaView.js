import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

// Para simplificar, vou extrair a URL aqui também (depois centralizamos em um context)
const getApiUrl = () => {
  const defaultUrl = 'http://localhost:5000';
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.dev')) {
    return `https://${window.location.hostname.replace(/-\d+\.app\.github\.dev/, '-5000.app.github.dev')}`;
  }
  return defaultUrl;
};
const API_URL = getApiUrl();

export default function NovaPartidaView() {
  const [status, setStatus] = useState('Conectando ao backend...');

  useEffect(() => {
    fetch(`${API_URL}/api/status`)
      .then(res => res.json())
      .then(data => setStatus(data.message))
      .catch(err => setStatus('Erro ao conectar com o backend ❌'));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Partida</Text>
      <Text style={styles.subtitle}>Configure a mesa de hoje</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status do Sistema</Text>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Iniciar Mesa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.large,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xlarge,
  },
  card: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.large,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.large,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  statusText: {
    color: theme.colors.success,
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: theme.borderRadius.medium,
  },
  buttonText: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  }
});
