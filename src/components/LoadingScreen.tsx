/* eslint-disable */
import React, {useEffect} from 'react';
import {View, ScrollView, Image ,Text, Button, StatusBar, TouchableOpacity, ToastAndroid} from 'react-native';


function LoadingScreen():JSX.Element{
    return(
    <View className = 'h-screen w-screen absolute bg-[#ffffff]'>
      <View className='flex flex-col items-center w-[100%] bg-[#000000] rounded-b-full pb-1 pt-32'>
        <Image source={require('../pages/Favicon.png')} className='h-[60%] w-[53%]'/>
      </View>
      <View className = 'flex flex-col flex-grow justify-center items-center mt-10'>
        <Image source={require('./Ripple.gif')} className='h-[90px] w-[90px]'/>
      </View>
    </View>)
  }

export default LoadingScreen;