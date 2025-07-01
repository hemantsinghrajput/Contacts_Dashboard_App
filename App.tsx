// App.tsx
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactsListScreen from './src/screens/ContactsListScreen';
import ContactDetailScreen from './src/screens/ContactDetailScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import StatsScreen from './src/screens/StatsScreen';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ContactsStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ContactsList"
        component={ContactsListScreen}
        options={{
          title: 'Contacts',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '700',
            fontSize: 20,
          },
        }}
      />
      <Stack.Screen
        name="ContactDetail"
        component={ContactDetailScreen}
        options={{
          title: 'Contact Details',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '700',
            fontSize: 20,
          },
          headerTintColor: colors.text,
        }}
      />
    </Stack.Navigator>
  );
}

function ThemedApp() {
  const { theme, colors } = useTheme();

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
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
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.subtext,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border || '#ccc',
          },
        })}
      >
        <Tab.Screen name="Contacts" component={ContactsStack} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}
