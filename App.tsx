/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {SafeAreaView, Text , Button} from 'react-native';
import { SocialProtocol } from "@spling/social-protocol";
import {Keypair} from '@solana/web3.js';
import { Post, ProtocolOptions } from '@spling/social-protocol/dist/types';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const options = {
  rpcUrl:
    'https://rpc.helius.xyz/?api-key=002d43b6-4f76-47c2-b4e1-9c87c9a6e3d2',
  useIndexer: true,
} as ProtocolOptions;

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          //options={{title: 'Welcome'}}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({navigation}) => {
  const [socialProtocol, setSocialProtocol] = React.useState<SocialProtocol>();
  const [posts, setPosts] = React.useState<Post[]>();

  useEffect(() => {
    const keypair = Keypair.generate();
    const Initialize = async () => {
      if(socialProtocol === undefined){
        const socialProtocol : SocialProtocol = await new SocialProtocol(keypair, null, options).init();
        setSocialProtocol(socialProtocol);
      }
    }

    const postInitialize = async () => {
      if(socialProtocol === undefined) {return;}
      const posts : Post[] | undefined = await socialProtocol?.getAllPosts(33);
      setPosts(posts);
    };
    Initialize();
    postInitialize();
  },[socialProtocol]);

  const backgroundStyle = "bg-[#F8FFE9] h-screen w-screen"
  return (
      <SafeAreaView className={backgroundStyle}>
        {posts && posts.map((post) => {
          return (
            <Text className={`font-[Quicksand-Medium]`} key={post.postId}>{post.text}</Text>
          );
        })}
        <Button
        title="Go to Jane's profile"
        onPress={() =>
        navigation.navigate('Profile', {name: 'Jane'})
        }
        />
      </SafeAreaView>
  );
};
const ProfileScreen = ({navigation, route}) => {
  return <Text>This is {route.params.name}'s profile</Text>;
};

export default App;
