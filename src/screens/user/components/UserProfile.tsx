import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';

import { Iconfont, FollowButton, Button, TouchFeedback, Row, Avatar } from 'components';

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
            {/* <View style={styles.userCoverContainer}>
                <Image source={require('@src/assets/images/bg_user_cover.png')} style={styles.userCover} />
            </View> */}
            <View style={styles.main}>
                <View>
                    <Avatar source={Helper.syncGetter('avatar', user)} userId={user.id} size={PxFit(90)} />
                    <View
                        style={[
                            styles.badge,
                            { backgroundColor: Helper.syncGetter('gender', user) ? '#FFEAEF' : '#E6F2FF' },
                        ]}>
                        {/* <Iconfont
                            name={Helper.syncGetter('gender', user) ? 'woman' : 'man'}
                            size={PxFit(18)}
                            color={Helper.syncGetter('gender', user) ? '#ED5D87' : '#0588FF'}
                        /> */}
                        <Avatar
                            source={
                                Helper.syncGetter('gender', user)
                                    ? require('@src/assets/images/ic_user_profile_boy.png')
                                    : require('@src/assets/images/ic_user_profile_girl.png')
                            }
                            size={PxFit(22)}
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
                        // <Button
                        //     style={StyleSheet.flatten([styles.button])}
                        //     onPress={() => navigation.navigate('EditProfile', { user })}>
                        //     <Text style={styles.editText}>编辑资料</Text>
                        // </Button>
                        <TouchFeedback onPress={() => navigation.navigate('EditProfile', { user })}>
                            <ImageBackground
                                source={require('@src/assets/images/bt_user_edit.png')}
                                style={styles.button}>
                                <Text style={styles.editText}>编辑资料</Text>
                            </ImageBackground>
                        </TouchFeedback>
                    ) : (
                        <Row style={{ justifyContent: 'space-between' }}>
                            <ImageBackground
                                source={require('@src/assets/images/bg_follow_user.png')}
                                style={{
                                    marginTop: PxFit(15),
                                    width: Device.WIDTH * 0.28,
                                    height: (Device.WIDTH * 0.28) / 3,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <FollowButton
                                    id={user.id}
                                    followedStatus={Helper.syncGetter('followed_user_status', user)}
                                    style={{ backgroundColor: 'transparent' }}
                                    titleStyle={styles.buttonText}
                                />
                            </ImageBackground>
                            <ImageBackground
                                source={require('@src/assets/images/bg_user_message.png')}
                                style={{
                                    marginTop: PxFit(15),
                                    width: Device.WIDTH * 0.28,
                                    height: (Device.WIDTH * 0.28) / 3,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: PxFit(5),
                                }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: 'transparent' }}
                                    onPress={() => navigation.navigate('Chat', { user })}>
                                    <Text style={styles.buttonText}>私信</Text>
                                </TouchableOpacity>
                            </ImageBackground>
                        </Row>
                    )}
                </View>
            </View>
            <View style={styles.bottom}>
                <Row style={{ paddingBottom: PxFit(8) }}>
                    <Text style={{ fontSize: Font(20), fontWeight: '700', color: '#424242' }}>
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
                            style={{ width: PxFit(17), height: PxFit((17 * 75) / 56), marginRight: PxFit(10) }}
                        />
                        <Text style={{ color: '#333333', fontSize: Font(14) }}>ta的勋章</Text>
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
                                                style={{
                                                    width: PxFit(18),
                                                    height: PxFit(18),
                                                    marginRight: PxFit(10),
                                                }}
                                            />
                                        );
                                    }
                                })}
                            </Row>
                        )}

                        <Iconfont name="right" size={Font(13)} color={'#CCCCCC'} />
                    </Row>
                </TouchFeedback>
                {subName !== '普通答友' && (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingTop: PxFit(15),
                        }}>
                        <Image
                            source={require('@src/assets/images/title.png')}
                            style={{
                                height: PxFit(18),
                                width: PxFit(18),
                                marginRight: PxFit(10),
                                marginLeft: PxFit(-1.5),
                            }}
                        />

                        <Text style={{ color: '#333333' }} numberOfLines={1}>
                            {subName}
                        </Text>
                    </View>
                )}
            </View>
            {hasQuestion && (
                <View style={styles.answerTitle}>
                    <Text style={styles.greyText}>{`${Helper.syncGetter('profile.questions_count', user)}道题目`}</Text>
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
    userCoverContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    userCover: {
        width: Device.WIDTH,
        height: (Device.WIDTH * 644) / 1066,
    },
    badge: {
        height: PxFit(25),
        width: PxFit(25),
        borderRadius: PxFit(13),
        borderWidth: PxFit(2),
        borderColor: '#FFF',
        position: 'absolute',
        bottom: PxFit(0),
        right: PxFit(0),
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatButton: {
        flex: 1,
        height: PxFit(32),
        borderRadius: PxFit(16),
        marginTop: PxFit(Theme.itemSpace),
        marginLeft: PxFit(5),
        backgroundColor: '#2FCDFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: Font(15),
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
        alignItems: 'center',
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
        // paddingHorizontal: PxFit(5),
        marginTop: PxFit(5),
    },
    metaCount: {
        fontSize: Font(15),
        color: '#333333',
        fontWeight: '500',
    },
    metaLabel: {
        fontSize: Font(13),
        color: '#979797',
    },
    editText: {
        fontSize: Font(14),
        color: '#623605',
    },
    button: {
        height: PxFit(34),
        width: (PxFit(34) * 580) / 100,
        marginTop: PxFit(Theme.itemSpace),
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottom: {
        marginTop: PxFit(15),
        paddingBottom: PxFit(15),
        // borderBottomWidth: PxFit(0.5),
        // borderColor: Theme.borderColor,
    },
    introduction: {
        fontSize: Font(14),
        color: '#8E8E8E',
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
        color: '#D2D2D2',
    },
    orderText: {
        fontSize: PxFit(13),
        color: Theme.correctColor,
        marginRight: PxFit(4),
    },
});

export default UserProfile;
