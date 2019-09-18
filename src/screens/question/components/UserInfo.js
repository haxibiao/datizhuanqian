/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 17:52:05
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Animated } from 'react-native';
import { TouchFeedback, Avatar, Button } from 'components';
import { PxFit, Theme, SCREEN_WIDTH, SCREEN_HEIGHT, Config } from 'utils';

import { Overlay } from 'teaset';

class UserInfo extends Component {
    render() {
        const {
            question: { user },
            navigation,
        } = this.props;
        if (user.id == 1) {
            return null;
        }

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchFeedback style={styles.userItem} onPress={() => navigation.navigate('User', { user })}>
                    <Avatar source={user.avatar} size={PxFit(24)} />
                    <Text style={styles.userName}>{user.name}</Text>
                </TouchFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: PxFit(Theme.itemSpace),
    },
    userName: { fontSize: PxFit(13), color: Theme.defaultTextColor, paddingLeft: PxFit(6) },
    overlayInner: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        height: PxFit(38),
        borderRadius: PxFit(19),
        marginTop: PxFit(10),
        backgroundColor: Theme.primaryColor,
    },
});

export default UserInfo;
