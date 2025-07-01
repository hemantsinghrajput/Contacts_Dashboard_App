import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { Contact } from '../types/contact';
import { isFavorite, toggleFavorite } from '../utils/storage';
import { logFavoriteTimestamp } from '../utils/timestampTracker';

const { width } = Dimensions.get('window');

type RouteParams = {
  ContactDetail: {
    contact: Contact;
  };
};

const ContactDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, 'ContactDetail'>>();
  const { contact } = route.params;
  const [favorite, setFavorite] = useState(false);

  useFocusEffect(
  useCallback(() => {
    const checkFavorite = async () => {
      const fav = await isFavorite(contact.login.uuid);
      setFavorite(fav);
    };
    checkFavorite();
  }, [contact])
);


  const handleToggleFavorite = async () => {
    const result = await toggleFavorite(contact);
    setFavorite(result);
    if (result) {
      await logFavoriteTimestamp();
      Alert.alert('Added to Favorites');
    } else {
      Alert.alert('Removed from Favorites');
    }
  };

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Header card */}
      <View style={styles.profileCard}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: contact.picture.large }} style={styles.image} />
          <View style={styles.imageGlow} />
        </View>
        
        <Text style={styles.name}>{`${contact.name.first} ${contact.name.last}`}</Text>
        
        {/* Contact info cards */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>✉️</Text>
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoText}>{contact.email}</Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📞</Text>
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoText}>{contact.phone}</Text>
            </View>
          </View>
        </View>

        {/* Favorite button */}
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            favorite ? styles.favoriteActive : styles.favoriteInactive
          ]}
          onPress={handleToggleFavorite}
          activeOpacity={0.8}
        >
          <Text style={styles.favoriteIcon}>
            {favorite ? '❤️' : '🤍'}
          </Text>
          <Text style={[
            styles.favoriteText,
            favorite ? styles.favoriteTextActive : styles.favoriteTextInactive
          ]}>
            {favorite ? 'Remove from Favorites' : 'Mark as Favorite'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContactDetailScreen;

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
    height: 300,
    backgroundColor: '#667eea',
    opacity: 0.1,
  },
  profileCard: {
    flex: 1,
    margin: 20,
    marginTop: 60,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  imageGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#667eea',
    opacity: 0.1,
    zIndex: -1,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: 32,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 32,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#f7fafc',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 20,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3748',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    borderWidth: 2,
  },
  favoriteActive: {
    backgroundColor: '#fed7d7',
    borderColor: '#fc8181',
  },
  favoriteInactive: {
    backgroundColor: '#f7fafc',
    borderColor: '#e2e8f0',
  },
  favoriteIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  favoriteText: {
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteTextActive: {
    color: '#e53e3e',
  },
  favoriteTextInactive: {
    color: '#4a5568',
  },
});