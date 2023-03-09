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
          component={FeedScreen}
          //options={{title: 'Welcome'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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

const ProfileScreen = ({navigation,route} : any) => {
  return (
    <SafeAreaView className = 'h-[100%] w-[100%] overflow-y'>
      <View>
        <Text>{route.params.name}</Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
