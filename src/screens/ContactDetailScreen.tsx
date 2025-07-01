import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { Contact } from '../types/contact';
import { isFavorite, toggleFavorite } from '../utils/storage';
import { logFavoriteTimestamp } from '../utils/timestampTracker';
import { useTheme } from '../theme/ThemeContext'; // ✅ your custom theme context

type RouteParams = {
  ContactDetail: {
    contact: Contact;
  };
};

const ContactDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, 'ContactDetail'>>();
  const { contact } = route.params;
  const [favorite, setFavorite] = useState(false);
  const { theme, colors, toggleTheme } = useTheme(); // ✅

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

  const themedStyles = createStyles(colors);

  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.backgroundGradient} />

      <View style={themedStyles.profileCard}>
        {/* Theme toggle button */}
        <TouchableOpacity onPress={toggleTheme} style={themedStyles.themeToggle}>
          <Text style={themedStyles.toggleText}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </Text>
        </TouchableOpacity>

        {/* Avatar */}
        <View style={themedStyles.imageContainer}>
          <Image source={{ uri: contact.picture.large }} style={themedStyles.image} />
          <View style={themedStyles.imageGlow} />
        </View>

        {/* Name */}
        <Text style={themedStyles.name}>{`${contact.name.first} ${contact.name.last}`}</Text>

        {/* Info */}
        <View style={themedStyles.infoContainer}>
          <View style={themedStyles.infoCard}>
            <View style={themedStyles.iconContainer}>
              <Text style={themedStyles.icon}>✉️</Text>
            </View>
            <View style={themedStyles.infoTextContainer}>
              <Text style={themedStyles.infoLabel}>Email</Text>
              <Text style={themedStyles.infoText}>{contact.email}</Text>
            </View>
          </View>

          <View style={themedStyles.infoCard}>
            <View style={themedStyles.iconContainer}>
              <Text style={themedStyles.icon}>📞</Text>
            </View>
            <View style={themedStyles.infoTextContainer}>
              <Text style={themedStyles.infoLabel}>Phone</Text>
              <Text style={themedStyles.infoText}>{contact.phone}</Text>
            </View>
          </View>
        </View>

        {/* Favorite Button */}
        <TouchableOpacity
          style={[
            themedStyles.favoriteButton,
            favorite ? themedStyles.favoriteActive : themedStyles.favoriteInactive,
          ]}
          onPress={handleToggleFavorite}
          activeOpacity={0.8}
        >
          <Text style={themedStyles.favoriteIcon}>{favorite ? '❤️' : '🤍'}</Text>
          <Text
            style={[
              themedStyles.favoriteText,
              favorite ? themedStyles.favoriteTextActive : themedStyles.favoriteTextInactive,
            ]}
          >
            {favorite ? 'Remove from Favorites' : 'Mark as Favorite'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContactDetailScreen;

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    backgroundGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 300,
      backgroundColor: colors.primary,
      opacity: 0.1,
    },
    profileCard: {
      flex: 1,
      margin: 20,
      marginTop: 60,
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 32,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 8,
    },
    themeToggle: {
      position: 'absolute',
      right: 20,
      top: 20,
      zIndex: 1,
    },
    toggleText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.link,
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
      borderColor: colors.card,
    },
    imageGlow: {
      position: 'absolute',
      top: -4,
      left: -4,
      width: 128,
      height: 128,
      borderRadius: 64,
      backgroundColor: colors.primary,
      opacity: 0.1,
      zIndex: -1,
    },
    name: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 32,
      textAlign: 'center',
    },
    infoContainer: {
      width: '100%',
      marginBottom: 32,
    },
    infoCard: {
      flexDirection: 'row',
      backgroundColor: colors.input,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
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
      color: colors.subtext,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    infoText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
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
      backgroundColor: colors.input,
      borderColor: colors.border,
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
      color: colors.subtext,
    },
  });
