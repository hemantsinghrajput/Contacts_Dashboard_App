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

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContactsList'>;

const ContactsListScreen: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const loadContacts = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);
    
    try {
      const data = await fetchContacts();
      setContacts(data);
      setFilteredContacts(data);
    } catch (error) {
      console.error('Failed to fetch contacts', error);
      // You might want to show an error alert here
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load contacts on initial mount
  useEffect(() => {
    loadContacts();
  }, []);

  // Refresh contacts when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Only refresh if we already have data to avoid double loading
      if (contacts.length > 0) {
        loadContacts(true);
      }
    }, [contacts.length])
  );

  // Filter contacts based on search query
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
      <Text style={styles.subtitle}>{filteredContacts.length} contacts</Text>
      
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <View style={styles.loaderCard}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loaderText}>Loading contacts...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundGradient} />

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
    backgroundColor: '#f8fafc',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#667eea',
    opacity: 0.05,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loaderCard: {
    backgroundColor: '#ffffff',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    color: '#374151',
  },
  clearButton: {
    padding: 8,
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 14,
    color: '#9ca3af',
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