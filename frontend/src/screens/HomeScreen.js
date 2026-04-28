import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  useWindowDimensions,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../theme';

// Importando as views filhas
import NovaPartidaView from '../components/NovaPartidaView';
import RankingView from '../components/RankingView';
import JogadoresView from '../components/JogadoresView';
import PartidaDetalhesView from '../components/PartidaDetalhesView';

export default function HomeScreen({ userEmail, onLogout }) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const [activeTab, setActiveTab] = useState('partida'); // 'partida', 'ranking', 'jogadores'
  const [selectedMatchId, setSelectedMatchId] = useState(null);

  const renderContent = () => {
    if (selectedMatchId) {
      return (
        <PartidaDetalhesView 
          matchId={selectedMatchId} 
          userEmail={userEmail} 
          onBack={() => setSelectedMatchId(null)} 
        />
      );
    }

    switch(activeTab) {
      case 'partida': return <NovaPartidaView userEmail={userEmail} onSelectMatch={setSelectedMatchId} />;
      case 'ranking': return <RankingView />;
      case 'jogadores': return <JogadoresView />;
      default: return <NovaPartidaView userEmail={userEmail} onSelectMatch={setSelectedMatchId} />;
    }
  };

  const NavItem = ({ id, icon, label }) => {
    const isActive = activeTab === id;
    return (
      <TouchableOpacity 
        style={[styles.navItem, isActive && styles.navItemActive]}
        onPress={() => setActiveTab(id)}
      >
        <Text style={[styles.navItemText, isActive && styles.navItemTextActive]}>
          {icon} {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={[styles.layout, isLargeScreen ? styles.layoutRow : styles.layoutColumn]}>
        
        {/* SIDEBAR / NAVBAR */}
        <View style={[styles.sidebar, !isLargeScreen && styles.navbarMobile]}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.logo}>🃏 POKER</Text>
            {isLargeScreen && <Text style={styles.logoSub}>TERÇA</Text>}
          </View>

          <ScrollView 
            horizontal={!isLargeScreen} 
            showsHorizontalScrollIndicator={false}
            style={styles.navContainer}
            contentContainerStyle={!isLargeScreen && styles.navContainerMobile}
          >
            <NavItem id="partida" icon="♠️" label="Nova Partida" />
            <NavItem id="ranking" icon="🏆" label="Ranking" />
            <NavItem id="jogadores" icon="👥" label="Jogadores" />
          </ScrollView>

          {isLargeScreen && (
            <View style={styles.sidebarFooter}>
              <Text style={styles.userEmail}>{userEmail}</Text>
              <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
                <Text style={styles.logoutText}>Sair</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* MAIN CONTENT */}
        <View style={styles.mainContent}>
          {/* Header Mobile para o Logout */}
          {!isLargeScreen && (
            <View style={styles.mobileHeader}>
              <Text style={styles.userEmail}>{userEmail}</Text>
              <TouchableOpacity onPress={onLogout}>
                <Text style={styles.logoutText}>Sair</Text>
              </TouchableOpacity>
            </View>
          )}

          {renderContent()}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  layout: {
    flex: 1,
  },
  layoutRow: {
    flexDirection: 'row',
  },
  layoutColumn: {
    flexDirection: 'column',
  },
  sidebar: {
    backgroundColor: theme.colors.sidebarBackground,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  navbarMobile: {
    borderRightWidth: 0,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  sidebarHeader: {
    padding: theme.spacing.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: 1,
  },
  logoSub: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
  },
  navContainer: {
    flex: 1,
  },
  navContainerMobile: {
    paddingHorizontal: theme.spacing.medium,
    gap: 10,
  },
  navItem: {
    paddingVertical: 15,
    paddingHorizontal: theme.spacing.large,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: theme.borderRadius.medium,
  },
  navItemActive: {
    backgroundColor: theme.colors.primary,
  },
  navItemText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  navItemTextActive: {
    color: theme.colors.textPrimary,
  },
  sidebarFooter: {
    padding: theme.spacing.large,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },
  userEmail: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: 10,
  },
  logoutBtn: {
    padding: 10,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.small,
    alignItems: 'center',
  },
  logoutText: {
    color: theme.colors.error,
    fontWeight: 'bold',
  },
  mobileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.cardBackground,
  },
  mainContent: {
    flex: 1,
    backgroundColor: theme.colors.background,
  }
});

