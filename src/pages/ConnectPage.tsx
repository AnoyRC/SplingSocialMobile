/* eslint-disable */
import React, {useEffect} from 'react';
import {View, ScrollView, Image ,Text, Button, StatusBar, TouchableOpacity} from 'react-native';
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
    const { authorizeSession , selectedAccount } = useAuthorization();
    const splingTransact = useSplingTransact();
      
    useEffect(()=>{
      if(!selectedAccount) return;
        const initialize = async () => {
          if(socialProtocol) return;
          const walletMock = {
            publicKey: selectedAccount.publicKey,
            payer: null as any,
          } as any;
          const curSocialProtocol = await new SocialProtocol(
            walletMock,
            null,
            options,
          ).init();
          setSocialProtocol(curSocialProtocol);
        };
        const UserInitialize = async () => {
            if(socialProtocol == null) return;
            const userInfo = await socialProtocol.getUserByPublicKey(selectedAccount.publicKey);
            console.log(userInfo);
        }
        initialize();
        UserInitialize();
    },[selectedAccount, socialProtocol])

    return <View>
    <Button
      onPress={async() => {
        await transact(async (wallet) => {
          await authorizeSession(wallet);
        });
        // transact(async (mobileWallet) => {
        //   const authorization = await mobileWallet.authorize({
        //     cluster: "mainnet-beta",
        //     identity: { name: "SolSpace" },
        //   });
        //   console.log(authorization.accounts[0].address)
        //   setPublicKey(getPublicKeyFromAddress(authorization.accounts[0].address));
        //   setAuth(authorization.accounts);
        // });
      }}
      title="Authorize"
    />

    <Button
      onPress={async() => {
        await splingTransact(async (socialProtocol) => {
          await socialProtocol?.followUser(21);
        });
      }}
      title="Create User"
    />

    <Button
      onPress={async() => {
        props.navigation.navigate('SolSpace');
      }}
      title="Feed"
    />
  </View>
}

export default ConnectPage;