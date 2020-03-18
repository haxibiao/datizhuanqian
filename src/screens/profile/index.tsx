import React, { useEffect } from 'react';

import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, Avatar, Badge, SafeText } from '../../components';
import { Config, Theme, PxFit, SCREEN_WIDTH } from 'utils';
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
    });
    useEffect(() => {
        if (data && data.user) {
            app.updateUserCache(data.user);
        }
    }, [data, refetch, loading]);

    useDetainment(navigation);

    const userAdapter = (userInfo: User) => {
        const user = {
            id: -1,
            ...userInfo,
            name: userInfo.name || '求学好问',
            avatar: userInfo.avatar
                ? userInfo.avatar + '?t=' + Date.now()
                : require('../../assets/images/default_avatar.png'),
            level: userInfo.level || { level: 0, name: '初来乍到' },
            exp: userInfo.exp || 0,
            next_level_exp: userInfo.next_level_exp || 50,
        };
        return user;
    };

    const { login, me, userCache } = app;
    let user = me;

    if (login && data && data.user) {
        data.user.avatar = user.avatar;
        user = data.user;
    } else if (login && userCache) {
        user = userAdapter(userCache);
    } else {
        user = userAdapter(user);
    }

    return (
        <PageContainer hiddenNavBar onWillFocus={data && data.refetch}>
            <ScrollView style={styles.container} bounces={false}>
                <View style={{ flex: 1, paddingBottom: PxFit(50) }}>
                    <View style={{ marginBottom: -Theme.itemSpace }}>
                        <View style={styles.userInfoContainer}>
                            <View style={styles.userCoverContainer}>
                                <Image
                                    source={require('../../assets/images/user_cover.png')}
                                    style={styles.userCover}
                                />
                            </View>
                            <TouchFeedback
                                authenticated
                                navigation={navigation}
                                activeOpacity={1}
                                style={styles.userInfo}
                                onPress={() => navigation.navigate('EditProfile', { user })}>
                                <TouchFeedback
                                    authenticated
                                    navigation={navigation}
                                    onPress={() => navigation.navigate('User', { user })}>
                                    <Avatar
                                        source={user.avatar + '?t=' + Date.now()}
                                        userId={user.id}
                                        size={PxFit(60)}
                                        style={styles.userAvatar}
                                    />
                                </TouchFeedback>
                                <View style={styles.textInfo}>
                                    <SafeText style={styles.userName} numberOfLines={1}>
                                        {login ? user.name : '登录/注册'}
                                    </SafeText>
                                    <Text style={styles.introduction} numberOfLines={1}>
                                        {login
                                            ? Tools.syncGetter('profile.introduction', user) || '快去完善个人资料吧'
                                            : '欢迎来到' + Config.AppName}
                                    </Text>
                                </View>
                                <Iconfont name={'right'} size={PxFit(20)} color={'#fff'} />
                            </TouchFeedback>
                            <View style={styles.metaWrap}>
                                <TouchFeedback
                                    navigation={navigation}
                                    onPress={() => navigation.navigate('GradeDescription', { user })}
                                    authenticated
                                    activeOpacity={1}
                                    style={styles.metaItem}>
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
                                    style={styles.metaItem}>
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
                                    style={styles.metaItem}>
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
                    <View style={{ paddingHorizontal: Theme.itemSpace, marginBottom: Theme.itemSpace }}>
                        <BoxShadow
                            setting={Object.assign({}, shadowOpt, {
                                height: PxFit(80),
                            })}>
                            <View style={[styles.metaWrap, styles.metaWrapBottom]}>
                                <TouchFeedback
                                    navigation={navigation}
                                    authenticated
                                    activeOpacity={1}
                                    style={styles.metaItem}
                                    onPress={() => navigation.navigate('MyPublish')}>
                                    <Image
                                        style={styles.metaIcon}
                                        source={require('../../assets/images/profile_make_question.png')}
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
                                    onPress={() => navigation.navigate('FavoritesLog')}>
                                    <Image
                                        style={styles.metaIcon}
                                        source={require('../../assets/images/profile_collection.png')}
                                    />
                                    <Text style={styles.metaIconLabel} numberOfLines={1}>
                                        我的收藏
                                    </Text>
                                </TouchFeedback>
                                <TouchFeedback
                                    navigation={navigation}
                                    authenticated
                                    activeOpacity={1}
                                    style={styles.metaItem}
                                    onPress={() => navigation.navigate('AnswerLog')}>
                                    <Image
                                        style={styles.metaIcon}
                                        source={require('../../assets/images/profile_answer_history.png')}
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
                                        style={{
                                            width: PxFit(19),
                                            height: PxFit((19 * 140) / 109),
                                            resizeMode: 'cover',
                                            paddingTop: PxFit(4),
                                        }}
                                        source={require('../../assets/images/medal_icon.png')}
                                    />
                                    <Text style={styles.metaIconLabel} numberOfLines={1}>
                                        我的勋章
                                    </Text>
                                </TouchFeedback>
                            </View>
                        </BoxShadow>
                    </View>
                    <TouchFeedback
                        style={styles.columnItem}
                        authenticated
                        navigation={navigation}
                        onPress={() => navigation.navigate('Notification')}>
                        <Row>
                            <Image
                                style={styles.metaIcon}
                                source={require('../../assets/images/profile_notification.png')}
                            />
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
                                        return <Iconfont name="right" size={PxFit(17)} color={Theme.subTextColor} />;
                                    }
                                }}
                            </Query>
                        ) : (
                            <Iconfont name="right" size={PxFit(17)} color={Theme.subTextColor} />
                        )}
                    </TouchFeedback>
                    {!config.disableAd && (
                        <TouchFeedback
                            style={styles.columnItem}
                            authenticated
                            navigation={navigation}
                            onPress={() => navigation.navigate('BillingRecord')}>
                            <Row>
                                <Image
                                    style={styles.metaIcon}
                                    source={require('../../assets/images/profile_order.png')}
                                />
                                <Text style={styles.itemTypeText}>我的账单</Text>
                            </Row>
                            <Iconfont name="right" size={17} color={Theme.subTextColor} />
                        </TouchFeedback>
                    )}
                    <TouchFeedback
                        style={styles.columnItem}
                        authenticated
                        navigation={navigation}
                        onPress={() => navigation.navigate('Feedback')}>
                        <Row>
                            <Image
                                style={styles.metaIcon}
                                source={require('../../assets/images/profile_feedback.png')}
                            />
                            <Text style={styles.itemTypeText}>反馈建议</Text>
                        </Row>
                        <Iconfont name="right" size={PxFit(17)} color={Theme.subTextColor} />
                    </TouchFeedback>
                    <View style={{ height: 10 }} />

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
                                <Image style={styles.metaIcon} source={require('../../assets/images/recruit.png')} />
                                <Text style={styles.itemTypeText}>版主招募</Text>
                            </Row>
                            <Iconfont name="right" size={PxFit(17)} color={Theme.subTextColor} />
                        </TouchFeedback>
                    */}

                    {!config.disableAd && (
                        <TouchFeedback style={styles.columnItem} onPress={() => navigation.navigate('MakeMoenyManual')}>
                            <Row>
                                <Image
                                    style={styles.metaIcon}
                                    source={require('../../assets/images/profile_explain.png')}
                                />
                                <Text style={styles.itemTypeText}>赚钱攻略</Text>
                            </Row>
                            <Iconfont name="right" size={PxFit(17)} color={Theme.subTextColor} />
                        </TouchFeedback>
                    )}
                    {!config.disableAd && (
                        <TouchFeedback style={styles.columnItem} onPress={() => navigation.navigate('CommonIssue')}>
                            <Row>
                                <Image
                                    style={styles.metaIcon}
                                    source={require('../../assets/images/profile_help.png')}
                                />
                                <Text style={styles.itemTypeText}>常见问题</Text>
                            </Row>
                            <Iconfont name="right" size={PxFit(17)} color={Theme.subTextColor} />
                        </TouchFeedback>
                    )}
                    <TouchFeedback
                        style={styles.columnItem}
                        onPress={__.throttle(() => navigation.navigate('Setting', { user }), 500)}>
                        <Row>
                            <Image
                                style={styles.metaIconRank}
                                source={require('../../assets/images/profile_setting.png')}
                            />
                            <Text style={styles.itemTypeText}>设置</Text>
                        </Row>
                        <Iconfont name="right" size={PxFit(17)} color={Theme.subTextColor} />
                    </TouchFeedback>
                </View>
            </ScrollView>
        </PageContainer>
    );
});

const shadowOpt = {
    width: SCREEN_WIDTH - Theme.itemSpace * 2,
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
        backgroundColor: Theme.groundColour,
    },
    userInfoContainer: {
        padding: Theme.itemSpace,
        paddingTop: PxFit(Theme.statusBarHeight + 20),
        backgroundColor: Theme.primaryColor,
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
    },
    userAvatar: {
        borderWidth: PxFit(2),
        borderColor: '#fff',
    },
    textInfo: {
        flex: 1,
        paddingHorizontal: Theme.itemSpace,
    },
    userName: {
        fontSize: PxFit(17),
        color: '#fff',
        fontWeight: '500',
    },
    introduction: {
        marginTop: PxFit(8),
        fontSize: PxFit(13),
        color: '#fff',
    },
    metaWrap: {
        flexDirection: 'row',
        alignItems: 'stretch',
        paddingHorizontal: 10,
        height: PxFit(70),
    },
    metaWrapBottom: {
        backgroundColor: '#fff',
        borderRadius: PxFit(10),
        height: PxFit(80),
    },
    metaItem: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Theme.itemSpace,
        paddingHorizontal: PxFit(5),
    },
    metaCount: {
        fontSize: PxFit(15),
        color: '#fff',
        fontWeight: '500',
    },
    metaLabel: {
        fontSize: PxFit(13),
        color: '#fff',
    },
    metaIcon: {
        width: PxFit(25),
        height: PxFit(25),
        resizeMode: 'cover',
    },
    metaIconRank: {
        width: PxFit(24),
        height: PxFit(24),
        resizeMode: 'cover',
    },
    metaIconLabel: {
        fontSize: PxFit(12),
        color: Theme.defaultTextColor,
    },
    columnItem: {
        height: PxFit(52),
        paddingHorizontal: PxFit(Theme.itemSpace),
        borderBottomWidth: PxFit(0.5),
        borderColor: Theme.borderColor,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTypeText: {
        marginLeft: PxFit(10),
        fontSize: PxFit(15),
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
