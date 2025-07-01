import { Contact } from './contact';

export type RootStackParamList = {
  ContactsList: undefined;
  ContactDetail: { contact: Contact };
};
