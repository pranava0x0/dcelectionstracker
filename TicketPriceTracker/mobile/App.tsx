import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from './src/screens/DashboardScreen';
import PlatformDetailScreen from './src/screens/PlatformDetailScreen';
import AddEventScreen from './src/screens/AddEventScreen';
import PriceHistoryScreen from './src/screens/PriceHistoryScreen';
import { COLORS } from './src/constants/theme';
import type { RootStackParamList } from './src/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.bg },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: COLORS.bg },
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'TicketTracker' }}
        />
        <Stack.Screen
          name="PlatformDetail"
          component={PlatformDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PriceHistory"
          component={PriceHistoryScreen}
          options={{ title: 'Price History' }}
        />
        <Stack.Screen
          name="AddEvent"
          component={AddEventScreen}
          options={{ title: 'Add Event' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
