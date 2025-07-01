import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Contact } from '../types/contact';
import { useTheme } from '../theme/ThemeContext'; // ← your custom theme hook

interface Props {
  contact: Contact;
}

const ContactCard: React.FC<Props> = ({ contact }) => {
  const { theme, colors, toggleTheme } = useTheme(); // ← get theme and toggle
  const { name, email, picture } = contact;

  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      {/* Avatar */}
      <Image source={{ uri: picture.thumbnail }} style={styles.image} />

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{`${name.first} ${name.last}`}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
    </View>
  );
};

export default ContactCard;

// Styles generated based on theme colors
const createStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      marginHorizontal: 16,
      marginVertical: 8,
      backgroundColor: colors.card,
      borderRadius: 10,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    info: {
      marginLeft: 12,
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    email: {
      fontSize: 14,
      color: colors.subtext,
    },
    themeButton: {
      padding: 6,
      borderRadius: 6,
    },
    themeIcon: {
      fontSize: 20,
    },
  });
