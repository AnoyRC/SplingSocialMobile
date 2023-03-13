/* eslint-disable */
import React, {useEffect} from 'react';
import {View, ScrollView, Image ,Text, Button, StatusBar, TouchableOpacity, ToastAndroid} from 'react-native';
import {SocialProtocol} from '@spling/social-protocol';
import {Keypair, PublicKey} from '@solana/web3.js';
import {Post, ProtocolOptions} from '@spling/social-protocol/dist/types';
import CustomIcon from '../components/CustomIcon';
import { AuthorizationResult, Base64EncodedAddress, transact } from "@solana-mobile/mobile-wallet-adapter-protocol";
import { toUint8Array } from 'js-base64';
import { useAuthorization } from "../utils/useAuthorization";
import { useSplingTransact } from '../utils/transact';

const options = {
  rpcUrl:
    'https://rpc.helius.xyz/?api-key=002d43b6-4f76-47c2-b4e1-9c87c9a6e3d2',
  useIndexer: true,
} as ProtocolOptions;

type ConnectProps = {
  navigation: any;
}

function ConnectPage(props : ConnectProps): JSX.Element {
    const[socialProtocol, setSocialProtocol] = React.useState<SocialProtocol>();
    const { authorizeSession } = useAuthorization();
    const splingTransact = useSplingTransact();

    const handleConnect = async () => {
      try {
        await transact(async (wallet) => {
          await authorizeSession(wallet);
        });
        ToastAndroid.show(
          'Connected',
          ToastAndroid.LONG,
        );
        props.navigation.navigate('SolSpace')
      } catch (error) {
        ToastAndroid.show(
          'Oops! Cannot connect wallet',
          ToastAndroid.LONG,
        );
      };
    }

    

    return (<View className = 'h-screen w-screen'>
      <View className='flex flex-col items-center w-[100%] bg-[#000000] rounded-b-full pb-1 pt-32'>
        <Image source={require('./Favicon.png')} className='h-[60%] w-[53%]'/>
        <View className='absolute'>
          <Text className='text-center font-[Quicksand-SemiBold] text-2xl mt-[140%]'>Explore the best of{"\n"}Solana's Dev Community</Text>
        </View>
      </View>
      <View className = 'flex flex-col items-center mt-10'>
        <TouchableOpacity className='bg-[#000000] w-[70%] p-5 rounded-full' onPress={handleConnect}>
          <Text className='text-center font-[Quicksand-Bold] text-[#ffffff] text-xl'>Connect</Text>
        </TouchableOpacity>
        <TouchableOpacity className='bg-[#7e7e7e] w-[70%] p-5 rounded-full mt-5' onPress={()=>{props.navigation.navigate('SolSpace')}}>
          <Text className='text-center font-[Quicksand-Bold] text-[#ffffff] text-xl'>Guest</Text>
        </TouchableOpacity>

        <Text className='text-[#000000] mt-5 font-[Quicksand-Regular] text-center'>*SolSpace is still in development,{"\n"}this is not the final release</Text>
      </View>
  </View>);
}

export default ConnectPage;