import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  useWindowDimensions 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../theme';

// Para simplificar, vou extrair a URL aqui também (depois podemos colocar num context/util)
const getApiUrl = () => {
  const defaultUrl = 'http://localhost:5000';
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.dev')) {
    return `https://${window.location.hostname.replace(/-\d+\.app\.github\.dev/, '-5000.app.github.dev')}`;
  }
  return defaultUrl;
};
const API_URL = getApiUrl();

export default function HomeScreen({ userEmail, onLogout }) {
  const { width } = useWindowDimensions();
  const [status, setStatus] = useState('Conectando ao backend...');
  const isLargeScreen = width > 768;

  useEffect(() => {
    fetch(`${API_URL}/api/status`)
      .then(res => res.json())
      .then(data => setStatus(data.message))
      .catch(err => setStatus('Erro ao conectar com o backend ❌'));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={[styles.content, isLargeScreen && styles.contentDesktop]}>
        
        <View style={styles.header}>
          <Text style={styles.title}>🃏 Poker Terça</Text>
          <Text style={styles.subtitle}>Logado como: {userEmail}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status do Sistema</Text>
          <Text style={styles.statusText}>{status}</Text>
        </View>

        <View style={[styles.menuGrid, isLargeScreen && styles.menuGridDesktop]}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.buttonText}>Nova Partida</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.buttonText}>Jogadores</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.buttonText}>Ranking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.buttonText}>Histórico</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.medium,
    alignItems: 'center',
  },
  contentDesktop: {
    paddingHorizontal: '10%',
  },
  header: {
    marginTop: theme.spacing.xlarge,
    marginBottom: theme.spacing.large,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 10,
  },
  logoutButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.small,
  },
  logoutText: {
    color: theme.colors.textSecondary,
  },
  card: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
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
  menuGrid: {
    width: '100%',
    maxWidth: 600,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuGridDesktop: {
    maxWidth: 800,
  },
  menuButton: {
    width: '48%',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  }
});
