/* eslint-disable */
import React, {useEffect} from 'react';
import {View, ScrollView, Image ,Text, Button, StatusBar, TouchableOpacity} from 'react-native';
import {SocialProtocol} from '@spling/social-protocol';
import {Keypair} from '@solana/web3.js';
import {Post, ProtocolOptions} from '@spling/social-protocol/dist/types';
import TrendingDialog from '../components/trendingPost';
import CustomIcon from '../components/CustomIcon';

const options = {
  rpcUrl:
    'https://rpc.helius.xyz/?api-key=002d43b6-4f76-47c2-b4e1-9c87c9a6e3d2',
  useIndexer: true,
} as ProtocolOptions;

type FeedProps = {
  navigation: any;
}

function Trending(props : FeedProps): JSX.Element {
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
        const sortedPosts = myPosts.sort((a, b) => b.likes.length - a.likes.length);
        setPosts(sortedPosts);
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

  const backgroundStyle = ' h-screen w-screen bg-[#f7f9ff]';
  return (
    <View className={backgroundStyle}>
      <View className = 'flex flex-row w-[100%] justify-center bg-[#ffffff] border-[#000000] border-[1px] rounded-b-2xl'>
        <Text className = {`font-[Quicksand-SemiBold] text-4xl text-[#000000] mt-[8px] py-3 `}>#Trending</Text>
        {/* <Image className ='h-[40px] w-[140px] mt-[15px] mb-[10px]' source = {require('./SolSpaceLogo.png')} /> */}
      </View>
      <ScrollView className = 'h-[80vh] w-[100%] content-center bg-[#f7f9ff]'>
        {posts && posts.map((post,index) => <TrendingDialog key={post.postId} post={post} socialProtocol={socialProtocol} navigation={props.navigation} index={index}/>)}
      </ScrollView>
      <View className='bg-[#000000] w-[100%] h-[10vh] rounded-t-2xl'>
        <View className='flex flex-row justify-between items-center flex-grow pr-14 pl-6'>
          <View className = 'flex flex-row items-center justify-center h-fit py-3 px-8 rounded-full w-fit bg-[#ffffff]'>
            <CustomIcon name = 'FeaturedActiveIcon' size={30} className='text-[#000000] text-center text-2xl shadow-2xl'/>
          </View>
          <TouchableOpacity className='mr-9' onPress={()=>{props.navigation.navigate('SolSpace')}}>
            <CustomIcon name = 'FeedIcon' size={30} className='text-[#ffffff] text-center text-2xl'/>
          </TouchableOpacity>
          <TouchableOpacity>
            <CustomIcon name = 'ProfileIcon' size={30} className='text-[#ffffff] text-center text-2xl'/>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity className='flex flex-row absolute items-center justify-center h-fit w-fit p-4 px-5 mt-[81vh] ml-[80%] mr-4 rounded-full bg-[#000000]'>
        <CustomIcon name = 'PenIcon' size={30} className='text-[#ffffff] text-center text-xl'/>
      </TouchableOpacity>
    </View>
  );
}

export default Trending;
