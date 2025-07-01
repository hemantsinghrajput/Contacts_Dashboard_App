// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '../types/contact';

const FAVORITES_KEY = 'favorites';

export const getFavorites = async (): Promise<Contact[]> => {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : [];
};

export const isFavorite = async (uuid: string): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.some(contact => contact.login.uuid === uuid);
};

export const toggleFavorite = async (contact: Contact): Promise<boolean> => {
  const favorites = await getFavorites();
  const index = favorites.findIndex(c => c.login.uuid === contact.login.uuid);

  let updatedFavorites;
  let newState;

  if (index !== -1) {
    // Remove
    updatedFavorites = favorites.filter(c => c.login.uuid !== contact.login.uuid);
    newState = false;
  } else {
    // Add
    updatedFavorites = [...favorites, contact];
    newState = true;
  }

  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  return newState;
};
