import { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, Button, TextInput, TouchableOpacity, Platform, Alert, KeyboardAvoidingView } from 'react-native';
// importing firebase/auth package
import { getAuth, signInAnonymously } from "firebase/auth"

const StartScreen = ({ navigation }) => {
  const auth = getAuth();
  const [name, setName] = useState('');
  const [background, setBackground] = useState('');
  const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate("Chat", { name: name, background: background, userID: result.user.uid });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try again later.");
      })
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/BackgroundImage.png')} style={styles.bgImage} resizeMode="cover">
        <Text style={styles.appTitle}>React Chat App</Text>
        {/* Username input */}
        <View style={styles.box}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder='Your name here'
          />
          {/* Choose chat background color */}
          <Text style={styles.chooseBackgroundColor}>Choose Background Color</Text>
          <View style={styles.colorButtonsBox}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.colorButton, { backgroundColor: color }, background === color && styles.selected]}
                onPress={() => setBackground(color)}
              />
            ))}
          </View>
          {/* Navigating to Chat screen \*/}
          <TouchableOpacity
            style={styles.button} onPress={signInUser}
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
        {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#ffffff',
    margin: 20
  },
  box: {
    backgroundColor: '#ffffff',
    padding: 30,
    width: '88%',
    height: '44%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    width: '88%',
    opacity: 50,
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    borderColor: '#757083'
  },
  chooseBackgroundColor: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },
  colorButtonsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5
  },
  selected: {
    borderColor: 'black',
    borderWidth: 1
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#757083',
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff'
  }
});

export default StartScreen;
