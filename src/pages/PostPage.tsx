/* eslint-disable */
import React, {useEffect} from 'react';
import {View, ScrollView, Image ,Text, Button, StatusBar, TouchableOpacity, BackHandler} from 'react-native';
import {SocialProtocol} from '@spling/social-protocol';
import {Keypair} from '@solana/web3.js';
import {Post, ProtocolOptions} from '@spling/social-protocol/dist/types';
import CustomIcon from '../components/CustomIcon.js';

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

    const routes = props.navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2];

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
                <CustomIcon name = {prevRoute.name === 'Trending' ? 'FeaturedActiveIcon' : 'FeedIcon'} size={30} className='text-[#000000] text-center text-xl'/>
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
        <TouchableOpacity className='flex flex-row absolute items-center justify-center h-fit w-fit p-4 px-5 mt-[90vh] ml-[80%] mr-4 rounded-full bg-[#000000]'>
                <CustomIcon name = 'LikeIcon' size={30} className='text-[#ffffff] text-center text-xl'/>
        </TouchableOpacity>
    </View>;
}

export default PostPage;