/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 17:52:05
 */

import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchFeedback, Avatar } from 'components';

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
            <TouchFeedback style={styles.userItem} onPress={() => navigation.navigate('User', { user })}>
                <Avatar source={user.avatar} userId={user.id} size={PxFit(24)} />
                <Text style={styles.userName}>{user.name}</Text>
            </TouchFeedback>
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
        width: Device.WIDTH,
        height: Device.HEIGHT,
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
