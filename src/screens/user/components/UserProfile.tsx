import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';

import { Avatar, Iconfont, FollowButton, Button, TouchFeedback, Row } from 'components';

import { app } from 'store';
import { getRole } from 'common';
import { useQuery, GQL } from 'apollo';

const UserProfile = props => {
    const { user, orderByHot, switchOrder, isQuestion, navigation, hasQuestion } = props;
    const isSelf = app.me.id === user.id;

    const navigationAction = () => {
        navigation.navigate('Medal', { user, medals: data.medals });
    };

    const { data, loading, error } = useQuery(GQL.MedalsQuery, {
        variables: {
            user_id: user.id,
        },
        fetchPolicy: 'network-only',
    });

    const subName = Helper.userTitle(user);

    const showMedal = !loading && !error;

    return (
        <View style={styles.userInfoContainer}>
            <View style={styles.main}>
                <View>
                    <Avatar source={Helper.syncGetter('avatar', user)} userId={user.id} size={PxFit(90)} />
                    <View
                        style={[
                            styles.badge,
                            { backgroundColor: Helper.syncGetter('gender', user) ? '#FFEAEF' : '#E6F2FF' },
                        ]}>
                        <Iconfont
                            name={Helper.syncGetter('gender', user) ? 'woman' : 'man'}
                            size={PxFit(18)}
                            color={Helper.syncGetter('gender', user) ? '#ED5D87' : '#0588FF'}
                        />
                    </View>
                </View>
                <View style={styles.userInfo}>
                    <View style={styles.metaWrap}>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaCount} numberOfLines={1}>
                                {isQuestion
                                    ? Helper.syncGetter('profile.questions_count', user)
                                    : Helper.syncGetter('profile.posts_count', user)}
                            </Text>
                            <Text style={styles.metaLabel} numberOfLines={1}>
                                {isQuestion ? '题目' : '动态'}
                            </Text>
                        </View>
                        <TouchFeedback style={styles.metaItem}>
                            <Text style={styles.metaCount} numberOfLines={1}>
                                {Helper.syncGetter('follow_users_count', user) || 0}
                            </Text>
                            <Text style={styles.metaLabel} numberOfLines={1}>
                                关注
                            </Text>
                        </TouchFeedback>
                        <TouchFeedback style={styles.metaItem}>
                            <Text style={styles.metaCount} numberOfLines={1}>
                                {Helper.syncGetter('followers_count', user) || 0}
                            </Text>
                            <Text style={styles.metaLabel} numberOfLines={1}>
                                粉丝
                            </Text>
                        </TouchFeedback>
                    </View>
                    {isSelf ? (
                        <Button
                            style={StyleSheet.flatten([styles.button, { borderWidth: PxFit(1) }])}
                            onPress={() => navigation.navigate('EditProfile', { user })}>
                            <Text style={styles.editText}>编辑资料</Text>
                        </Button>
                    ) : (
                        <Row>
                            <FollowButton
                                id={user.id}
                                followedStatus={Helper.syncGetter('followed_user_status', user)}
                                style={StyleSheet.flatten([styles.button, { flex: 1, marginRight: PxFit(5) }])}
                                titleStyle={styles.buttonText}
                            />
                            <TouchableOpacity
                                style={styles.chatButton}
                                onPress={() => navigation.navigate('Chat', { user })}>
                                <Text style={styles.buttonText}>私信</Text>
                            </TouchableOpacity>
                        </Row>
                    )}
                </View>
            </View>
            <View style={styles.bottom}>
                <Row style={{ paddingBottom: 10 }}>
                    <Text style={{ fontSize: PxFit(20), fontWeight: '700', color: Theme.black }}>
                        {Helper.syncGetter('name', user)}
                    </Text>
                    {(subName === '官方账号' || subName === '官方小编') && (
                        <Image
                            source={require('@src/assets/images/admin.png')}
                            style={{ height: PxFit(15), width: PxFit(15), marginLeft: PxFit(10) }}
                        />
                    )}
                </Row>
                <View>
                    <Text style={styles.introduction} numberOfLines={2}>
                        {Helper.syncGetter('profile.introduction', user) || '这个人很神秘，什么介绍都没有'}
                    </Text>
                </View>
            </View>
            <View style={styles.bottom}>
                <TouchFeedback
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                    onPress={navigationAction}>
                    <Row>
                        <Image
                            source={require('@src/assets/images/medal.png')}
                            style={{ width: 14, height: 75 / 4, marginRight: PxFit(10) }}
                        />
                        <Text>他的勋章</Text>
                    </Row>
                    <Row>
                        {showMedal && (
                            <Row>
                                {data.medals.map((medal, index) => {
                                    if (medal.owned) {
                                        return (
                                            <Image
                                                key={index}
                                                source={{ uri: medal.done_icon_url }}
                                                style={{ width: PxFit(18), height: PxFit(18), marginRight: PxFit(10) }}
                                            />
                                        );
                                    }
                                })}
                            </Row>
                        )}

                        <Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />
                    </Row>
                </TouchFeedback>
                {subName !== '普通答友' && (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingTop: PxFit(10),
                        }}>
                        <Image
                            source={require('@src/assets/images/title.png')}
                            style={{
                                height: PxFit(16),
                                width: PxFit(16),
                                marginRight: PxFit(10),
                                marginLeft: PxFit(-1.5),
                            }}
                        />

                        <Text style={{ color: '#8590A6' }} numberOfLines={1}>
                            {subName}
                        </Text>
                    </View>
                )}
            </View>
            {hasQuestion && (
                <View style={styles.answerTitle}>
                    <Text style={styles.greyText}>{`题目`}</Text>
                    <TouchFeedback onPress={switchOrder} style={{ paddingVertical: PxFit(5) }}>
                        <Row>
                            <Text style={[styles.orderText, orderByHot && { color: Theme.secondaryColor }]}>
                                {orderByHot ? '热门' : '最新'}
                            </Text>
                            <Iconfont
                                name="sort"
                                size={PxFit(15)}
                                style={{ marginTop: PxFit(1) }}
                                color={orderByHot ? Theme.secondaryColor : Theme.correctColor}
                            />
                        </Row>
                    </TouchFeedback>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    userInfoContainer: {
        padding: PxFit(Theme.itemSpace),
        paddingBottom: PxFit(0),
        backgroundColor: '#fff',
    },
    badge: {
        height: PxFit(26),
        width: PxFit(26),
        borderRadius: PxFit(13),
        borderWidth: PxFit(2),
        borderColor: '#FFF',
        position: 'absolute',
        bottom: PxFit(-2),
        right: PxFit(-2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatButton: {
        flex: 1,
        height: PxFit(32),
        borderRadius: PxFit(16),
        marginTop: PxFit(Theme.itemSpace),
        marginLeft: PxFit(5),
        backgroundColor: Theme.watermelon,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: PxFit(15),
        color: '#fff',
        letterSpacing: 3,
    },
    main: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
        marginLeft: PxFit(30),
    },
    metaWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        maxHeight: PxFit(60),
    },
    metaItem: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: PxFit(5),
        marginTop: PxFit(5),
    },
    metaCount: {
        fontSize: PxFit(15),
        color: Theme.defaultTextColor,
        fontWeight: '500',
    },
    metaLabel: {
        fontSize: PxFit(13),
        color: Theme.defaultTextColor,
    },
    editText: {
        fontSize: PxFit(15),
        color: Theme.primaryColor,
    },
    button: {
        height: PxFit(32),
        borderRadius: PxFit(16),
        marginTop: PxFit(Theme.itemSpace),
    },
    bottom: {
        marginTop: PxFit(15),
        paddingBottom: PxFit(15),
        borderBottomWidth: PxFit(0.5),
        borderColor: Theme.borderColor,
    },
    introduction: {
        fontSize: PxFit(14),
        color: Theme.subTextColor,
    },
    labels: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    label: {
        marginTop: PxFit(10),
        marginRight: PxFit(10),
        // paddingTop: PxFit(1),
        paddingHorizontal: PxFit(4),
        height: PxFit(24),
        minWidth: PxFit(36),
        borderWidth: PxFit(1),
        borderColor: Theme.borderColor,
        borderRadius: PxFit(15),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelText: {
        fontSize: PxFit(11),
        lineHeight: PxFit(12),
        color: Theme.defaultTextColor,
    },
    answerTitle: {
        marginTop: PxFit(5),
        paddingTop: PxFit(4),

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    greyText: {
        fontSize: PxFit(13),
        color: Theme.subTextColor,
    },
    orderText: {
        fontSize: PxFit(13),
        color: Theme.correctColor,
        marginRight: PxFit(4),
    },
});

export default UserProfile;
