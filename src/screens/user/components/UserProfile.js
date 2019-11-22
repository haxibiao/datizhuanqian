/*
 * @flow
 * created by wyk made in 2019-03-29 16:45:06
 */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';

import { Avatar, Iconfont, FollowButton, Button, TouchFeedback, Row } from 'components';
import { Theme, PxFit, Tools } from 'utils';

import { Query, ApolloClient, withApollo } from 'react-apollo';
import { StackActions } from 'react-navigation';
import { app } from 'store';

class UserProfile extends Component {
    navigationAction = (bool: false) => {
        let { user } = this.props;
        return StackActions.push({
            routeName: 'UserSociety',
            params: {
                user,
                follower: bool,
            },
        });
    };

    construct = user => {
        console.log('user', user.roles);
        if (user.roles.indexOf('ROOT_USER') >= 0) {
            this.sub_name = '答题赚钱 官方账号';
        } else if (user.roles.indexOf('EDITOR_USER') >= 0) {
            this.sub_name = '答题赚钱 官方小编';
        } else if (user.roles.indexOf('STAR_USER') >= 0) {
            this.sub_name = '优质内容作者';
        } else if (user.roles.indexOf('MODERATOR_USER') >= 0) {
            this.sub_name = '答题版主';
        } else if (user.roles.indexOf('NORMAL_USER') >= 0) {
            this.sub_name = '普通答友';
        } else {
            this.sub_name = '普通答友';
        }
    };

    render() {
        let { user, orderByHot, switchOrder, hasQuestion, navigation, isPost } = this.props;
        let isSelf = app.me.id === user.id;

        if (user && user.roles) {
            this.construct(user);
        } else {
            this.sub_name = '普通答友';
        }

        return (
            <View style={styles.userInfoContainer}>
                <View style={styles.main}>
                    <Avatar source={user.avatar} size={PxFit(90)} style={styles.userAvatar} />
                    <View style={styles.userInfo}>
                        <View style={styles.metaWrap}>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaCount} numberOfLines={1}>
                                    {user.level ? user.level.level : 0}
                                </Text>
                                <Text style={styles.metaLabel} numberOfLines={1}>
                                    等级
                                </Text>
                            </View>
                            <TouchFeedback
                                style={styles.metaItem}
                                onPress={() => navigation.dispatch(this.navigationAction())}>
                                <Text style={styles.metaCount} numberOfLines={1}>
                                    {user.follow_users_count || 0}
                                </Text>
                                <Text style={styles.metaLabel} numberOfLines={1}>
                                    关注
                                </Text>
                            </TouchFeedback>
                            <TouchFeedback
                                style={styles.metaItem}
                                onPress={() => navigation.dispatch(this.navigationAction(true))}>
                                <Text style={styles.metaCount} numberOfLines={1}>
                                    {user.followers_count || 0}
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
                            <FollowButton
                                id={user.id}
                                followedStatus={user.followed_user_status}
                                style={styles.button}
                                titleStyle={{ fontSize: PxFit(15), letterSpacing: 5 }}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.bottom}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            // marginLeft: -6,
                            paddingBottom: 10,
                        }}>
                        {this.sub_name !== '普通答友' && (
                            <Image
                                source={require('../../../assets/images/admin.png')}
                                style={{ height: PxFit(13), width: PxFit(13), marginRight: PxFit(5) }}
                            />
                        )}
                        <Text style={styles.introduction} numberOfLines={1}>
                            {this.sub_name}
                        </Text>
                    </View>

                    {user && user.profile && user.profile.sub_name ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -6, paddingBottom: 10 }}>
                            <Image
                                source={require('../../../assets/images/official.png')}
                                style={{ height: PxFit(13), width: PxFit(13), marginHorizontal: PxFit(5) }}
                            />
                            <Text style={styles.introduction} numberOfLines={1}>
                                {user.profile.sub_name}
                            </Text>
                        </View>
                    ) : null}

                    <View>
                        <Text style={styles.introduction} numberOfLines={2}>
                            {(user && user.profile && user.profile.introduction) || '这个人很神秘，什么介绍都没有'}
                        </Text>
                    </View>
                </View>
                {hasQuestion && (
                    <View style={styles.answerTitle}>
                        <Text style={styles.greyText}>{`题目 ${Tools.syncGetter(
                            'profile.questions_count',
                            user,
                        )}`}</Text>
                        <TouchFeedback onPress={switchOrder} style={{ paddingVertical: PxFit(5) }}>
                            <Row>
                                <Text style={[styles.orderText, orderByHot && { color: Theme.secondaryColor }]}>
                                    {orderByHot ? '热门' : '最新'}
                                </Text>
                                <Iconfont
                                    name='sort'
                                    size={PxFit(15)}
                                    style={{ marginTop: PxFit(1) }}
                                    color={orderByHot ? Theme.secondaryColor : Theme.correctColor}
                                />
                            </Row>
                        </TouchFeedback>
                    </View>
                )}
                {isPost && (
                    <View style={styles.answerTitle}>
                        <Text style={styles.greyText}>{`视频 ${Tools.syncGetter('profile.posts_count', user) ||
                            0}`}</Text>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    userInfoContainer: {
        padding: PxFit(Theme.itemSpace),
        paddingBottom: PxFit(10),
        backgroundColor: '#fff',
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
        marginTop: PxFit(20),
        paddingBottom: PxFit(10),
        borderBottomWidth: PxFit(0.5),
        borderColor: Theme.borderColor,
    },
    introduction: {
        fontSize: PxFit(13),
        color: Theme.defaultTextColor,
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
