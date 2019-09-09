/*
 * @flow
 * created by wyk made in 2019-03-22 11:55:07
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, ListItem, Avatar, ItemSeparator, TipsOverlay } from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH, Api } from 'utils';

import UserPanel from './components/UserPanel';
import { WeChat } from 'native';

import { app } from 'store';

import { compose, graphql, GQL } from 'apollo';
import { checkLoginInfo } from 'common';

class AccountSecurity extends Component {
    constructor(props) {
        super(props);
        let user = this.props.navigation.getParam('user');
        this.state = {
            is_bind_wechat: user.is_bind_wechat,
        };
    }

    bindWechat = () => {
        WeChat.isSupported()
            .then(isSupported => {
                if (isSupported) {
                    WeChat.wechatLogin().then(code => {
                        var data = new FormData();
                        data.append('code', code);
                        fetch(Config.ServerRoot + '/api/v1/wechat/app/auth', {
                            method: 'POST',
                            body: data,
                        })
                            .then(response => response.json())
                            .then(result => {
                                if (result.data && result.data.unionid) {
                                    this.bindWx(result.data);
                                } else {
                                    Toast.show({
                                        content: '当前登录微信已绑定账号' + result.data.user.account,
                                    });
                                }
                            })

                            .catch(error => {
                                Toast.show({
                                    content: '微信账号获取失败',
                                });
                            });
                    });
                } else {
                    Toast.show({ content: '未安装微信或当前微信版本较低' });
                }
            })
            .catch(() => {
                Toast.show({ content: '绑定失败' });
            });
    };

    bindWx = async data => {
        let result = {};
        try {
            result = await this.props.BindWechatMutation({
                variables: {
                    union_id: data.unionid,
                },
                errorPolicy: 'all',
                refetchQueries: () => [
                    {
                        query: GQL.UserAutoQuery,
                        variables: { id: app.me.id },
                        fetchPolicy: 'network-only',
                    },
                ],
            });
        } catch (ex) {
            result.errors = ex;
        }
        if (result && result.errors) {
            this.setState({
                submitting: false,
            });
            const str = result.errors[0].message;
            Toast.show({ content: str });
        } else {
            this.setState({
                is_bind_wechat: true,
            });
            Toast.show({ content: '绑定成功' });
        }
    };

    checkAccount = (auto_uuid_user, auto_phone_user) => {
        const { navigation } = this.props;
        const user = navigation.getParam('user');

        if (auto_uuid_user || auto_phone_user) {
            TipsOverlay.show({
                title: '您还未完善登录信息',
                content: (
                    <TouchFeedback
                        style={{ alignItems: 'center', paddingTop: 15 }}
                        onPress={() => {
                            navigation.navigate('Share');
                            TipsOverlay.hide();
                        }}>
                        <Text style={{ fontSize: 13, color: Theme.theme }}>完善登录信息后即可绑定支付宝</Text>
                    </TouchFeedback>
                ),
                onConfirm: () => navigation.navigate('SetLoginInfo', { phone: user.account }),
                confirmContent: '去绑定',
            });
        } else {
            navigation.navigate('ModifyAliPay');
        }
    };

    render() {
        const { navigation, data } = this.props;
        const { is_bind_wechat } = this.state;
        const { loading, user } = data;

        if (loading) {
            return null;
        }
        let auto_uuid_user = false;
        let auto_phone_user = false;

        if (data && data.user) {
            auto_uuid_user = data.user.auto_uuid_user;
            auto_phone_user = data.user.auto_phone_user;
        }
        return (
            <PageContainer title="账号与安全" white loading={!user}>
                <View style={styles.container}>
                    <ItemSeparator />
                    <UserPanel user={user} />
                    <ListItem
                        disabled
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>{auto_uuid_user ? '访客' : '账号'}</Text>}
                        rightComponent={
                            <Text style={styles.rightText}>{auto_uuid_user ? '未设置手机号' : user.account}</Text>
                        }
                    />
                    {auto_uuid_user && (
                        <ListItem
                            onPress={() => navigation.navigate('SetLoginInfo', { account: null })}
                            style={styles.listItem}
                            leftComponent={<Text style={styles.itemText}>设置手机/密码</Text>}
                            rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
                        />
                    )}

                    {auto_phone_user && (
                        <ListItem
                            onPress={() => navigation.navigate('SetLoginInfo', { phone: user.account })}
                            style={styles.listItem}
                            leftComponent={<Text style={styles.itemText}>设置密码</Text>}
                            rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
                        />
                    )}
                    {!auto_uuid_user && !auto_phone_user && (
                        <ListItem
                            onPress={() => navigation.navigate('ModifyPassword')}
                            style={styles.listItem}
                            leftComponent={<Text style={styles.itemText}>修改密码</Text>}
                            rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
                        />
                    )}

                    <ItemSeparator />
                    <ListItem
                        onPress={() => {
                            if (is_bind_wechat) {
                                Toast.show({
                                    content: '已绑定微信',
                                });
                            } else {
                                this.bindWechat();
                            }
                        }}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>微信账号</Text>}
                        rightComponent={
                            <View style={styles.rightWrap}>
                                <Text style={styles.linkText}>{is_bind_wechat ? '已绑定' : '去绑定'}</Text>
                                <Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />
                            </View>
                        }
                    />
                    <ListItem
                        onPress={() => {
                            if (user.wallet && user.wallet.pay_info_change_count === -1) {
                                Toast.show({ content: '支付宝信息更改次数已达上限' });
                            } else {
                                checkLoginInfo(auto_uuid_user, auto_phone_user, navigation, user);
                            }
                        }}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>支付宝账号</Text>}
                        rightComponent={
                            user.wallet && user.wallet.pay_account ? (
                                <View style={styles.rightWrap}>
                                    <Text style={styles.rightText}>
                                        {user.wallet.pay_account + '(' + user.wallet.real_name + ')'}
                                    </Text>
                                    <Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />
                                </View>
                            ) : (
                                <View style={styles.rightWrap}>
                                    <Text style={styles.linkText}>去绑定</Text>
                                    <Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />
                                </View>
                            )
                        }
                    />
                </View>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    userPanel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: PxFit(80),
        borderBottomWidth: PxFit(1),
        borderBottomColor: Theme.borderColor,
    },
    panelLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    panelContent: {
        height: 34,
        justifyContent: 'space-between',
        marginLeft: 15,
    },
    userLevel: {
        fontSize: 12,
        color: Theme.subTextColor,
        fontWeight: '300',
        paddingTop: 3,
    },
    listItem: {
        height: PxFit(50),
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.borderColor,
        paddingHorizontal: PxFit(Theme.itemSpace),
    },
    itemText: {
        fontSize: PxFit(15),
        color: Theme.defaultTextColor,
        marginRight: PxFit(15),
    },
    rightText: {
        fontSize: PxFit(15),
        color: Theme.subTextColor,
    },
    rightWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkText: {
        fontSize: PxFit(15),
        color: '#407FCF',
        marginRight: PxFit(6),
    },
    avatarTip: {
        marginVertical: PxFit(15),
        fontSize: PxFit(13),
        color: Theme.subTextColor,
    },
    fieldGroup: {
        marginBottom: PxFit(30),
        paddingHorizontal: Theme.itemSpace,
    },
    field: {
        fontSize: PxFit(14),
        color: '#666',
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: PxFit(1),
        borderBottomColor: Theme.borderColor,
    },
    inputStyle: {
        flex: 1,
        fontSize: PxFit(15),
        color: Theme.defaultTextColor,
        paddingVertical: PxFit(10),
        marginTop: PxFit(6),
    },
    genderGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        width: PxFit(100),
    },
    genderItem: { width: PxFit(20), height: PxFit(20), marginRight: PxFit(8) },
});

export default compose(
    graphql(GQL.BindWechatMutation, { name: 'BindWechatMutation' }),
    graphql(GQL.UserAutoQuery, { options: props => ({ variables: { id: props.navigation.state.params.user.id } }) }),
)(AccountSecurity);
