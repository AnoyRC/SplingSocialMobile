/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import { SocialProtocol } from "@spling/social-protocol";
import {Keypair} from '@solana/web3.js';
import { Post, ProtocolOptions } from '@spling/social-protocol/dist/types';


const options = {
  rpcUrl:
    'https://rpc.helius.xyz/?api-key=002d43b6-4f76-47c2-b4e1-9c87c9a6e3d2',
  useIndexer: true,
} as ProtocolOptions;


function App(): JSX.Element {
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

  return (
    <SafeAreaView style={styles.sectionContainer}>
      {posts && posts.map((post, index) => {
        return (
          <Text key={index}>{post.text}</Text>
        );
      })}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
