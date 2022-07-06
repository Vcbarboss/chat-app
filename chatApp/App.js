import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text, TouchableOpacity, View} from 'react-native';
import {useChatClient} from './src/hooks/useChatClient';
import {
    Chat,
    OverlayProvider,
    ChannelList,
    Channel,
    MessageList,
    MessageInput, Colors,
} from 'stream-chat-react-native';
import {StreamChat} from 'stream-chat';
import {chatApiKey, chatUserId, chatUserName, chatUserToken} from './src/helper/chatConfig';
import {InputBox} from './src/components/inputBox';
import {VoiceMessageAttachment} from './src/components/voiceMessageAttachment';
import {ListPreviewMessage} from './src/components/listPreviewMessage';
import Field from "./src/components/inputBox2";

const Stack = createStackNavigator();

let userID = ''

const filters = {
  members: {
    '$in': [userID]
  },
};

const sort = {
  last_message_at: -1,
};

const chatClient = StreamChat.getInstance(chatApiKey);




const LoginScreen = props => {

    const [username, setUsername] = useState("")
    const [name, setName] = useState()
    const { navigation } = props;


    const login = async () => {
        // await chatClient
        // .disconnectUser()
        console.log('entrou')
        let id = username.replace(' ', '-')
        // id = 'bulbasaur'
        try {
            userID = id
            await chatClient.connectUser(
                {
                    id: id,
                    name: username,
                    image: `https://getstream.io/random_svg/?name=${id}`,
                },
                chatClient.devToken(id)
                // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYnVsYmFzYXVyIn0.atnXXTbJ0IP9LvEkH8H9zlbmDodLPJoE7buXxFkSu5c'
                ,
            );
            console.log('oks')
            navigation.navigate('ChannelListScreen')
        } catch (error) {
            if (error instanceof Error) {
                console.error(`An error occurred while connecting the user: ${error.message}`)
            }
        }
    }

    return(
            <View style={{backgroundColor: 'white', flex: 1, padding: 20}}>
                <View>
                    <Text
                        style={{
                            fontSize: 30,
                            color: Colors.primary,
                            fontWeight: 'bold',
                            marginBottom: 20,
                        }}>
                        Entrar
                    </Text>
                </View>
                <Field
                    placeholder="username"
                    label={'Username'}
                    value={username}
                    change={(e) => setUsername(e)}
                />

                <TouchableOpacity onPress={() => login()}>
                    <Text>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginTop: 150}} onPress={() => chatClient.disconnectUser()}>
                    <Text>Desconectar</Text>
                </TouchableOpacity>
            </View>
    )
}

const ChannelScreen = props => {
    const { route } = props;
    const { params: { channel } } = route;

    return (
        <Channel
            channel={channel}
            Input={InputBox}
            Card={VoiceMessageAttachment}>
            <MessageList />
            <MessageInput />
        </Channel>
    );
}

const ChannelListScreen = props => {

    return (
        <ChannelList
            onSelect={(channel) => {
                const { navigation } = props;
                navigation.navigate('ChannelScreen', { channel });
            }}
            PreviewMessage={ListPreviewMessage}
            filters={filters}
            sort={sort}
        />
    );
};


const NavigationStack = () => {
  // const {clientIsReady} = useChatClient();

  // if (!clientIsReady) {
  //   return <Text>Loading chat ...</Text>
  // }
  return (
      <OverlayProvider>
        <Chat client={chatClient}>
          <Stack.Navigator>
              <Stack.Screen name="ChannelLoginScreen" component={LoginScreen} />
              <Stack.Screen name="ChannelListScreen" component={ChannelListScreen} />
              <Stack.Screen name="ChannelScreen" component={ChannelScreen} />
          </Stack.Navigator>
        </Chat>
      </OverlayProvider>
  );
};

export default () => {
  return (
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer>
          <NavigationStack/>
        </NavigationContainer>
      </SafeAreaView>
  );
};
