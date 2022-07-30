// libs
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import codePush from 'react-native-code-push';
// internal imports
import {persistor, store} from './redux/store';
import AppNavigation from './AppNavigation';

const Stack = createStackNavigator();
let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_START};
function App() {
  useEffect(() => {
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE,
    });
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="AppNavigator"
              component={AppNavigation}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default codePush(codePushOptions)(App);
