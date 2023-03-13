/* eslint-disable */
import React, {useEffect} from 'react';
import {View, ScrollView, Image ,Text, Button, StatusBar, TouchableOpacity,ToastAndroid} from 'react-native';
import {SocialProtocol} from '@spling/social-protocol';
import {Keypair} from '@solana/web3.js';
import {Post, ProtocolOptions, User} from '@spling/social-protocol/dist/types';
import TrendingDialog from '../components/trendingPost';
import CustomIcon from '../components/CustomIcon';
import { useAuthorization } from '../utils/useAuthorization';

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
  const {selectedAccount} = useAuthorization();
  const [userInfo, setUserInfo] = React.useState<User>();

  useEffect(() => {
    const keypair = Keypair.generate();
    const Initialize = async () => {
      if (socialProtocol === undefined) {
        if(!selectedAccount?.publicKey){
        const socialProtocol: SocialProtocol = await new SocialProtocol(
          keypair,
          null,
          options,
        ).init();
        setSocialProtocol(socialProtocol);
        }
        else{
          console.log(selectedAccount?.publicKey)
          const walletMock = {
            publicKey: selectedAccount.publicKey,
            payer: null as any,
          } as any;
          const socialProtocol: SocialProtocol = await new SocialProtocol(
            walletMock,
            null,
            options,
          ).init();
          setSocialProtocol(socialProtocol);
        }
      }

      const postInitialize = async () => {
        if (socialProtocol === undefined) {
          return;
        }
        const myPosts: Post[] | undefined = await socialProtocol?.getAllPosts(33);
        const sorted = myPosts?.sort((a, b) => {
          return b.likes.length - a.likes.length;
        })
        setPosts(sorted);
      };

      try {
        console.log('Initializing posts');
        await postInitialize();
        console.log('Posts initialized');
      } catch (error) {
        console.log('Error initializing posts');
      } 

      const userInitialize = async () => {
        if (socialProtocol === undefined) {
          return;
        }
        if(selectedAccount?.publicKey){
          const myUser: User | null = await socialProtocol?.getUserByPublicKey(selectedAccount?.publicKey);
          if(myUser) setUserInfo(myUser);
        }
      }
  
      try {
        console.log('Initializing User');
        userInitialize();
        console.log('User initialized');
      } catch (error) {
        console.log('Error initializing User');
      } 
    };
    
    Initialize();
  }, [socialProtocol, selectedAccount]);

  const handleProfile = () => {
    if(userInfo)  props.navigation.navigate('Profile', {userId: userInfo.userId});
    else{
      ToastAndroid.show(
        'No user found',
        ToastAndroid.LONG,
      );
    }
  }

  const backgroundStyle = ' h-screen w-screen bg-[#f7f9ff]';
  return (
    <View className={backgroundStyle}>
      <ScrollView className = 'h-[80vh] w-[100%] content-center bg-[#f7f9ff]'>
      <View className = 'flex flex-col w-[100%] justify-start bg-[#f7f9ff]'>
        <Text className = {`font-[Quicksand-SemiBold] text-5xl text-[#666464] mt-4 pt-3 ml-6`}>Trending</Text>
        <Text className = {`font-[Quicksand-Regular] text-md text-[#666464] mb-4 ml-6`}>Explore the most popular post{"\n"}of our community</Text>
      </View>
        {posts && posts.map((post,index) => <TrendingDialog key={post.postId} post={post} socialProtocol={socialProtocol} navigation={props.navigation} index={index} userId={userInfo ? userInfo?.userId : undefined}/>)}
      </ScrollView>
      <View className='bg-[#000000] w-[100%] h-[10vh] rounded-t-2xl'>
        <View className='flex flex-row justify-between items-center flex-grow pr-14 pl-6'>
          <View className = 'flex flex-row items-center justify-center h-fit py-3 px-8 rounded-full w-fit bg-[#ffffff]'>
            <CustomIcon name = 'FeaturedActiveIcon' size={30} className='text-[#000000] text-center text-2xl shadow-2xl'/>
          </View>
          <TouchableOpacity className='mr-9' onPress={()=>{props.navigation.navigate('SolSpace')}}>
            <CustomIcon name = 'FeedIcon' size={30} className='text-[#ffffff] text-center text-2xl'/>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfile}>
            <CustomIcon name = 'ProfileIcon' size={30} className='text-[#ffffff] text-center text-2xl'/>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity className='flex flex-row absolute items-center justify-center h-fit w-fit p-4 px-5 mt-[81vh] ml-[80%] mr-4 rounded-full bg-[#000000]' onPress={()=>{props.navigation.navigate('Create')}}>
        <CustomIcon name = 'PenIcon' size={30} className='text-[#ffffff] text-center text-xl'/>
      </TouchableOpacity>
    </View>
  );
}

export default Trending;
