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
import { theme } from '../theme';
import { authService } from '../services/api';

export default function LoginScreen({ onLoginSuccess }) {
  const { width } = useWindowDimensions();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isLargeScreen = width > 768;

  const handleSubmit = async () => {
    if (!email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      let data;
      if (isLoginMode) {
        data = await authService.login(email, password);
      } else {
        data = await authService.register(email, password);
      }

      if (data.success) {
        if (isLoginMode) {
          onLoginSuccess(email);
        } else {
          alert(data.message);
          setIsLoginMode(true); // Volta para login após cadastro
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.authCard, isLargeScreen && styles.authCardDesktop]}>
          <Text style={styles.logo}>🃏 POKER TERÇA</Text>
          <Text style={styles.authTitle}>
            {isLoginMode ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput 
              style={styles.input} 
              placeholder="seu@email.com" 
              placeholderTextColor={theme.colors.textMuted}
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
              placeholderTextColor={theme.colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Carregando...' : (isLoginMode ? 'Entrar' : 'Cadastrar')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton} 
            onPress={() => setIsLoginMode(!isLoginMode)}
          >
            <Text style={styles.switchText}>
              {isLoginMode ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça Login'}
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
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.medium,
  },
  authCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.xlarge,
    padding: theme.spacing.large,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  authCardDesktop: {
    maxWidth: 450,
    padding: theme.spacing.xlarge,
  },
  logo: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.small,
    letterSpacing: 2,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
  },
  inputContainer: {
    marginBottom: theme.spacing.medium,
  },
  label: {
    color: theme.colors.textMuted,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.medium,
    padding: 15,
    color: theme.colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    alignItems: 'center',
    marginTop: theme.spacing.small,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.primaryDisabled,
  },
  buttonText: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchButton: {
    marginTop: theme.spacing.medium,
    alignItems: 'center',
  },
  switchText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  }
});
