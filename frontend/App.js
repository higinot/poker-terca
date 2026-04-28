import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const { width } = useWindowDimensions();
  const [status, setStatus] = useState('Conectando ao backend...');

  // Simulando busca no backend
  useEffect(() => {
    fetch('http://localhost:5000/api/status')
      .then(res => res.json())
      .then(data => setStatus(data.message))
      .catch(err => setStatus('Erro ao conectar com o backend ❌'));
  }, []);

  const isLargeScreen = width > 768;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={[styles.content, isLargeScreen && styles.contentDesktop]}>
        
        <View style={styles.header}>
          <Text style={styles.title}>🃏 Poker Terça</Text>
          <Text style={styles.subtitle}>Gerenciador de Rodadas</Text>
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
    backgroundColor: '#1a1a1a',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  contentDesktop: {
    paddingHorizontal: '10%',
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
  },
  card: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  statusText: {
    color: '#4caf50',
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
    backgroundColor: '#b71c1c',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
