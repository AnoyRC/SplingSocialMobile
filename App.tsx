/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect , useLayoutEffect } from 'react';
import {SafeAreaView, View, ScrollView, Text , Button} from 'react-native';
import { SocialProtocol } from "@spling/social-protocol";
import {Keypair} from '@solana/web3.js';
import { Post, ProtocolOptions } from '@spling/social-protocol/dist/types';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
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
          name="SolSpace"
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
  const currentNavigation = useNavigation();

  useLayoutEffect(()=>{
    currentNavigation.setOptions({headerShown : false})
  },[])

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

  const backgroundStyle = "bg-[#F8FFE9] h-fit w-screen overflow-y"
  return (
      <ScrollView className={backgroundStyle}>
        {posts && posts.map((post) => {
          return (
            <View  key={post.postId}>
              <Text className={`font-[Quicksand-Bold] p-2`}>{post.title}</Text>
              <Text className={`font-[Quicksand-Medium] p-2`}>{post.text}</Text>
            </View>
          );
        })}
        <Button
        title="Go to Jane's profile"
        onPress={() =>
        navigation.navigate('Profile', {name: 'Jane'})
        }
        />
      </ScrollView>
  );
};
const ProfileScreen = ({navigation, route}) => {
  return <Text>This is {route.params.name}'s profile</Text>;
};

export default App;
