import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system';

import { Contact } from '../types/contact';
import { getFavorites } from '../utils/storage';
import ContactCard from '../components/ContactCard';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../theme/ThemeContext'; // <-- theme hook

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContactsList'>;

const FavoritesScreen: React.FC = () => {
  const [favorites, setFavorites] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { theme, colors, toggleTheme } = useTheme(); // <-- useTheme

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const exportFavorites = async () => {
    if (favorites.length === 0) {
      Alert.alert('No Favorites', 'Add some contacts to favorites first!');
      return;
    }

    try {
      const fileUri = `${FileSystem.documentDirectory}favorites.json`;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(favorites, null, 2));
      Alert.alert(
        'Export Successful! 🎉',
        `Your ${favorites.length} favorite contacts have been exported to:\n${fileUri}`,
        [{ text: 'Great!', style: 'default' }]
      );
    } catch (err) {
      Alert.alert('Export Failed', 'Something went wrong while exporting your favorites.');
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={[styles.title, { color: colors.text }]}>❤️ Favorites</Text>
      <Text style={[styles.subtitle, { color: colors.subtext }]}>
        {favorites.length === 0
          ? 'No favorite contacts yet'
          : `${favorites.length} favorite contact${favorites.length === 1 ? '' : 's'}`}
      </Text>

      <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
        <Text style={{ fontSize: 18 }}>
          {theme === 'light' ? '🌙' : '☀️'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={[styles.emptyStateCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.emptyStateIcon, { color: colors.text }]}>💫</Text>
        <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Favorites Yet</Text>
        <Text style={[styles.emptyStateText, { color: colors.subtext }]}>
          Start adding contacts to your favorites by tapping the heart icon on any contact.
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (favorites.length === 0) return null;

    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: colors.accent }]}
          onPress={exportFavorites}
          activeOpacity={0.8}
        >
          <Text style={styles.exportIcon}>📁</Text>
          <Text style={styles.exportButtonText}>Export Favorites</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.backgroundGradient, { backgroundColor: colors.accent, opacity: 0.05 }]} />

      {favorites.length === 0 ? (
        <View style={styles.contentContainer}>
          {renderHeader()}
          {renderEmptyState()}
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.login.uuid}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.contactWrapper}
              onPress={() => navigation.navigate('ContactDetail', { contact: item })}
              activeOpacity={0.7}
            >
              <ContactCard contact={item} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    position: 'relative',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  themeToggle: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  contactWrapper: {
    transform: [{ scale: 1 }],
  },
  separator: {
    height: 12,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateCard: {
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    elevation: 8,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footerContainer: {
    paddingTop: 24,
    paddingBottom: 20,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    elevation: 6,
  },
  exportIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  exportButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
