/* eslint-disable */
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
import Feed from './src/pages/Feed';
import PostPage from './src/pages/PostPage';
import Trending from './src/pages/Trending';
import ConnectPage from './src/pages/ConnectPage';

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
          name="Connect"
          component={ConnectScreen}
        />
        <Stack.Screen
          name="SolSpace"
          component={FeedScreen}
          //options={{title: 'Welcome'}}
        />
        <Stack.Screen 
          name="Post"
          component={PostScreen}
        />
        <Stack.Screen 
          name="Trending"
          component={TrendingScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const ConnectScreen = ({navigation} : any) => {
  const currentNavigation = useNavigation();

  useLayoutEffect(()=>{
    currentNavigation.setOptions({headerShown : false})
  },[currentNavigation]);

  return (
    <SafeAreaView>
      <ConnectPage navigation={navigation} />
    </SafeAreaView>
  );
};

const FeedScreen = ({navigation} : any) => {
  const currentNavigation = useNavigation();

  useLayoutEffect(()=>{
    currentNavigation.setOptions({headerShown : false})
  },[currentNavigation]);

  return (
    <SafeAreaView>
      <Feed navigation={navigation} />
    </SafeAreaView>
  );
};

const PostScreen = ({navigation,route} : any) => {
  const currentNavigation = useNavigation();

  useLayoutEffect(()=>{
    currentNavigation.setOptions({headerShown : false})
  },[currentNavigation]);

  return (
    <SafeAreaView>
      <PostPage navigation={navigation} post={route.params.post} />
    </SafeAreaView>
  );
}

const TrendingScreen = ({navigation} : any) => {
  const currentNavigation = useNavigation();

  useLayoutEffect(()=>{
    currentNavigation.setOptions({headerShown : false})
  },[currentNavigation]);

  return (
    <SafeAreaView>
      <Trending navigation={navigation} />
    </SafeAreaView>
  );
};

export default App;
