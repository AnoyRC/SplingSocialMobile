/* eslint-disable */
import React, {useEffect} from 'react';
import {View, ScrollView, Text, Button, Image, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {SocialProtocol} from '@spling/social-protocol';
import {Post, ProtocolOptions} from '@spling/social-protocol/dist/types';
import CustomIcon from './CustomIcon';

type postProps = {
    navigation: any;
    socialProtocol: SocialProtocol | undefined;
    post : Post;
}

function PostsDialog(props : postProps): JSX.Element {
    return <View className = ' w-[100%] h-fit flex flex-row items-center p-2 mt-2 bg-[#ffffff] rounded-2xl'>
        <View className = 'flex flex-col w-[60%] h-fit justify-start ml-3'>
            <View className = 'flex flex-row justify-start items-center h-fit'>
                <View className = 'w-[24px] bg-[#5E5E5E] h-[24px] rounded-full mt-1 overflow-hidden' >
                    <Image className = 'w-full h-full object-cover' source = {{uri : props.post.user.avatar}} />
                </View>
                <Text className = 'text-[#000000] font-[Quicksand-Regular] text-md ml-2'>{props.post.user.nickname}</Text>
            </View>
            <TouchableWithoutFeedback onPress={()=>props.navigation.navigate('Post', {post: JSON.stringify(props.post)})} className = 'flex flex-col justify-start h-fit w-[100%]'>
                {props.post.title && <Text className = 'text-[#000000] font-[Quicksand-Bold] text-xl'>{props.post.title.length < 40 ? props.post.title : props.post.title?.substring(0,40)+'...'}</Text>}
            </TouchableWithoutFeedback>
            <View className = 'flex flex-grow flex-row justify-start items-end h-fit mt-2 mb-1'>
                <TouchableOpacity className='flex flex-row items-center  rounded-full px-1.5'>
                    <CustomIcon name = 'LikeIcon' size={20} className='text-[#000000] text-center text-sm' />
                    <Text className='text-[#000000] font-[Quicksand-Regular] text-sm ml-1 mb-0.5'>{props.post.likes.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity className='flex flex-row items-center ml-2  rounded-full px-1.5'>
                    <CustomIcon name = 'CommentIcon' size={20} className='text-[#000000] text-center text-sm'/>
                </TouchableOpacity>
            </View>
        </View>
        <View className = 'w-[35%] bg-[#5E5E5E] h-[120px] rounded-xl overflow-hidden mr-2'>
            <TouchableWithoutFeedback onPress={()=>props.navigation.navigate('Post', {post: JSON.stringify(props.post)})}>
                <Image className = 'w-full h-full object-cover' source = {{uri : props.post.media[0].file}}  />
            </TouchableWithoutFeedback>
        </View>
    </View>
}

export default PostsDialog;