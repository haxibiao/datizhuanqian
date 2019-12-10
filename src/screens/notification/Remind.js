/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:48
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Iconfont, PageContainer, Avatar, Badge, TouchFeedback, Row, SafeText } from 'components';
import { Theme, PxFit, Tools } from 'utils';

import { Query, compose, graphql, GQL } from 'apollo';
import { app, config } from 'store';

class Remind extends Component {
    calcUnreads(data) {
        data = data || {};
        return function(key) {
            const state = {
                system:
                    data.unread_notifications_count -
                    data.unread_comment_notifications_count -
                    data.unread_user_follow_notifications_count -
                    data.unread_like_notifications_count -
                    data.unread_notices_count,
                comment: data.unread_comment_notifications_count,
                fans: data.unread_user_follow_notifications_count,
                like: data.unread_like_notifications_count,
                notice: data.unread_notices_count,
            };
            return state[key] || 0;
        };
    }

    render() {
        const { navigation, data } = this.props;
        const user = Tools.syncGetter('user', data);
        const loading = !user;
        const calcUnreads = this.calcUnreads(user);
        return (
            <PageContainer loading={loading} title="消息中心" white>
                <TouchFeedback
                    style={styles.notificationItem}
                    onPress={() => navigation.navigate('SystemNotification')}>
                    <View>
                        <Image
                            style={styles.notificationAvatar}
                            source={require('../../assets/images/notification_system.png')}
                        />
                    </View>
                    <View style={styles.itemContent}>
                        <SafeText style={styles.itemName}>系统通知</SafeText>
                        {calcUnreads('system') ? (
                            <Badge count={calcUnreads('system')} />
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
                                source={require('../../assets/images/official-notice.png')}
                            />
                        </View>
                        <View style={styles.itemContent}>
                            <SafeText style={styles.itemName}>官方公告</SafeText>
                            {calcUnreads('notice') ? (
                                <Badge count={calcUnreads('notice')} />
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
                            source={require('../../assets/images/notification_comment.png')}
                        />
                    </View>
                    <View style={styles.itemContent}>
                        <SafeText style={styles.itemName}>评论</SafeText>
                        {calcUnreads('comment') ? (
                            <Badge count={calcUnreads('comment')} />
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
                            source={require('../../assets/images/notification_follow.png')}
                        />
                    </View>
                    <View style={styles.itemContent}>
                        <SafeText style={styles.itemName}>粉丝</SafeText>
                        {calcUnreads('fans') ? (
                            <Badge count={calcUnreads('fans')} />
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
                            source={require('../../assets/images/notification_like.png')}
                        />
                    </View>
                    <View style={styles.itemContent}>
                        <SafeText style={styles.itemName}>赞</SafeText>
                        {calcUnreads('like') ? (
                            <Badge count={calcUnreads('like')} />
                        ) : (
                            <Iconfont name={'right'} size={PxFit(16)} color={Theme.subTextColor} />
                        )}
                    </View>
                </TouchFeedback>
            </PageContainer>
        );
    }
}

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

export default compose(
    graphql(GQL.userUnreadQuery, {
        options: props => ({ variables: { id: app.me.id } }),
        fetchPolicy: 'network-only',
    }),
)(Remind);
