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

export default function NovaPartidaView({ userEmail }) {
  const [date, setDate] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(true);

  const fetchMatches = async () => {
    setLoadingMatches(true);
    try {
      const data = await matchService.getOpenMatches();
      if (data.success) {
        setMatches(data.matches);
      }
    } catch (error) {
      alert('Erro ao carregar partidas abertas.');
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleCreateMatch = async () => {
    if (!date) {
      alert('Por favor, informe a data da partida.');
      return;
    }
    
    setLoading(true);
    try {
      const data = await matchService.create(date, userEmail);
      if (data.success) {
        alert('Partida criada com sucesso!');
        setDate('');
        fetchMatches(); // Atualiza a lista
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Erro ao criar partida.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMatch = async (matchId) => {
    try {
      const data = await matchService.join(matchId, userEmail);
      if (data.success) {
        alert('Você entrou na mesa!');
        fetchMatches(); // Atualiza a lista para ver seu nome
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Erro ao entrar na partida.');
    }
  };

  const renderMatchCard = ({ item }) => {
    const isPlayerInMatch = item.players.includes(userEmail);

    return (
      <View style={styles.matchCard}>
        <View style={styles.matchInfo}>
          <Text style={styles.matchDate}>📅 {item.date}</Text>
          <Text style={styles.matchPlayers}>👥 {item.players.length} jogadores na mesa</Text>
          <Text style={styles.matchCreator}>Criado por: {item.creator}</Text>
        </View>
        
        {isPlayerInMatch ? (
          <View style={styles.joinedBadge}>
            <Text style={styles.joinedText}>Você está na mesa</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => handleJoinMatch(item.id)}
          >
            <Text style={styles.joinButtonText}>Entrar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      
      {/* SEÇÃO 1: CRIAR NOVA PARTIDA */}
      <View style={styles.section}>
        <Text style={styles.title}>Criar Nova Partida</Text>
        <Text style={styles.subtitle}>Agende o próximo jogo</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Data da Partida (Ex: 25/10/2026)</Text>
          <TextInput 
            style={styles.input}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={theme.colors.textMuted}
            value={date}
            onChangeText={setDate}
          />
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreateMatch}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Criando...' : 'Criar e Entrar na Mesa'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SEÇÃO 2: MESAS ABERTAS (LOBBY) */}
      <View style={[styles.section, { flex: 1 }]}>
        <View style={styles.lobbyHeader}>
          <Text style={styles.title}>Lobby</Text>
          <TouchableOpacity onPress={fetchMatches} style={styles.refreshButton}>
            <Text style={styles.refreshText}>🔄 Atualizar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Mesas aguardando jogadores</Text>

        {loadingMatches ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
        ) : matches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma partida aberta no momento.</Text>
          </View>
        ) : (
          <FlatList 
            data={matches}
            keyExtractor={item => item.id.toString()}
            renderItem={renderMatchCard}
            style={styles.list}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.large,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.large,
  },
  section: {
    flex: 1,
    minWidth: 300,
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
    marginBottom: theme.spacing.large,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.large,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
  lobbyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refreshButton: {
    padding: 8,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  refreshText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  emptyContainer: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.large,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  matchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  matchInfo: {
    flex: 1,
  },
  matchDate: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  matchPlayers: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: 2,
  },
  matchCreator: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  joinButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.small,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  joinedBadge: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: theme.borderRadius.small,
  },
  joinedText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  }
});
