import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import screens
import StartScreen from './components/Start';
import ChatScreen from './components/Chat';
// import React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// importing Firestore database
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// added AsyncStorage to prevent Terminal error - code provided by Terminal(not working properly)
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });

// add LogBox to prevent AsyncStorage warning message
// import { LogBox } from 'react-native';
// LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

// Create the navigator
const Stack = createNativeStackNavigator();


const App = () => {

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD2ygK_X_yB6298_cLTBJW0gd4Lzsfnk3I",
    authDomain: "chatapp-c7b1c.firebaseapp.com",
    projectId: "chatapp-c7b1c",
    storageBucket: "chatapp-c7b1c.appspot.com",
    messagingSenderId: "216238916614",
    appId: "1:216238916614:web:0059b4da4665bb99b3af87"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Chat">
          {props => <ChatScreen db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
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

export default App;
