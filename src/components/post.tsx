/* eslint-disable */
import React, {useEffect} from 'react';
import {View, ScrollView, Text, Button, Image, TouchableOpacity, TouchableWithoutFeedback, ToastAndroid} from 'react-native';
import {SocialProtocol} from '@spling/social-protocol';
import {Post, ProtocolOptions} from '@spling/social-protocol/dist/types';
import CustomIcon from './CustomIcon';
import { useSplingTransact } from '../utils/transact';

type postProps = {
    navigation: any;
    socialProtocol: SocialProtocol | undefined;
    post : Post;
    userId : number | undefined;
}

function PostsDialog(props : postProps): JSX.Element {
    const splingTransact = useSplingTransact();
    const [like, setLike] = React.useState<boolean>(false);
    const [totalLikes, setTotalLikes] = React.useState<number>(0);

    useEffect(()=>{
        setTotalLikes(props.post?.likes.length);
        if(props.userId === undefined) return;
        if(props.post.likes.includes(props.userId)){
            setLike(true);
        }
    },[props.userId])

    const likePost = async () => {
        if(props?.post){
            try {
                await splingTransact(async (socialProtocol) => {
                    await socialProtocol?.likePost(props.post?.publicKey);
                });
                if(like) setTotalLikes(totalLikes-1);
                else setTotalLikes(totalLikes+1);
                setLike(!like); 
                ToastAndroid.show(
                    like ?  'Unliked this post' : 'Wow! You liked this post',
                    ToastAndroid.LONG,
                  );
            } catch (error) {
                ToastAndroid.show(
                    'Oops! Cannot like this post',
                    ToastAndroid.LONG,
                  );
            }
        }
    }

    return <View className = ' w-[100%] h-fit flex flex-row items-center p-2 mt-2 bg-[#ffffff] rounded-2xl'>
        <View className = 'flex flex-col w-[60%] h-fit justify-start ml-3'>
            <TouchableWithoutFeedback onPress={()=>{props.navigation.navigate('Profile', {userId: props.post.userId});}}>
                <View className = 'flex flex-row justify-start items-center h-fit'>
                    <View className = 'w-[24px] bg-[#5E5E5E] h-[24px] rounded-full mt-1 overflow-hidden' >
                        <Image className = 'w-full h-full object-cover' source = {{uri : props.post.user.avatar}} />
                    </View>
                    <Text className = 'text-[#000000] font-[Quicksand-Regular] text-md ml-2'>{props.post.user.nickname}</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={()=>props.navigation.navigate('Post', {post: JSON.stringify(props.post)})} className = 'flex flex-col justify-start h-fit w-[100%]'>
                {props.post.title && <Text className = 'text-[#000000] font-[Quicksand-Bold] text-xl'>{props.post.title.length < 40 ? props.post.title : props.post.title?.substring(0,40)+'...'}</Text>}
            </TouchableWithoutFeedback>
            <View className = 'flex flex-grow flex-row justify-start items-end h-fit mt-2 mb-1'>
                <TouchableOpacity className='flex flex-row items-center  rounded-full px-1.5' onPress={likePost}>
                    <CustomIcon name = {like ? 'LikeActiveIcon':'LikeIcon'} size={20} className='text-[#000000] text-center text-sm' />
                    <Text className='text-[#000000] font-[Quicksand-Regular] text-sm ml-1 mb-0.5'>{totalLikes}</Text>
                </TouchableOpacity>
                <TouchableOpacity className='flex flex-row items-center ml-2  rounded-full px-1.5' onPress={()=>props.navigation.navigate('Post', {post: JSON.stringify(props.post)})}>
                    <CustomIcon name = 'CommentIcon' size={20} className='text-[#000000] text-center text-sm'/>
                </TouchableOpacity>
            </View>
        </View>
        <View className = 'w-[35%] bg-[#5E5E5E] h-[120px] rounded-xl overflow-hidden mr-2'>
            <TouchableWithoutFeedback onPress={()=>props.navigation.navigate('Post', {post: JSON.stringify(props.post)})}>
                {props.post.media[0].file && <Image className = 'w-full h-full object-cover' source = {{uri : props.post.media[0].file}}  />}
            </TouchableWithoutFeedback>
        </View>
    </View>
}

export default PostsDialog;