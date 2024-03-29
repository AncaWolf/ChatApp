import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
// importing Gifted Chat library
import { GiftedChat, Bubble } from "react-native-gifted-chat";
// importing functions from firebase/firestore
import { collection, getDocs, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";

const ChatScreen = ({ route, navigation, db }) => {
  const [messages, setMessages] = useState([]);
  const { name, background, userID } = route.params;

  const onSend = (newMessages) => {
    // saving messages on the Firestore database
    addDoc(collection(db, "messages"), newMessages[0])
    // setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  }

  // creating renderBubble function
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  // setter method of the messages state, setMessages() - removed at task 5.3
  useEffect(() => {
    // navigation.setOptions({ title: name });
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      })
      setMessages(newMessages);
    })
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, []);



  // rendering chat interface
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
        user={{
          _id: userID || '', // Using an empty string as fallback if userID is undefined or null
          name
        }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  }
});


export default ChatScreen;
