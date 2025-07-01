// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactsListScreen from './src/screens/ContactsListScreen';
import ContactDetailScreen from './src/screens/ContactDetailScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import StatsScreen from './src/screens/StatsScreen';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ContactsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ContactsList" component={ContactsListScreen} options={{ title: 'Contacts' }} />
      <Stack.Screen name="ContactDetail" component={ContactDetailScreen} options={{ title: 'Contact Details' }} />
    </Stack.Navigator>
  );
}

export default function App() {

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === 'Contacts') iconName = 'people-outline';
              else if (route.name === 'Favorites') iconName = 'star-outline';
              else iconName = 'bar-chart-outline';

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            headerShown: false,
          })}
        >
        <Tab.Screen name="Contacts" component={ContactsStack} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
