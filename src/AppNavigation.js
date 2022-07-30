import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ReaderScreen from './screens/ReaderScreen';
import Onboarding from './screens/Onboarding';
import Statistics from './screens/Statistics';
import SplashScreen from './screens/SplashScreen';

const Stack = createStackNavigator();

function AppNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="Library"
        component={HomeScreen}
        options={{headerLeft: () => null, gestureEnabled: false}}
      />
      <Stack.Screen
        name="Reader"
        component={ReaderScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen name="Statistics" component={Statistics} />
      <Stack.Screen
        name="Onboarder"
        component={Onboarding}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default AppNavigation;
