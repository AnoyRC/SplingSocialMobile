/* eslint-disable */
import React, {useEffect} from 'react';
import {View, ScrollView, Text, Button, Image, TouchableOpacity, TouchableWithoutFeedback, ToastAndroid} from 'react-native';
import {SocialProtocol} from '@spling/social-protocol';
import {Post, ProtocolOptions, Reply} from '@spling/social-protocol/dist/types';
import CustomIcon from './CustomIcon';
import { useSplingTransact } from '../utils/transact';

type replyProps = {
    reply: Reply;
}

function ReplyDialog(props : replyProps): JSX.Element {
    return(
        <View className='mb-5'>
            <Text className='text-[#000000] text-center italic font-thin'>{`${props.reply.user.nickname} Commented:`}</Text>
            <Text className='text-[#000000] font-[Quicksand-Regular] text-center'>{`"${props.reply.text}"`}</Text>
        </View>
    );
}

export default ReplyDialog;