import React, { useEffect } from 'react';

import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import {
    PageContainer,
    TouchFeedback,
    Iconfont,
    Row,
    Avatar,
    Badge,
    SafeText,
    beginnerGuidance,
    WithdrawGuidance,
} from '@src/components';

import { GQL, Query, useQuery } from 'apollo';
import { observer, app, config } from 'store';

import { BoxShadow } from 'react-native-shadow';
import { useDetainment } from '@src/common';

interface User {
    name: string;
    avatar: string;
    level: object;
    exp: number;
    next_level_exp: number;
}

const index = observer(props => {
    const { navigation } = props;

    const { data, refetch, loading } = useQuery(GQL.UserQuery, {
        variables: { id: app.me.id },
        fetchPolicy: 'network-only',
    });
    useEffect(() => {
        if (data && data.user) {
            app.updateUserCache(data.user);
        }
    }, [data, refetch, loading]);

    useEffect(() => {
        // 命中
        const navDidFocusListener = props.navigation.addListener('didFocus', () => {
            beginnerGuidance({
                guidanceKey: 'Withdraw',
                GuidanceView: WithdrawGuidance,
                dismissEnabled: true,
            });
        });
        return () => {
            navDidFocusListener.remove();
        };
    }, []);

    useDetainment(navigation);

    const userAdapter = (userInfo: User) => {
        const user = {
            id: -1,
            ...userInfo,
            name: userInfo.name || '求学好问',
            avatar: userInfo.avatar
                ? userInfo.avatar + '?t=' + Date.now()
                : require('@src/assets/images/default_avatar.png'),
            level: userInfo.level || { level: 0, name: '初来乍到' },
            exp: userInfo.exp || 0,
            next_level_exp: userInfo.next_level_exp || 50,
        };
        return user;
    };

    const { login, me, userCache } = app;
    let user = me;
    if (login && userCache) {
        user = userAdapter(userCache);
    } else if (login && data && data.user) {
        data.user.avatar = user.avatar;
        user = data.user;
    } else {
        user = userAdapter(user);
    }

    return (
        <PageContainer hiddenNavBar onWillFocus={refetch}>
            <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, paddingBottom: PxFit(60) }}>
                    <View style={{}}>
                        <View style={styles.userInfoContainer}>
                            <View style={styles.userCoverContainer}>
                                <Image
                                    source={require('@src/assets/images/bg_user_cover.png')}
                                    style={styles.userCover}
                                />
                            </View>
                            <TouchFeedback
                                authenticated
                                navigation={navigation}
                                activeOpacity={1}
                                style={styles.userInfo}
                                onPress={() => navigation.navigate('EditProfile', { user })}>
                                <View style={styles.textInfo}>
                                    <SafeText style={styles.userName} numberOfLines={1}>
                                        {login ? user.name : '登录/注册'}
                                    </SafeText>
                                    <Text style={styles.introduction} numberOfLines={1}>
                                        {login
                                            ? Helper.syncGetter('profile.introduction', user) || '快去完善个人资料吧'
                                            : '欢迎来到' + Config.AppName}
                                    </Text>
                                </View>
                                <TouchFeedback
                                    authenticated
                                    navigation={navigation}
                                    onPress={() => navigation.navigate('User', { user })}>
                                    <Avatar
                                        source={user.avatar + '?t=' + Date.now()}
                                        userId={user.id}
                                        size={PxFit(68)}
                                        style={styles.userAvatar}
                                    />
                                </TouchFeedback>
                                <Iconfont name={'right'} size={Font(13)} color={'#333333'} />
                            </TouchFeedback>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                                <TouchFeedback
                                    navigation={navigation}
                                    onPress={() => navigation.navigate('GradeDescription', { user })}
                                    authenticated
                                    activeOpacity={1}
                                    style={styles.socialCount}>
                                    <SafeText style={styles.metaCount} numberOfLines={1}>
                                        {user.level ? user.level.level : 0}
                                    </SafeText>
                                    <Text style={styles.metaLabel} numberOfLines={1}>
                                        等级
                                    </Text>
                                </TouchFeedback>
                                <TouchFeedback
                                    navigation={navigation}
                                    onPress={() => navigation.navigate('Society')}
                                    authenticated
                                    activeOpacity={1}
                                    style={styles.socialCount}>
                                    <Text style={styles.metaCount} numberOfLines={1}>
                                        {user.follow_users_count || 0}
                                    </Text>
                                    <Text style={styles.metaLabel} numberOfLines={1}>
                                        关注
                                    </Text>
                                </TouchFeedback>
                                <TouchFeedback
                                    navigation={navigation}
                                    onPress={() => navigation.navigate('Society', { follower: true })}
                                    authenticated
                                    activeOpacity={1}
                                    style={styles.socialCount}>
                                    <Text style={styles.metaCount} numberOfLines={1}>
                                        {user.followers_count || 0}
                                    </Text>
                                    <Text style={styles.metaLabel} numberOfLines={1}>
                                        粉丝
                                    </Text>
                                </TouchFeedback>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.metaWrap, styles.metaWrapBottom]}>
                        <TouchFeedback
                            navigation={navigation}
                            authenticated
                            activeOpacity={1}
                            style={styles.metaItem}
                            onPress={() => navigation.navigate('MyPublish')}>
                            <Image
                                style={styles.metaLabelIcon}
                                source={require('@src/assets/images/ic_my_publish.png')}
                            />
                            <Text style={styles.metaIconLabel} numberOfLines={1}>
                                我的发布
                            </Text>
                        </TouchFeedback>
                        <TouchFeedback
                            navigation={navigation}
                            authenticated
                            activeOpacity={1}
                            style={styles.metaItem}
                            onPress={() => navigation.navigate('MyLikes')}>
                            <Image style={styles.metaLabelIcon} source={require('@src/assets/images/ic_my_like.png')} />
                            <Text style={styles.metaIconLabel} numberOfLines={1}>
                                我的点赞
                            </Text>
                        </TouchFeedback>
                        <TouchFeedback
                            navigation={navigation}
                            authenticated
                            activeOpacity={1}
                            style={styles.metaItem}
                            onPress={() => navigation.navigate('AnswerLog')}>
                            <Image
                                style={styles.metaLabelIcon}
                                source={require('@src/assets/images/ic_answer_log.png')}
                            />
                            <Text style={styles.metaIconLabel} numberOfLines={1}>
                                答题记录
                            </Text>
                        </TouchFeedback>

                        <TouchFeedback
                            navigation={navigation}
                            authenticated
                            activeOpacity={1}
                            style={styles.metaItem}
                            onPress={() => navigation.navigate('Medal', { user })}>
                            <Image
                                style={styles.metaLabelIcon}
                                source={require('@src/assets/images/ic_my_medal.png')}
                            />
                            <Text style={styles.metaIconLabel} numberOfLines={1}>
                                我的勋章
                            </Text>
                        </TouchFeedback>
                    </View>

                    {!config.disableAd && (
                        <TouchFeedback
                            style={styles.columnItem}
                            authenticated
                            navigation={navigation}
                            onPress={() => navigation.navigate('Withdraw')}>
                            <Row>
                                <Image style={styles.metaIcon} source={require('@src/assets/images/ic_wallet.png')} />
                                <Text style={styles.itemTypeText}>我的钱包</Text>
                            </Row>
                            <Text style={{ color: '#BEBEBE', fontSize: Font(14) }}>提现入口在这里哦</Text>
                        </TouchFeedback>
                    )}
                    <View style={{ height: PxFit(15) }} />
                    <TouchFeedback
                        style={styles.columnItem}
                        authenticated
                        navigation={navigation}
                        onPress={() => navigation.navigate('Notification')}>
                        <Row>
                            <Image style={styles.metaIcon} source={require('@src/assets/images/ic_notification.png')} />
                            <Text style={styles.itemTypeText}>消息通知</Text>
                        </Row>
                        {login ? (
                            <Query query={GQL.userUnreadQuery} variables={{ id: user.id }} fetchPolicy="network-only">
                                {({ data, refetch }) => {
                                    navigation.addListener('didFocus', () => {
                                        refetch();
                                    });
                                    if (data && data.user && data.user.unread_notifications_count) {
                                        app.updateNoticeCount(data.user.unread_notifications_count);
                                        return <Badge count={data.user.unread_notifications_count} />;
                                    } else {
                                        app.updateNoticeCount(0);
                                        return <Iconfont name="right" size={Font(14)} color={'#C1C1C1'} />;
                                    }
                                }}
                            </Query>
                        ) : (
                            <Iconfont name="right" size={Font(14)} color={'#C1C1C1'} />
                        )}
                    </TouchFeedback>
                    {!config.disableAd && (
                        <TouchFeedback
                            style={styles.columnItem}
                            authenticated
                            navigation={navigation}
                            onPress={() => navigation.navigate('BillingRecord')}>
                            <Row>
                                <Image style={styles.metaIcon} source={require('@src/assets/images/ic_my_order.png')} />
                                <Text style={styles.itemTypeText}>我的账单</Text>
                            </Row>
                            <Iconfont name="right" size={17} color={'#C1C1C1'} />
                        </TouchFeedback>
                    )}
                    <TouchFeedback
                        style={styles.columnItem}
                        authenticated
                        navigation={navigation}
                        onPress={() => navigation.navigate('FavoritesLog')}>
                        <Row>
                            <Image style={styles.metaIcon} source={require('@src/assets/images/ic_my_favorite.png')} />
                            <Text style={styles.itemTypeText}>我的收藏</Text>
                        </Row>
                        <Iconfont name="right" size={Font(14)} color={'#C1C1C1'} />
                    </TouchFeedback>
                    <TouchFeedback
                        style={styles.columnItem}
                        authenticated
                        navigation={navigation}
                        onPress={() => navigation.navigate('Feedback')}>
                        <Row>
                            <Image style={styles.metaIcon} source={require('@src/assets/images/ic_feedback.png')} />
                            <Text style={styles.itemTypeText}>反馈建议</Text>
                        </Row>
                        <Iconfont name="right" size={Font(14)} color={'#C1C1C1'} />
                    </TouchFeedback>

                    {/*
                            <TouchFeedback
                            style={styles.columnItem}
                            onPress={() => {
                                NativeModules.TikTokEntryModule.douyinLogin().then(code => {
                                    console.log('code', code);
                                    app.client
                                        .mutate({
                                            mutation: GQL.OAuthBindMutation,
                                            variables: {
                                                code: code,
                                                oauth_type: 'TIKTOK',
                                            },
                                        })
                                        .then((data: any) => {
                                            console.log('data', data);
                                        })
                                        .catch(err => {
                                            console.log('err', err);
                                        });
                                });
                                // NativeModules.AlipayEntryModule.AlipayAuth().then(data => {
                                //     console.log('data', data);
                                // });
                                // 抖音授权   支付宝授权
                            }}>
                            <Row>
                                <Image style={styles.metaIcon} source={require('@src/assets/images/recruit.png')} />
                                <Text style={styles.itemTypeText}>版主招募</Text>
                            </Row>
                            <Iconfont name="right" size={Font(14)} color={"#C1C1C1"} />
                        </TouchFeedback>
                    */}

                    {/*   {!config.disableAd && (
                        <TouchFeedback style={styles.columnItem} onPress={() => navigation.navigate('MakeMoenyManual')}>
                            <Row>
                                <Image
                                    style={styles.metaIcon}
                                    source={require('@src/assets/images/ic_common_issue.png')}
                                />
                                <Text style={styles.itemTypeText}>赚钱攻略</Text>
                            </Row>
                            <Iconfont name="right" size={Font(14)} color={"#C1C1C1"} />
                        </TouchFeedback>
                    )} */}
                    {!config.disableAd && (
                        <TouchFeedback style={styles.columnItem} onPress={() => navigation.navigate('MakeMoenyManual')}>
                            <Row>
                                <Image
                                    style={styles.metaIcon}
                                    source={require('@src/assets/images/ic_common_issue.png')}
                                />
                                <Text style={styles.itemTypeText}>常见问题</Text>
                            </Row>
                            <Iconfont name="right" size={Font(14)} color={'#C1C1C1'} />
                        </TouchFeedback>
                    )}
                    <TouchFeedback
                        style={styles.columnItem}
                        onPress={__.throttle(() => navigation.navigate('Setting', { user }), 500)}>
                        <Row>
                            <Image style={styles.metaIcon} source={require('@src/assets/images/ic_settings.png')} />
                            <Text style={styles.itemTypeText}>设置</Text>
                        </Row>
                        <Iconfont name="right" size={Font(14)} color={'#C1C1C1'} />
                    </TouchFeedback>
                </View>
            </ScrollView>
        </PageContainer>
    );
});

const shadowOpt = {
    width: Device.WIDTH - Theme.itemSpace * 2,
    color: '#E8E8E8',
    border: PxFit(3),
    radius: PxFit(10),
    opacity: 0.5,
    x: 0,
    y: 1,
    style: {
        marginTop: 0,
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: Theme.groundColour,
    },
    userInfoContainer: {
        padding: Theme.itemSpace,
        paddingTop: PxFit(Device.statusBarHeight + PxFit(50)),
        // backgroundColor: Theme.primaryColor,
    },
    userCoverContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    userCover: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: PxFit(10),
    },
    userAvatar: {
        borderWidth: PxFit(2),
        borderColor: '#fff',
        marginRight: PxFit(10),
    },
    textInfo: {
        flex: 1,
        paddingHorizontal: Theme.itemSpace,
    },
    userName: {
        fontSize: Font(20),
        color: '#424242',
        fontWeight: 'bold',
    },
    introduction: {
        marginTop: PxFit(6),
        fontSize: Font(14),
        color: '#8E8E8E',
    },
    socialCount: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Theme.itemSpace,
        paddingHorizontal: PxFit(15),
        marginRight: PxFit(15),
    },
    metaWrap: {
        flexDirection: 'row',
        alignItems: 'stretch',
        paddingHorizontal: 10,
        // height: PxFit(70),
    },
    metaWrapBottom: {
        backgroundColor: '#fff',
        // height: PxFit(80),
        marginBottom: PxFit(25),
    },
    metaItem: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Theme.itemSpace,
        paddingHorizontal: PxFit(5),
    },
    metaCount: {
        fontSize: Font(15),
        color: '#333333',
        fontWeight: '500',
    },
    metaLabel: {
        fontSize: Font(12),
        color: '#A1A1A1',
    },
    metaIcon: {
        width: PxFit(23),
        height: PxFit(23),
        resizeMode: 'cover',
    },
    metaLabelIcon: {
        width: PxFit(28),
        height: PxFit(28),
        resizeMode: 'cover',
    },
    metaIconLabel: {
        marginTop: PxFit(15),
        fontSize: Font(14),
        color: Theme.defaultTextColor,
        fontWeight: '500',
    },
    columnItem: {
        height: PxFit(60),
        paddingHorizontal: PxFit(20),
        // borderBottomWidth: PxFit(0.5),
        // borderColor: Theme.borderColor,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTypeText: {
        marginLeft: PxFit(15),
        fontSize: Font(16),
        color: Theme.defaultTextColor,
    },
    itemType: {
        width: PxFit(25),
        textAlign: 'center',
        justifyContent: 'center',
        marginRight: PxFit(10),
    },
});

export default index;
