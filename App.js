import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import {store} from './src/app/store'
import  {Provider} from 'react-redux'
import QRScannerScreen from './screens/QRScannerScreen';
import LocationScreen from './screens/LocationScreen';
import CameraScreen from './screens/CameraScreen';
import StopWatchScreen from './screens/StopWatchScreen';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <Provider store={store}>
     
     <NavigationContainer style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          // options={{title: 'Welcome',headerShown:false}}
          options={{title:'Welcome'}}

        />
        <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title:'HomeScreen'}}
        />
        


        <Stack.Screen
        name="Code"
        component={QRScannerScreen}
        />
        <Stack.Screen
        name="Location"
        component={LocationScreen}
        />
        <Stack.Screen
        name="Camera"
        component={CameraScreen}
        />
        <Stack.Screen
        name="Watch"
        component={StopWatchScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
