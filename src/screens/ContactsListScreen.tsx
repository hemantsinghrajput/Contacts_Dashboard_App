import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { fetchContacts } from '../services/api';
import { Contact } from '../types/contact';
import ContactCard from '../components/ContactCard';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../theme/ThemeContext'; // <-- Add this

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContactsList'>;

const ContactsListScreen: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const { theme, colors, toggleTheme } = useTheme(); // <-- Theme hook

  const loadContacts = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    try {
      const data = await fetchContacts();
      setContacts(data);
      setFilteredContacts(data);
    } catch (error) {
      console.error('Failed to fetch contacts', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (contacts.length > 0) {
        loadContacts(true);
      }
    }, [contacts.length])
  );

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        `${contact.name.first} ${contact.name.last}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery, contacts]);

  const handleRefresh = () => {
    loadContacts(true);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Theme toggle */}
      <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
        <Text style={{ fontSize: 18 }}>{theme === 'light' ? '🌙' : '☀️'}</Text>
      </TouchableOpacity>

      <Text style={[styles.subtitle, { color: colors.subtext }]}>
        {filteredContacts.length} contacts
      </Text>

      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.subtext + '22' }]}>
        <Text style={[styles.searchIcon, { color: colors.subtext }]}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search contacts..."
          placeholderTextColor={colors.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
            <Text style={[styles.clearIcon, { color: colors.subtext }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.loaderCard, { backgroundColor: colors.card }]}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loaderText, { color: colors.subtext }]}>Loading contacts...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.backgroundGradient, { backgroundColor: colors.accent, opacity: 0.05 }]} />

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.login.uuid}
        ListHeaderComponent={renderHeader}
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
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};

export default ContactsListScreen;

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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    position: 'relative',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    fontWeight: '500',
  },
  themeButton: {
    position: 'absolute',
    right: 20,
    top: 16,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contactWrapper: {
    transform: [{ scale: 1 }],
  },
  separator: {
    height: 12,
  },
});
