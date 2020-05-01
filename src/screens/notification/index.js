/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:48
 */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { PageContainer, ScrollTab, NavigatorBar, TouchFeedback, Iconfont, Badge } from 'components';

import { useQuery, GQL } from '@src/apollo';
import { observer, app, config } from 'store';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { useNavigation } from 'react-navigation-hooks';
import Remind from './Remind';
import Chats from './Chats';

export default observer(props => {
    const navigation = useNavigation();

    const { data, refetch } = useQuery(GQL.userUnreadQuery, {
        variables: { id: app.me.id },
        fetchPolicy: 'network-only',
    });

    const unreadCount = useMemo(() => {
        const unreadData = Helper.syncGetter('user', data);
        if (unreadData) {
            const system =
                unreadData.unread_notifications_count -
                unreadData.unread_comment_notifications_count -
                unreadData.unread_user_follow_notifications_count -
                unreadData.unread_like_notifications_count -
                unreadData.unread_notices_count -
                unreadData.unread_messages_count;
            return {
                system,
                comment: unreadData.unread_comment_notifications_count,
                fans: unreadData.unread_user_follow_notifications_count,
                like: unreadData.unread_like_notifications_count,
                notice: unreadData.unread_notices_count,
                message: unreadData.unread_messages_count,
            };
        }
        return {};
    }, [data]);

    const renderTabItem = useCallback(
        ({ name, isActive, page }) => {
            const changeTextStyle = isActive ? styles.activeTextStyle : styles.inactivityTextStyle;
            return (
                <View>
                    <Text style={changeTextStyle}>{name}</Text>
                    {page === 1 && (
                        <View style={styles.badge}>
                            <Badge count={unreadCount.message} />
                        </View>
                    )}
                </View>
            );
        },
        [unreadCount],
    );

    return (
        <PageContainer hiddenNavBar contentViewStyle={styles.contentViewStyle} white>
            <ScrollableTabView
                prerenderingSiblingsNumber={Infinity}
                renderTabBar={props => (
                    <ScrollTab
                        {...props}
                        tabWidth={PxFit(80)}
                        underlineWidth={PxFit(16)}
                        underlineStyle={styles.underlineStyle}
                        scrollUnderlineStyle={styles.scrollUnderlineStyle}
                        style={styles.tabBarStyle}
                        renderTabItem={renderTabItem}
                    />
                )}>
                <Remind tabLabel="提醒" unreadCount={unreadCount} />
                <Chats tabLabel="私信" updateUnread={() => refetch()} />
            </ScrollableTabView>
            <View style={styles.backButton}>
                <TouchFeedback activeOpacity={1} onPress={() => navigation.goBack()}>
                    <Iconfont name="left" color={Theme.defaultTextColor} size={PxFit(21)} />
                </TouchFeedback>
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    activeTextStyle: {
        color: Theme.watermelon,
        fontSize: PxFit(17),
    },
    badge: {
        width: PxFit(8),
        height: PxFit(8),
        borderRadius: PxFit(4),
        backgroundColor: Theme.secondaryColor,
        margin: PxFit(4),
    },
    contentViewStyle: { marginTop: Device.statusBarHeight + 10 },
    inactivityTextStyle: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(17),
    },
    tabBarStyle: {
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Device.statusBarHeight,
        height: Device.statusBarHeight,
        justifyContent: 'center',
        paddingLeft: PxFit(Theme.itemSpace),
    },
    underlineStyle: {
        height: PxFit(2),
        backgroundColor: Theme.watermelon,
    },
    scrollUnderlineStyle: {
        left: (Device.WIDTH - PxFit(160)) / 2,
        width: PxFit(160),
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -15,
    },
});
