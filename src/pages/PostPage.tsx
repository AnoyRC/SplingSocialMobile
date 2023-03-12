/* eslint-disable */
import React, {useEffect} from 'react';
import {View, ScrollView, Image ,Text, Button, StatusBar, TouchableOpacity, BackHandler, ToastAndroid} from 'react-native';
import {SocialProtocol} from '@spling/social-protocol';
import {Keypair} from '@solana/web3.js';
import {Post, ProtocolOptions, User} from '@spling/social-protocol/dist/types';
import CustomIcon from '../components/CustomIcon.js';
import { useSplingTransact } from '../utils/transact';
import { useAuthorization } from '../utils/useAuthorization';

const options = {
    rpcUrl:
      'https://rpc.helius.xyz/?api-key=002d43b6-4f76-47c2-b4e1-9c87c9a6e3d2',
    useIndexer: true,
} as ProtocolOptions;

type PostProps = {
    navigation: any;
    post : string;
}


function PostPage(props : PostProps): JSX.Element {
    const [date, setDate] = React.useState<String>();
    const [post, setPost] = React.useState<Post>();
    const [socialProtocol, setSocialProtocol] = React.useState<SocialProtocol>();
    const [userInfo, setUserInfo] = React.useState<User>();

    const {selectedAccount} = useAuthorization();

    const routes = props.navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2];

    const splingTransact = useSplingTransact();
    const [like, setLike] = React.useState<boolean>(false);

    useEffect(()=>{
        const initialize = async () => {
          if(socialProtocol !== undefined) return;
          if (selectedAccount?.publicKey) {
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
        };
        initialize();
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
    },[socialProtocol])

    useEffect(()=>{
        if(userInfo === undefined || post === undefined) return;
        if(post.likes.includes(userInfo.userId)){
            setLike(true);
        }
    },[userInfo])

    const likePost = async () => {
        if(post){
            try {
                await splingTransact(async (socialProtocol) => {
                    await socialProtocol?.likePost(post.publicKey);
                });
                setLike(!like); 
                ToastAndroid.show(
                    like ?  'Unliked this post' : 'Wow! You liked this post',
                    ToastAndroid.LONG,
                  );
            } catch (error) {
                ToastAndroid.show(
                    !like ? 'Oops! Cannot like this post' : 'Oops! Cannot unlike this post',
                    ToastAndroid.LONG,
                  );
            }
        }
    }

    useEffect(()=>{
        setPost(JSON.parse(props.post));
        var date = new Date(JSON.parse(props.post).timestamp * 1000); //Scaring me
        setDate(
            date.getDate() +
            " " +
            date.toString().substring(4, 7) +
            " " +
            date.getFullYear()
        ); 
    },[])

    return <View className='h-screen w-screen bg-[#f7f9ff]'>
        <View className='w-full h-[40vh] bg-[#EAEAEA]'>
            {post?.media[0].file && <Image className='w-full h-full object-cover' source={{uri : post?.media[0].file}} />}
            <TouchableOpacity className='flex flex-row absolute items-center justify-center h-fit p-4 px-5 mt-4 mx-4 rounded-full w-fit bg-[#ffffff]' onPress={()=>props.navigation.goBack()}>
                <CustomIcon name = {prevRoute.name === 'Trending' ? 'FeaturedActiveIcon' : prevRoute.name === 'Profile' ? 'AccountIcon' : 'FeedIcon'} size={30} className='text-[#000000] text-center text-xl'/>
            </TouchableOpacity>
        </View>
        <ScrollView className = ''>
            <Text className='text-[#000000] font-[Quicksand-Bold] text-3xl text-left mt-4 mx-4'>{post?.title}</Text>
            <View className = 'flex flex-row justify-start items-center h-fit mt-5'>
                <View className = 'w-[24px] bg-[#5E5E5E] h-[24px] rounded-full mt-1 ml-4 overflow-hidden' >
                    {post?.user.avatar && <Image className = 'w-full h-full object-cover' source = {{uri : post?.user.avatar}} />}
                </View>
                <View className = 'flex flex-row justify-between flex-grow'>
                    <Text className = 'text-[#000000] font-[Quicksand-Regular] text-md ml-2'>{post?.user.nickname}</Text>
                    <Text className = 'text-[#000000] font-[Quicksand-Regular] text-md mr-4'>{date}</Text>
                </View>
            </View>
            <View className='flex flex-row w-[100%] justify-center mt-5'>
                <View className='bg-[#5E5E5E] h-[1px] w-[70%]'></View>
            </View>
            <View className='flex flex-row w-[100%] justify-start mt-5'>
                <Text className='font-[Quicksand-Regular] text-[#000000] mx-4'>{post?.text}</Text>
            </View>
        </ScrollView>
        <TouchableOpacity className='flex flex-row absolute items-center justify-center h-fit w-fit p-4 px-5 mt-[90vh] ml-[80%] mr-4 rounded-full bg-[#000000]' onPress={likePost}>
                <CustomIcon name = {like ? 'LikeActiveIcon':'LikeIcon'} size={30} className='text-[#ffffff] text-center text-xl'/>
        </TouchableOpacity>
    </View>;
}

export default PostPage;