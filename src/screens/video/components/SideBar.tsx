import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Animated, TouchableOpacity } from 'react-native';

import { Avatar, Iconfont } from 'components';
import { observer } from 'store';
import { PxFit, Theme, Tools } from 'utils';
import Like from './Like';
import VideoStore from '../VideoStore';

export default observer(props => {
    const { media } = props;
    return (
        <View style={styles.sideBar}>
            <View style={styles.itemWrap}>
                <TouchableOpacity
                    onPress={() => {
                        Tools.navigate('User', { user: media.question.user });
                    }}>
                    <Avatar
                        source={media.question.user.avatar}
                        size={52}
                        style={{ borderColor: Theme.white, borderWidth: 1 }}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.itemWrap}>
                <Like media={media} />
            </View>
            <View style={styles.itemWrap}>
                <TouchableOpacity onPress={VideoStore.showComment}>
                    <Image source={require('@src/assets/images/comment_item.png')} style={styles.imageStyle} />
                    <Text style={styles.countText}>
                        {Tools.NumberFormat(Tools.syncGetter('question.count_comments', media))}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    sideBar: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemWrap: {
        marginTop: PxFit(20),
    },
    imageStyle: {
        width: PxFit(40),
        height: PxFit(40),
    },
    countText: {
        textAlign: 'center',
        marginTop: PxFit(10),
        fontSize: PxFit(12),
        color: 'rgba(255,255,255,0.8)',
    },
});
