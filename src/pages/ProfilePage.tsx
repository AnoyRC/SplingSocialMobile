/* eslint-disable */
import React, {useEffect} from 'react';
import {View, ScrollView, Image ,Text, Button, StatusBar, TouchableOpacity} from 'react-native';
import {SocialProtocol, User} from '@spling/social-protocol';
import {Keypair} from '@solana/web3.js';
import {Post, ProtocolOptions} from '@spling/social-protocol/dist/types';
import PostsDialog from '../components/post';
import CustomIcon from '../components/CustomIcon';
import { useAuthorization } from '../utils/useAuthorization';

type ProfileProps = {
  navigation: any;
  userId: number;
}

const options = {
    rpcUrl:
      'https://rpc.helius.xyz/?api-key=002d43b6-4f76-47c2-b4e1-9c87c9a6e3d2',
    useIndexer: true,
  } as ProtocolOptions;

function Profile(props : ProfileProps): JSX.Element {
    const [socialProtocol, setSocialProtocol] = React.useState<SocialProtocol>();
    const [userInfo, setUserInfo] = React.useState<User>();
    const [userQuery, setUserQuery] = React.useState<User>();
    const [posts, setPosts] = React.useState<Post[]>();
    const {selectedAccount} = useAuthorization();
    const routes = props.navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2];

    useEffect(()=>{
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

      const userInitialize = async () => {
        if (socialProtocol === undefined) {
          return;
        }
        if(selectedAccount?.publicKey){
          const myUser: User | null = await socialProtocol?.getUserByPublicKey(selectedAccount?.publicKey);
          if(myUser) setUserInfo(myUser);

          const userQuery: User | null = await socialProtocol?.getUser(props.userId);
          if(userQuery) setUserQuery(userQuery);
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
    },[socialProtocol, selectedAccount])

    useEffect(()=>{
        const postInitialize = async () => {
            if (socialProtocol === undefined) {
              return;
            }
            if(userQuery){
                const myPosts: Post[] | undefined = await socialProtocol?.getAllPostsByUserId(userQuery?.userId);
                const filteredPosts = myPosts?.filter((post) => post?.groupId===33);
                setPosts(filteredPosts);
            }
            
          };
    
          try {
            console.log('Initializing posts');
            postInitialize();
            console.log('Posts initialized');
          } catch (error) {
            console.log('Error initializing posts');
          } 
    },[userQuery])

    return <View className='h-screen w-screen'>
        <View className='absolute h-[60vh] bg-[#EAEAEA] w-[100%]'>
            {userQuery?.avatar && <Image source={{uri: userQuery?.avatar}} className='h-[60vh]'/>}
        </View>
        <ScrollView className=' '>
            <View className='h-[50vh] w-[100%] bg-transparent'></View>
            <View className='h-fit min-h-[50vh] w-[100%] bg-[#000000] rounded-t-3xl'>
            {userQuery &&
                <View className='flex flex-col'>
                    <Text className='text-left font-[Quicksand-SemiBold] text-5xl text-[#ffffff] mt-10 ml-5'>{userQuery?.nickname}</Text>
                    <Text className='text-left font-[Quicksand-Regular] text-lg text-[#00ff26] mt-2 ml-5'>Verified Account</Text>
                    <Text className='text-left font-[Quicksand-Regular] text-lg text-[#ffffff] mt-10 ml-5 mb-10'>{userQuery?.bio}</Text>
                </View>}
                {posts && posts.map((post) => <PostsDialog key={post.postId} post={post} socialProtocol={socialProtocol} navigation={props.navigation} userId={userInfo ? userInfo?.userId : undefined}/>)}
            </View>
        </ScrollView>
        <TouchableOpacity className='flex flex-row items-center justify-center h-fit p-4 px-5 mt-4 mx-4 rounded-full w-fit bg-[#ffffff] absolute' onPress={()=>props.navigation.goBack()}>
                <CustomIcon name = {prevRoute.name === 'Trending' ? 'FeaturedActiveIcon' : prevRoute.name === 'Profile' ? 'AccountIcon' : 'FeedIcon'} size={30} className='text-[#000000] text-center text-xl'/>
        </TouchableOpacity>
    </View>
}

export default Profile;