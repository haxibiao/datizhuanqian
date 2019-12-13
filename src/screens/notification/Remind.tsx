import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Iconfont, PageContainer, Avatar, Badge, TouchFeedback, Row, SafeText } from '@src/components';
import { Theme, PxFit, Tools } from '@src/utils';
import { Query, compose, graphql, GQL } from '@src/apollo';
import { app, config } from '@src/store';
import { useNavigation } from 'react-navigation-hooks';

const Remind = ({ unreadCount }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchFeedback style={styles.notificationItem} onPress={() => navigation.navigate('SystemNotification')}>
                <View>
                    <Image
                        style={styles.notificationAvatar}
                        source={require('@src/assets/images/notification_system.png')}
                    />
                </View>
                <View style={styles.itemContent}>
                    <SafeText style={styles.itemName}>系统通知</SafeText>
                    {unreadCount.system ? (
                        <Badge count={unreadCount.system} />
                    ) : (
                        <Iconfont name={'right'} size={PxFit(16)} color={Theme.subTextColor} />
                    )}
                </View>
            </TouchFeedback>
            {!config.disableAd && (
                <TouchFeedback
                    authenticate
                    navigation={navigation}
                    style={styles.notificationItem}
                    onPress={() => navigation.navigate('OfficialNotice')}>
                    <View>
                        <Image
                            style={styles.notificationAvatar}
                            source={require('@src/assets/images/official-notice.png')}
                        />
                    </View>
                    <View style={styles.itemContent}>
                        <SafeText style={styles.itemName}>官方公告</SafeText>
                        {unreadCount.notice ? (
                            <Badge count={unreadCount.notice} />
                        ) : (
                            <Iconfont name={'right'} size={PxFit(16)} color={Theme.subTextColor} />
                        )}
                    </View>
                </TouchFeedback>
            )}
            <TouchFeedback
                authenticate
                navigation={navigation}
                style={styles.notificationItem}
                onPress={() => navigation.navigate('CommentNotification')}>
                <View>
                    <Image
                        style={styles.notificationAvatar}
                        source={require('@src/assets/images/notification_comment.png')}
                    />
                </View>
                <View style={styles.itemContent}>
                    <SafeText style={styles.itemName}>评论</SafeText>
                    {unreadCount.comment ? (
                        <Badge count={unreadCount.comment} />
                    ) : (
                        <Iconfont name={'right'} size={PxFit(16)} color={Theme.subTextColor} />
                    )}
                </View>
            </TouchFeedback>
            <TouchFeedback
                authenticate
                navigation={navigation}
                style={styles.notificationItem}
                onPress={() => navigation.navigate('FansNotification')}>
                <View>
                    <Image
                        style={styles.notificationAvatar}
                        source={require('@src/assets/images/notification_follow.png')}
                    />
                </View>
                <View style={styles.itemContent}>
                    <SafeText style={styles.itemName}>粉丝</SafeText>
                    {unreadCount.fans ? (
                        <Badge count={unreadCount.fans} />
                    ) : (
                        <Iconfont name={'right'} size={PxFit(16)} color={Theme.subTextColor} />
                    )}
                </View>
            </TouchFeedback>
            <TouchFeedback
                authenticate
                navigation={navigation}
                style={styles.notificationItem}
                onPress={() => navigation.navigate('LikeNotification')}>
                <View>
                    <Image
                        style={styles.notificationAvatar}
                        source={require('@src/assets/images/notification_like.png')}
                    />
                </View>
                <View style={styles.itemContent}>
                    <SafeText style={styles.itemName}>赞</SafeText>
                    {unreadCount.like ? (
                        <Badge count={unreadCount.like} />
                    ) : (
                        <Iconfont name={'right'} size={PxFit(16)} color={Theme.subTextColor} />
                    )}
                </View>
            </TouchFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.lightBorder,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: PxFit(Theme.itemSpace),
        borderBottomWidth: PxFit(0.5),
        borderColor: Theme.borderColor,
    },
    notificationAvatar: {
        width: PxFit(48),
        height: PxFit(48),
        borderRadius: PxFit(24),
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
    },
    itemContent: {
        flex: 1,
        marginLeft: PxFit(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: PxFit(16),
        color: Theme.defaultTextColor,
    },
    itemRight: {
        marginLeft: PxFit(10),
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.lightBorder,
        paddingVertical: PxFit(25),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default Remind;
