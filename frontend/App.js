import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  useWindowDimensions,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const { width } = useWindowDimensions();
  const [screen, setScreen] = useState('login'); // 'login', 'signup', 'home'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const getApiUrl = () => {
    const defaultUrl = 'http://localhost:5000';
    if (typeof window !== 'undefined' && window.location.hostname.includes('github.dev')) {
      // Garante que só vai trocar a porta no final do link (antes do .app.github.dev)
      return `https://${window.location.hostname.replace(/-\d+\.app\.github\.dev/, '-5000.app.github.dev')}`;
    }
    return defaultUrl;
  };

  const API_URL = getApiUrl();
  const isLargeScreen = width > 768;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        setScreen('home');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      alert(data.message);
      if (data.success) setScreen('login');
    } catch (error) {
      alert('Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  if (screen === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.content}>
          <Text style={styles.title}>🃏 Bem-vindo ao Poker Terça!</Text>
          <Text style={styles.subtitle}>Você está logado como {email}</Text>
          <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={() => setScreen('login')}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.authCard, isLargeScreen && styles.authCardDesktop]}>
          <Text style={styles.logo}>🃏 POKER TERÇA</Text>
          <Text style={styles.authTitle}>
            {screen === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput 
              style={styles.input} 
              placeholder="seu@email.com" 
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput 
              style={styles.input} 
              placeholder="••••••••" 
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={screen === 'login' ? handleLogin : handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Carregando...' : (screen === 'login' ? 'Entrar' : 'Cadastrar')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton} 
            onPress={() => setScreen(screen === 'login' ? 'signup' : 'login')}
          >
            <Text style={styles.switchText}>
              {screen === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  authCardDesktop: {
    maxWidth: 450,
    padding: 40,
  },
  logo: {
    fontSize: 24,
    fontWeight: '900',
    color: '#e53935',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#ccc',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#262626',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  button: {
    backgroundColor: '#e53935',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#7f2b2b',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: '#888',
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  }
});
