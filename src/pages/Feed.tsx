/* eslint-disable */
import React, {useEffect} from 'react';
import {View, ScrollView, Image ,Text, Button, StatusBar} from 'react-native';
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

      const postInitialize = async () => {
        if (socialProtocol === undefined) {
          return;
        }
        const myPosts: Post[] | undefined = await socialProtocol?.getAllPosts(33);
        setPosts(myPosts);
        console.log(myPosts)
      };
      try {
        console.log('Initializing posts');
        await postInitialize();
        console.log('Posts initialized');
      } catch (error) {
        console.log('Error initializing posts');
      } 
    };
    Initialize();
  }, [socialProtocol]);

  const backgroundStyle = ' h-screen w-screen ';
  return (
    <View className={backgroundStyle}>
      <View className = 'flex flex-row w-[100%] justify-center bg-[#f7f9ff]'>
        {/* <Text className = {`font-[Quicksand-Regular] text-4xl text-[#000000] mt-[8px] py-3 ml-6`}>Feed</Text> */}
        <Image className ='h-[40px] w-[140px] mt-[15px] mb-[10px]' source = {require('./SolSpaceLogo.png')} />
      </View>
      <ScrollView className = 'h-max w-[100%] bg-[#f7f9ff]'>
        {posts && posts.map((post) => <PostsDialog key={post.postId} post={post} socialProtocol={socialProtocol} navigation={props.navigation} />)}
      </ScrollView>
    </View>
  );
}

export default Feed;
