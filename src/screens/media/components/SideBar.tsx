import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Animated, TouchableOpacity } from 'react-native';

import { Avatar, Iconfont } from 'components';
import { observer } from 'store';
import { PxFit, Theme, Tools } from 'utils';
import Like from './Like';
import VideoStore from '../VideoStore';

export default observer(props => {
    const { user, video } = props;
    return (
        <View style={styles.sideBar}>
            <View style={styles.itemWrap}>
                <TouchableOpacity
                    onPress={() => {
                        Tools.navigate('User', { user: user });
                    }}>
                    <Avatar source={user.avatar} size={46} style={{ borderColor: Theme.white, borderWidth: 1 }} />
                </TouchableOpacity>
            </View>
            <View style={styles.itemWrap}>
                <Like question={video} isPost />
            </View>
            <View style={styles.itemWrap}>
                <TouchableOpacity onPress={VideoStore.showComment}>
                    <Image source={require('@src/assets/images/comment_item.png')} style={styles.imageStyle} />
                    <Text style={styles.countText}>{Tools.NumberFormat(video.count_comments)}</Text>
                </TouchableOpacity>
            </View>
            {/* <View style={styles.itemWrap}>
                <Image source={require('../../../assets/images/publish_video.png')} style={styles.imageStyle} />
            </View> */}
        </View>
    );
});

const styles = StyleSheet.create({
    sideBar: {
        marginBottom: PxFit(30),
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemWrap: {
        marginTop: PxFit(20),
    },
    imageStyle: {
        width: PxFit(32),
        height: PxFit(32),
    },
    countText: {
        textAlign: 'center',
        marginTop: PxFit(10),
        fontSize: PxFit(12),
        color: 'rgba(255,255,255,0.8)',
    },
});
