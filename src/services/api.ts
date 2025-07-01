import { Contact } from '../types/contact';

export const fetchContacts = async (): Promise<Contact[]> => {
  try {
    const res = await fetch('https://randomuser.me/api/?results=10');
    const json = await res.json();
    console.log(json);
    return json.results as Contact[];
  } catch (error) {
    console.error('Failed to fetch contacts', error);
    return [];
  }
};
