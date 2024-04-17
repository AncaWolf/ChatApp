import React, { useEffect } from 'react';
import { StyleSheet, LogBox, Alert, View } from 'react-native';
import StartScreen from './components/Start';
import ChatScreen from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);
const firebaseConfig = {
    apiKey: "AIzaSyD2ygK_X_yB6298_cLTBJW0gd4Lzsfnk3I",
    authDomain: "chatapp-c7b1c.firebaseapp.com",
    projectId: "chatapp-c7b1c",
    storageBucket: "chatapp-c7b1c.appspot.com",
    messagingSenderId: "216238916614",
    appId: "1:216238916614:web:0059b4da4665bb99b3af87"
};
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);
const storage = getStorage(app);
const Stack = createNativeStackNavigator();
const App = () => {
    const connectionStatus = useNetInfo();
    useEffect(() => {
        if (!connectionStatus.isConnected) {
            Alert.alert("No network connection!");
            disableNetwork(db);
        } else {
            enableNetwork(db);
        }
    }, [connectionStatus.isConnected]);
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Start">
                <Stack.Screen name="Start" component={StartScreen} />
                <Stack.Screen name="Chat">
                    {props => <ChatScreen isConnected={connectionStatus.isConnected} db={db} storage={storage} {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
