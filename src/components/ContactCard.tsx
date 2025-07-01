import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Contact } from '../types/contact';

interface Props {
  contact: Contact;
}

const ContactCard: React.FC<Props> = ({ contact }) => {
  const { name, email, picture } = contact;
  return (
    <View style={styles.card}>
      <Image source={{ uri: picture.thumbnail }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{`${name.first} ${name.last}`}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
    </View>
  );
};

export default ContactCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    elevation: 1,
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
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
});
