import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  ActivityIndicator 
} from 'react-native';
import { theme } from '../theme';
import { matchService } from '../services/api';

export default function PartidaDetalhesView({ matchId, userEmail, onBack }) {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cashResult, setCashResult] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMatchDetails = async () => {
    setLoading(true);
    try {
      const data = await matchService.getMatchDetails(matchId);
      if (data.success) {
        setMatch(data.match);
      } else {
        alert(data.message);
        onBack();
      }
    } catch (error) {
      alert('Erro ao carregar detalhes da partida.');
      onBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  const handleSubmitResult = async () => {
    if (!cashResult || isNaN(cashResult)) {
      alert('Por favor, informe um valor numérico válido (ex: 50.50 ou -20).');
      return;
    }

    setSubmitting(true);
    try {
      const data = await matchService.submitResult(matchId, userEmail, cashResult);
      if (data.success) {
        alert('Resultado salvo!');
        setCashResult('');
        fetchMatchDetails(); // Atualiza o placar
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Erro ao salvar resultado.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !match) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Montar o ranking (array de objetos { email, result })
  const ranking = match.players.map(player => ({
    email: player,
    result: match.results && match.results[player] !== undefined ? match.results[player] : null
  }));

  // Ordenar o ranking: maiores lucros primeiro. Quem não tem resultado vai pro fim.
  ranking.sort((a, b) => {
    if (a.result === null && b.result === null) return 0;
    if (a.result === null) return 1;
    if (b.result === null) return -1;
    return b.result - a.result; // Maior para menor
  });

  const renderRankingItem = ({ item, index }) => {
    const hasResult = item.result !== null;
    const isPositive = hasResult && item.result > 0;
    const isNegative = hasResult && item.result < 0;
    
    return (
      <View style={[styles.rankingCard, item.email === userEmail && styles.myRankingCard]}>
        <Text style={styles.rankingPosition}>{index + 1}º</Text>
        <Text style={styles.rankingEmail} numberOfLines={1}>{item.email}</Text>
        
        {hasResult ? (
          <Text style={[
            styles.rankingValue, 
            isPositive ? styles.positiveResult : (isNegative ? styles.negativeResult : styles.neutralResult)
          ]}>
            {isPositive ? '+' : ''}R$ {item.result.toFixed(2)}
          </Text>
        ) : (
          <Text style={styles.pendingText}>Pendente</Text>
        )}
      </View>
    );
  };

  const hasMyResult = match.results && match.results[userEmail] !== undefined;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>⬅ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mesa: {match.date}</Text>
        <Text style={styles.subtitle}>{match.players.length} jogadores</Text>
      </View>

      <View style={styles.content}>
        
        {/* SEÇÃO 1: FORMULÁRIO DE RESULTADO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meu Resultado</Text>
          <View style={styles.card}>
            {hasMyResult ? (
              <View>
                <Text style={styles.successMessage}>Seu resultado já foi registrado!</Text>
                <Text style={styles.myResultText}>
                  R$ {match.results[userEmail].toFixed(2)}
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.label}>Lucro ou Prejuízo (R$)</Text>
                <Text style={styles.helperText}>Use o sinal de menos (-) para perdas. Ex: 50.00 ou -20.50</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.textMuted}
                  value={cashResult}
                  onChangeText={setCashResult}
                  keyboardType="numeric"
                />
                <TouchableOpacity 
                  style={[styles.button, submitting && styles.buttonDisabled]}
                  onPress={handleSubmitResult}
                  disabled={submitting}
                >
                  <Text style={styles.buttonText}>
                    {submitting ? 'Salvando...' : 'Salvar Resultado'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* SEÇÃO 2: PLACAR FINAL */}
        <View style={[styles.section, { flex: 1.5 }]}>
          <Text style={styles.sectionTitle}>Placar Final (Ranking)</Text>
          <View style={styles.rankingContainer}>
            <FlatList 
              data={ranking}
              keyExtractor={item => item.email}
              renderItem={renderRankingItem}
              style={{ flex: 1 }}
            />
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.large,
  },
  header: {
    marginBottom: theme.spacing.large,
  },
  backButton: {
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.cardBackground,
    alignSelf: 'flex-start',
    borderRadius: theme.borderRadius.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  backButtonText: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.large,
  },
  section: {
    flex: 1,
    minWidth: 300,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 15,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.large,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    color: theme.colors.textPrimary,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  helperText: {
    color: theme.colors.textMuted,
    marginBottom: 15,
    fontSize: 12,
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.medium,
    padding: 15,
    color: theme.colors.textPrimary,
    fontSize: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.medium,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.primaryDisabled,
  },
  buttonText: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  successMessage: {
    color: theme.colors.success,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  myResultText: {
    color: theme.colors.textPrimary,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rankingContainer: {
    flex: 1,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rankingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  myRankingCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: theme.borderRadius.small,
  },
  rankingPosition: {
    width: 40,
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textMuted,
  },
  rankingEmail: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
  rankingValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  positiveResult: {
    color: theme.colors.success,
  },
  negativeResult: {
    color: theme.colors.error,
  },
  neutralResult: {
    color: theme.colors.textPrimary,
  },
  pendingText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontStyle: 'italic',
  }
});
