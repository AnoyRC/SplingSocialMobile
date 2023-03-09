/* eslint-disable */
import React, {useEffect} from 'react';
import {View, ScrollView, Text, Button, StatusBar} from 'react-native';
import {SocialProtocol} from '@spling/social-protocol';
import {Keypair} from '@solana/web3.js';
import {Post, ProtocolOptions} from '@spling/social-protocol/dist/types';
import PostsDialog from '../components/post';

const options = {
  rpcUrl:
    'https://rpc.helius.xyz/?api-key=002d43b6-4f76-47c2-b4e1-9c87c9a6e3d2',
  useIndexer: true,
} as ProtocolOptions;

type FeedProps = {
  navigation: any;
}

function Feed(props : FeedProps): JSX.Element {
  const [socialProtocol, setSocialProtocol] = React.useState<SocialProtocol>();
  const [posts, setPosts] = React.useState<Post[]>();

  useEffect(() => {
    const keypair = Keypair.generate();
    const Initialize = async () => {
      if (socialProtocol === undefined) {
        const socialProtocol: SocialProtocol = await new SocialProtocol(
          keypair,
          null,
          options,
        ).init();
        setSocialProtocol(socialProtocol);
      }
    };

    const postInitialize = async () => {
      if (socialProtocol === undefined) {
        return;
      }
      const posts: Post[] | undefined = await socialProtocol?.getAllPosts(33);
      setPosts(posts);
    };
    Initialize();
    postInitialize();
  }, [socialProtocol]);

  const backgroundStyle = ' h-screen w-screen';
  return (
    <ScrollView className={backgroundStyle}>
      <View className = ''>
        <Text className = {`font-[Quicksand-Regular] text-4xl text-[#000000] m-[${StatusBar.currentHeight}] py-3 ml-6`}>Feed</Text>
      </View>
      <ScrollView className = 'h-fit w-[100%]'>
        {posts && posts.map((post) => <PostsDialog key={post.postId} post={post} socialProtocol={socialProtocol} navigation={props.navigation} />)}
      </ScrollView>
    </ScrollView>
  );
}

export default Feed;
