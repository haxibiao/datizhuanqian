import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Animated, TouchableOpacity } from 'react-native';

import { Avatar, Iconfont } from 'components';
import { observer } from 'store';
import { PxFit, Theme, Tools } from 'utils';
import Like from './Like';

export default observer(props => {
    const { media } = props;
    return (
        <View>
            <View style={[styles.itemWrap, { marginBottom: 26 }]}>
                <TouchableOpacity
                    onPress={() => {
                        Tools.navigate('用户详情', { user: media.question.user });
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
        </View>
    );
});

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemWrap: {
        alignItems: 'center',
        marginBottom: 12,
    },
    countText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    iconStyle: {
        width: 40,
        height: 40,
    },
});
