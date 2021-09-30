/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  LogBox,
  StatusBar,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './screens/MainScreen';
import FolderData from './screens/FolderData';
import SplashScreen from './screens/SplashScreen';
import SignUpScreen from './screens/registeration/Signup';
import AsyncStorage from '@react-native-community/async-storage';
<StatusBar backgroundColor={Colors.secondry} barStyle="light-content" />
import SignInScreen from './screens/registeration/Login';
import { Colors } from './utills/Colors';
//console.disableYellowBox = true;

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();


function splashScreen({ navigation }) {
  setTimeout(() => {
    AsyncStorage.multiGet(['user_name', 'user_token']).then((data) => {
      let user_name = data[0][1];
      let user_token = data[1][1];
      console.log("User name :", user_name);
      console.log("User Token :", user_token);
      if (!user_token) {
        navigation.navigate('SignInScreen');
      } else {
          navigation.navigate('Home');
      }

      //Your logic
  });

     
             
         

  }, 2100);
  return <SplashScreen />;
}

const App = ({navigation}) => {

 
  return (
    
    <NavigationContainer>
       <StatusBar backgroundColor={Colors.white} barStyle="light-content" />
      <Stack.Navigator>
      <Stack.Screen
                        name="splashScreen"
                        component={splashScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name="SignInScreen" component={SignInScreen}  
        options={{
          headerShown: false,
        }}/>

<Stack.Screen name="Signup" component={SignUpScreen}  
        options={{
          headerShown: false,
        }}/>



        <Stack.Screen name="Home" component={MainScreen}  
        options={{
          headerShown: false,
        }}/>
        
        <Stack.Screen name="StoreUrl" component={FolderData} 
         options={{
          headerShown: false,
        }}
        />
     
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;
