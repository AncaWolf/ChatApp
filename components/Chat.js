import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';

const ChatScreen = ({ route, navigation, db, isConnected }) => {
  const [messages, setMessages] = useState([]);
  const { name, background, userID } = route.params;

  const onSend = (newMessages) => {
    // saving messages on the Firestore database
    addDoc(collection(db, "messages"), newMessages[0])
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

  // preventing rendering toolbar for new messages
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  }

  const cacheMessageHistory = async (listsToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(listsToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("messages") || '[]';
    setMessages(JSON.parse(cachedMessages));
  };

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  let unsubMessages;
  useEffect(() => {
    // Always load cached messages when the component mounts
    loadCachedMessages();
    // navigation.setOptions({ title: name });

    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when useEffect code is re-executed.
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach(doc => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis())
          })
        });
        cacheMessageHistory(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]);

  //added function for circle button
  const renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  // rendering chat interface
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions} //added prop for accessory bar
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
