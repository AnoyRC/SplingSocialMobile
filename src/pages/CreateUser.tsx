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

function CreateUser(props : createProps): JSX.Element {
    const [name, setName] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [media, setMedia] = useState<ImageOrVideo>();
    const splingTransact = useSplingTransact();
    const routes = props.navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2];

    const handlePostSubmission = () => {
        if(name.length === 0){
            ToastAndroid.show(
                'Oops! Name cannot be empty',
                ToastAndroid.LONG,
            );
            return;
        }

        if(bio.length === 0){
            ToastAndroid.show(
                'Oops! Bio cannot be empty',
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

      const submitPost = async () => {
        try {
          const user = await splingTransact(async socialProtocol => {
            return await socialProtocol.createUser(name,fileUriData,bio);
          });

          props.navigation.navigate('SolSpace')
          ToastAndroid.show('Wow! User Created', ToastAndroid.LONG);
        } catch (error) {
          ToastAndroid.show(
            'Oops! Cannot create user, try again later',
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
        {media && (
            <View
              marginB-32
              className="w-[100%] flex flex-row justify-center mt-10">
              <Image
                className="h-[200px] w-[200px] object-cover rounded-full"
                source={{uri: media.path}}
              />
            </View>
          )}
          <TouchableOpacity
            className="flex flex-row items-center mt-10 px-4"
            onPress={handleMediaSelection}>
            <CustomIcon
              name="AddCover"
              size={30}
              className="text-[#757575] text-base"
            />
            <Text className="font-[Quicksand-Light] ml-1 text-[#757575]">
              {media ? 'Change Avatar' : 'Add Avatar'}
            </Text>
          </TouchableOpacity>
          <TextInput
            multiline
            className="bg-[#000000] w-[90%] placeholder-shown:text-[#000000] font-[Quicksand-SemiBold] mt-2 px-4 text-4xl rounded-full"
            value={name}
            onChangeText={setName}
            placeholder="Username..."></TextInput>
          <TextInput
            multiline
            className="bg-[#000000] w-[90%] placeholder-shown:text-[#000000] font-[Quicksand-Regular] px-4 text-lg rounded-full"
            value={bio}
            onChangeText={setBio}
            placeholder="Bio..."></TextInput>
        </ScrollView>

        <TouchableOpacity className='flex flex-row absolute items-center justify-center h-fit w-fit mt-[90vh] ml-[80%] mr-4 rounded-full bg-[#000000] rotate-45' onPress={handlePostSubmission}>
            <CustomIcon name = 'CloseIcon' size={30} className='text-[#ffffff] text-center text-6xl'/>
        </TouchableOpacity>
        <TouchableOpacity className='flex flex-row absolute items-center justify-center h-fit w-fit p-4 px-5 mt-[90vh] mr-[80%] ml-4 rounded-full bg-[#ffffff]' onPress={()=>props.navigation.goBack()}>
                <CustomIcon name = {prevRoute.name === 'Trending' ? 'FeaturedActiveIcon' : prevRoute.name === 'Profile' ? 'AccountIcon' : 'FeedIcon'} size={30} className='text-[#000000] text-center text-xl'/>
        </TouchableOpacity>
      </View>
    );
}

export default CreateUser;