import React, { Component } from 'react';
import { StyleSheet, View, Image, Animated, TouchableOpacity } from 'react-native';

import { Avatar, SafeText } from 'components';
import { observer } from 'store';
import { PxFit, Tools } from 'utils';
import Like from './Like';
import VideoStore from '../VideoStore';

export default observer(props => {
    const { media } = props;

    return (
        <View style={styles.sideBar}>
            <View style={styles.itemWrap}>
                <TouchableOpacity
                    onPress={() => {
                        Tools.navigate('User', { user: Tools.syncGetter('question.user', media) });
                    }}>
                    <Avatar
                        source={Tools.syncGetter('question.user.avatar', media)}
                        size={PxFit(52)}
                        style={{ borderColor: '#fff', borderWidth: 1 }}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.itemWrap}>
                <Like media={media} shadowText={true} />
            </View>
            <View style={styles.itemWrap}>
                <TouchableOpacity onPress={VideoStore.showComment}>
                    <Image source={require('@src/assets/images/comment_item.png')} style={styles.imageStyle} />
                    <SafeText shadowText={true} style={styles.countText}>
                        {Tools.NumberFormat(Tools.syncGetter('question.count_comments', media))}
                    </SafeText>
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    countText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: PxFit(12),
        marginTop: PxFit(10),
        textAlign: 'center',
    },
    imageStyle: {
        height: PxFit(40),
        width: PxFit(40),
    },
    itemWrap: {
        marginTop: PxFit(20),
    },
    questionReward: {
        bottom: PxFit(20),
        height: (PxFit(40) * 48) / 142,
        left: PxFit(0),
        position: 'absolute',
        width: PxFit(40),
    },
    sideBar: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
