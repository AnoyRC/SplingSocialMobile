/* eslint-disable */
import React, {useCallback, useEffect} from 'react';
import {View, ScrollView, Image ,Text, Button, StatusBar, TouchableOpacity, ToastAndroid} from 'react-native';
import {SocialProtocol} from '@spling/social-protocol';
import {Keypair} from '@solana/web3.js';
import {Post, ProtocolOptions, User} from '@spling/social-protocol/dist/types';
import PostsDialog from '../components/post';
import CustomIcon from '../components/CustomIcon';
import { useAuthorization } from '../utils/useAuthorization';
import { useFocusEffect } from '@react-navigation/native' 

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
  const {selectedAccount} = useAuthorization();
  const [userInfo, setUserInfo] = React.useState<User>();

  useFocusEffect(
    useCallback(() => {
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
        setPosts(myPosts);
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
    }
    Initialize();
  },[socialProtocol, selectedAccount])
  );

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
      <View className = 'flex flex-row w-[100%] justify-center bg-[#ffffff] border-[#000000] border-[1px] rounded-b-2xl'>
        {/* <Text className = {`font-[Quicksand-Regular] text-4xl text-[#000000] mt-[8px] py-3 ml-6`}>Feed</Text> */}
        <Image className ='h-[40px] w-[140px] mt-[15px] mb-[10px]' source = {require('./SolSpaceLogo.png')} />
      </View>
      <ScrollView className = 'h-[80vh] w-[100%] content-center bg-[#f7f9ff]'>
        {posts && posts.map((post) => <PostsDialog key={post.postId} post={post} socialProtocol={socialProtocol} navigation={props.navigation} userId={userInfo ? userInfo?.userId : undefined}/>)}
      </ScrollView>
      <View className='bg-[#000000] w-[100%] h-[10vh] rounded-t-2xl'>
        <View className='flex flex-row justify-between items-center flex-grow px-14'>
          <TouchableOpacity onPress={()=>{props.navigation.navigate('Trending')}}>
            <CustomIcon name = 'FeaturedIcon' size={30} className='text-[#ffffff] text-center text-2xl'/>
          </TouchableOpacity>
          <View className = 'flex flex-row items-center justify-center h-fit py-3 px-8 rounded-full w-fit bg-[#ffffff]'>
            <CustomIcon name = 'FeedIcon' size={30} className='text-[#000000] text-center text-2xl shadow-2xl'/>
          </View>
          <TouchableOpacity onPress={handleProfile}>
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

export default Feed;
