/* eslint-disable */
import React, {useEffect} from 'react';
import {View, ScrollView, Image ,Text, Button, StatusBar, TouchableOpacity, BackHandler, ToastAndroid, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback} from 'react-native';
import {SocialProtocol} from '@spling/social-protocol';
import {Keypair} from '@solana/web3.js';
import {Post, ProtocolOptions, Reply, User} from '@spling/social-protocol/dist/types';
import CustomIcon from '../components/CustomIcon.js';
import { useSplingTransact } from '../utils/transact';
import { useAuthorization } from '../utils/useAuthorization';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper.js';
import { setAdjustResize, setAdjustNothing } from 'rn-android-keyboard-adjust';
import ReplyDialog from '../components/reply';
import { KeyboardAwareScrollView } from 'react-native-ui-lib';
import { TextField } from 'react-native-ui-lib/src/incubator/index.js';

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

    const [replies, setReplies] = React.useState<Reply[]>();
    const [comment, setComment] = React.useState<string>();
    const [toggleReply, setToggleReply] = React.useState<boolean>(false);

    useEffect(()=>{
        const initialize = async () => {
          if(socialProtocol) return;
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
          else{
            const keypair = Keypair.generate();
            const socialProtocol: SocialProtocol = await new SocialProtocol(
              keypair,
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
        const init = async () => {
        if(post === undefined) return;
        const commentInitialize = async () => {
            if (socialProtocol) {
              const replies = await socialProtocol.getAllPostReplies(post.postId);
              setReplies(replies)
            }
        }
        try {
            console.log('Initializing Comments');
            await commentInitialize();
            console.log('Initialized Comments');
          } catch (error) {
            console.log('Error initializing Comments');
          } 
        if(userInfo === undefined) return;
        if(post.likes.includes(userInfo.userId)){
            setLike(true);
        }
    }
    init();
    },[userInfo,socialProtocol,post])

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

    const handleReplies = async() => {
        if(comment && comment?.length > 0 && post){
            try {
                const reply = await splingTransact(async (socialProtocol) => {
                    return await socialProtocol.createPostReply(post.postId,comment);
                });
                if(replies && reply){
                    const newReplies = [...replies,reply];
                    setReplies(newReplies);
                }
                setComment("")
                setToggleReply(false);
                ToastAndroid.show(
                    'Reply posted successfully',
                    ToastAndroid.LONG,
                  );
            } catch (error) {
                ToastAndroid.show(
                    'Oops! Cannot reply to this post',
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
            <TouchableOpacity className='flex flex-row absolute items-center justify-center h-[16vw] w-[16vw] p-4 mt-4 mx-4 rounded-full bg-[#ffffff]' onPress={()=>props.navigation.goBack()}>
                <CustomIcon name = {prevRoute.name === 'Trending' ? 'FeaturedActiveIcon' : prevRoute.name === 'Profile' ? 'AccountIcon' : 'FeedIcon'} size={30} className='text-[#000000] text-center text-[5vw]'/>
            </TouchableOpacity>
        </View>
        <ScrollView className = ''>
            <Text className='text-[#000000] font-[Quicksand-Bold] text-3xl text-left mt-4 mx-4'>{post?.title}</Text>
            <View className = 'flex flex-row justify-start items-center h-fit mt-5'>
                <View className = 'w-[24px] bg-[#5E5E5E] h-[24px] rounded-full mt-1 ml-4 overflow-hidden' >
                    {post?.user.avatar && <Image className = 'w-full h-full object-cover' source = {{uri : post?.user.avatar}} />}
                </View>
                <TouchableWithoutFeedback onPress={()=>{props.navigation.navigate('Profile', {userId: post?.userId});}}>
                <View className = 'flex flex-row justify-between flex-grow'>
                    <Text className = 'text-[#000000] font-[Quicksand-Regular] text-md ml-2'>{post?.user.nickname}</Text>
                    <Text className = 'text-[#000000] font-[Quicksand-Regular] text-md mr-4'>{date}</Text>
                </View>
                </TouchableWithoutFeedback>
            </View>
            <View className='flex flex-row w-[100%] justify-center mt-5'>
                <View className='bg-[#5E5E5E] h-[1px] w-[70%]'></View>
            </View>
            <View className='flex flex-row w-[100%] justify-start mt-5'>
                <Text className='font-[Quicksand-Regular] text-[#000000] mx-4'>{post?.text}</Text>
            </View>
            <View className='flex flex-row w-[100%] justify-center mt-5'>
                <View className='bg-[#5E5E5E] h-[1px] w-[70%]'></View>
            </View>
            <View className='flex flex-col w-[100%] justify-center mt-5'>
                {replies && replies.map((reply,index) => (
                        <ReplyDialog reply={reply} key={index}/>
                    ))}
            </View>
        </ScrollView>
        <TouchableOpacity className='flex flex-row absolute items-center justify-center h-[16vw] w-[15vw] p-4 mt-[90vh] ml-[80%] mr-4 rounded-full bg-[#000000]' onPress={likePost}>
                <CustomIcon name = {like ? 'LikeActiveIcon':'LikeIcon'} size={30} className='text-[#ffffff] text-center text-[6vw]'/>
        </TouchableOpacity>
        {!toggleReply &&
        <TouchableOpacity className='flex flex-row absolute items-center justify-center h-[16vw] w-[15vw] p-4 mt-[90vh] mr-[80%] ml-4 rounded-full bg-[#000000]' onPress={()=>{setToggleReply(true)}}>
                <CustomIcon name = 'CommentIcon' size={30} className='text-[#ffffff] text-center text-[6vw]'/>
        </TouchableOpacity>}
        {toggleReply &&
        <View className='absolute h-screen w-screen flex flex-col justify-center items-center bg-[#000000] opacity-90'>
            <TextInput className='bg-[#000000] w-[90%] placeholder-shown:text-[#000000] font-[Quicksand-Regular] p-4 text-lg rounded-full' value={comment} onChangeText={setComment} placeholder='Add a Comment'></TextInput>
        </View>}
        {toggleReply &&
        <TouchableOpacity className='flex flex-row absolute items-center justify-center h-[16vw] w-[15vw] p-4 mt-[90vh] ml-[80%] mr-4 rounded-full bg-[#000000]' onPress={handleReplies}>
                <CustomIcon name = 'CommentIcon' size={30} className='text-[#ffffff] text-center text-[6vw]'/>
        </TouchableOpacity>}
        {toggleReply &&
        <TouchableOpacity className='flex flex-row absolute items-center justify-center h-[16vw] w-[15vw] mt-4 mx-4 rounded-full' onPress={()=>{setToggleReply(false)}}>
                <CustomIcon name = 'CloseIcon' size={30} className='text-[#ffffff] text-center text-[15vw]'/>
        </TouchableOpacity>}
    </View>;
}

export default PostPage;