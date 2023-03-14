/* eslint-disable */
import React, {useEffect, useCallback, useState} from 'react';
import {View, ScrollView, Image ,Text, Button, StatusBar, TouchableOpacity, BackHandler, ToastAndroid, TextInput, KeyboardAvoidingView} from 'react-native';
import {SocialProtocol} from '@spling/social-protocol';
import {Keypair} from '@solana/web3.js';
import {FileData, FileUriData, Post, ProtocolOptions, Reply, User} from '@spling/social-protocol/dist/types';
import CustomIcon from '../components/CustomIcon.js';
import { useSplingTransact } from '../utils/transact';
import { useAuthorization } from '../utils/useAuthorization';
import ImagePicker, { ImageOrVideo } from "react-native-image-crop-picker";

type createProps = {
    navigation: any;
}

function Create(props : createProps): JSX.Element {
    const [title, setTitle] = useState<string>('');
    const [body, setBody] = useState<string>('');
    const [tag, setTag] = useState<string>('');
    const [media, setMedia] = useState<ImageOrVideo>();
    const splingTransact = useSplingTransact();
    const routes = props.navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2];

    const handlePostSubmission = () => {
        if(title.length === 0){
            ToastAndroid.show(
                'Oops! Title cannot be empty',
                ToastAndroid.LONG,
            );
            return;
        }

        if(body.length === 0){
            ToastAndroid.show(
                'Oops! Body cannot be empty',
                ToastAndroid.LONG,
            );
            return;
        }

        if(tag.length === 0){
            ToastAndroid.show(
                'Oops! Add one tag',
                ToastAndroid.LONG,
            );
            return;
        }

        if(!media){
            ToastAndroid.show(
                'Oops! Add one cover image',
                ToastAndroid.LONG,
            );
            return;
        }

      const fileUriData: FileUriData | undefined = media && {
        size: media.size,
        type: media.mime,
        uri: media.path,
      };

      const tagObjects = ["Mobile",tag]

      const submitPost = async () => {
        try {
          const post = await splingTransact(async socialProtocol => {
            return await socialProtocol.createPost(33, title, body, fileUriData ? [fileUriData] : [], tagObjects.toString());
          });

          props.navigation.navigate('SolSpace')
          ToastAndroid.show('Wow! You have posted successfully', ToastAndroid.LONG);
        } catch (error) {
          ToastAndroid.show(
            'Oops! Cannot add post. Please try again later',
            ToastAndroid.LONG,
          );
        }
      };
      submitPost();
    };

    const handleMediaSelection = useCallback(async () => {
        try {
          const pickedImage = await ImagePicker.openPicker({
            multiple: false,
            mediaType: "photo",
          });
    
          const croppedImage = await ImagePicker.openCropper({
            path: pickedImage.path,
            mediaType: "photo",
            enableRotationGesture: false,
            cropperRotateButtonsHidden: true,
          });
    
          setMedia(croppedImage);
        } catch (e) {
          console.log(e);
        }
      }, [setMedia]);

    return (
      <View className="h-screen w-screen bg-[#000000]">
        <ScrollView>
          <TouchableOpacity
            className="flex flex-row items-center mt-10 px-4"
            onPress={handleMediaSelection}>
            <CustomIcon
              name="AddCover"
              size={30}
              className="text-[#757575] text-base"
            />
            <Text className="font-[Quicksand-Light] ml-1 text-[#757575]">
              {media ? 'Change Cover' : 'Add Cover'}
            </Text>
          </TouchableOpacity>
          <TextInput
            multiline
            className="bg-[#000000] w-[90%] placeholder-shown:text-[#000000] font-[Quicksand-SemiBold] mt-2 px-4 text-4xl rounded-full"
            value={title}
            onChangeText={setTitle}
            placeholder="Title..."></TextInput>
          <TextInput
            multiline
            className="bg-[#000000] w-[90%] placeholder-shown:text-[#000000] font-[Quicksand-Regular] px-4 text-lg rounded-full"
            value={body}
            onChangeText={setBody}
            placeholder="Body..."></TextInput>
          <TextInput
            multiline
            value={tag}
            maxLength={20}
            onChangeText={setTag}
            className="bg-[#000000] w-[90%] placeholder-shown:text-[#000000] font-[Quicksand-Regular] px-4 text-base rounded-full"
            placeholder="Add a tag..."></TextInput>

          {media && (
            <View
              marginB-32
              className="w-[100%] flex flex-row justify-center mt-5">
              <Image
                className="h-[200px] w-[95%] object-cover rounded-2xl"
                source={{uri: media.path}}
              />
            </View>
          )}
        </ScrollView>

        <TouchableOpacity className='flex flex-row absolute items-center justify-center h-[16vw] w-[15vw] p-4 mt-[90vh] ml-[80%] mr-4 rounded-full bg-[#ffffff]' onPress={handlePostSubmission}>
            <CustomIcon name = 'PenIcon' size={30} className='text-[#000000] text-center text-[6vw]'/>
        </TouchableOpacity>
        <TouchableOpacity className='flex flex-row absolute items-center justify-center h-[16vw] w-[15vw] p-4 mt-[90vh] mr-[80%] ml-4 rounded-full bg-[#ffffff]' onPress={()=>props.navigation.goBack()}>
                <CustomIcon name = {prevRoute.name === 'Trending' ? 'FeaturedActiveIcon' : prevRoute.name === 'Profile' ? 'AccountIcon' : 'FeedIcon'} size={30} className='text-[#000000] text-center text-[6vw]'/>
        </TouchableOpacity>
      </View>
    );
}

export default Create;