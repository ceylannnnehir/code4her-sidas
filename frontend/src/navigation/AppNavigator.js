import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../config/theme';

// Import screens
import WelcomeScreen from '../screens/WelcomeScreen';
import TriageScreen from '../screens/TriageScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import EvidenceChecklistScreen from '../screens/EvidenceChecklistScreen';
import GuideScreen from '../screens/GuideScreen';
import HomeScreen from '../screens/HomeScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import SupportMapScreen from '../screens/SupportMapScreen';
import AIAssistantScreen from '../screens/AIAssistantScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.light.background,
          },
          headerTintColor: theme.light.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerBackTitle: 'Geri',
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Triage"
          component={TriageScreen}
          options={{
            title: 'Durum Değerlendirmesi',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="Emergency"
          component={EmergencyScreen}
          options={{
            title: 'Acil Durum',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="EvidenceChecklist"
          component={EvidenceChecklistScreen}
          options={{
            title: 'Kanıt Toplama',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="Guide"
          component={GuideScreen}
          options={{
            title: 'Adım Adım Rehber',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Ana Sayfa',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="Privacy"
          component={PrivacyScreen}
          options={{
            title: 'Gizlilik',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="SupportMap"
          component={SupportMapScreen}
          options={{
            title: 'Destek Noktaları',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="AIAssistant"
          component={AIAssistantScreen}
          options={{
            title: 'AI Asistan',
            headerShown: true
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
