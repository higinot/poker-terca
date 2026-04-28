import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function JogadoresView() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogadores</Text>
      <Text style={styles.subtitle}>Em breve...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 10,
  }
});
