/*
 * @flow
 * created by wyk made in 2019-03-22 11:55:07
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PageContainer, Iconfont, ListItem, ItemSeparator } from 'components';
import { Theme, PxFit, ISIOS } from 'utils';

import UserPanel from './components/UserPanel';

import { compose, graphql, GQL } from 'apollo';
import { getAuthCode } from 'common';
import DeviceInfo from 'react-native-device-info';
class AccountSecurity extends Component {
    constructor(props) {
        super(props);
        const user = this.props.navigation.getParam('user');
        this.state = {
            is_bind_wechat: Helper.syncGetter('wallet.platforms.wechat', user),
            is_bind_alipay: Helper.syncGetter('wallet.bind_platforms.alipay', user),
            is_bind_dongdezhuan: Helper.syncGetter('is_bind_dongdezhuan', user) || false,
            is_bind_damei: Helper.syncGetter('is_bind_damei', user) || false,
            dameiUser: Helper.syncGetter('dameiUser', user) || {},
            dongdezhuanUser: Helper.syncGetter('dongdezhuanUser', user) || {},
        };
    }

    handlerBindWechat = () => {
        if (this.state.is_bind_wechat) {
            Toast.show({
                content: '已绑定微信',
            });
        } else {
            this.setState({
                submitting: true,
            });
            getAuthCode({
                onSuccess: this.onSuccess,
                onFailed: this.onFailed,
            });
        }
    };

    onSuccess = () => {
        Toast.show({
            content: '绑定成功',
        });
        this.setState({
            submitting: false,
        });
        this.setState({
            is_bind_wechat: true,
        });
    };

    onFailed = () => {
        this.setState({
            submitting: false,
        });
    };

    render() {
        const { navigation, data } = this.props;
        const { is_bind_wechat, is_bind_alipay, is_bind_dongdezhuan, dongdezhuanUser, dameiUser } = this.state;
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

        console.log('user', user);

        const SystemVersion = DeviceInfo.getSystemVersion();
        const Brand = DeviceInfo.getBrand();
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
                            <Text style={styles.rightText}>
                                {auto_uuid_user ? '未设置手机号' : user && user.account}
                            </Text>
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
                    {!ISIOS && (
                        <ListItem
                            onPress={this.handlerBindWechat}
                            style={styles.listItem}
                            leftComponent={<Text style={styles.itemText}>微信账号</Text>}
                            rightComponent={
                                <View style={styles.rightWrap}>
                                    <Text style={[styles.linkText, { color: is_bind_wechat ? Theme.grey : '#407FCF' }]}>
                                        {is_bind_wechat ? '已绑定' : '去绑定'}
                                    </Text>
                                    <Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />
                                </View>
                            }
                        />
                    )}
                    <ListItem
                        onPress={() => {
                            if (user.wallet && user.wallet.pay_info_change_count === -1) {
                                Toast.show({ content: '支付宝信息更改次数已达上限' });
                            } else {
                                Helper.middlewareNavigate('SettingWithdrawInfo');
                            }
                        }}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>支付宝账号</Text>}
                        rightComponent={
                            <View style={styles.rightWrap}>
                                <Text style={[styles.linkText, { color: is_bind_alipay ? Theme.grey : '#407FCF' }]}>
                                    {is_bind_alipay
                                        ? `已绑定（${Helper.syncGetter('wallet.real_name', user)}）`
                                        : '去绑定'}
                                </Text>
                                <Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />
                            </View>
                        }
                    />
                    {!(SystemVersion == '10' && Brand == 'huawei') && (
                        <ListItem
                            onPress={this.handlerBindDongdezhuan}
                            style={styles.listItem}
                            leftComponent={<Text style={styles.itemText}>答妹账号</Text>}
                            rightComponent={
                                <View style={styles.rightWrap}>
                                    <Text style={dameiUser ? styles.rightText : styles.linkText}>
                                        {dameiUser ? `已绑定(${dameiUser.name})` : '去绑定'}
                                    </Text>
                                    <Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />
                                </View>
                            }
                        />
                    )}
                    {!(SystemVersion == '10' && Brand == 'huawei') && (
                        <ListItem
                            onPress={this.handlerBindDongdezhuan}
                            style={styles.listItem}
                            leftComponent={<Text style={styles.itemText}>懂得赚账号</Text>}
                            rightComponent={
                                <View style={styles.rightWrap}>
                                    <Text style={is_bind_dongdezhuan ? styles.rightText : styles.linkText}>
                                        {is_bind_dongdezhuan ? `已绑定(${dongdezhuanUser.name})` : '去绑定'}
                                    </Text>
                                    <Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />
                                </View>
                            }
                        />
                    )}
                </View>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    avatarTip: {
        marginVertical: PxFit(15),
        fontSize: PxFit(13),
        color: Theme.subTextColor,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    field: {
        fontSize: PxFit(14),
        color: '#666',
    },
    fieldGroup: {
        marginBottom: PxFit(30),
        paddingHorizontal: Theme.itemSpace,
    },
    genderGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        width: PxFit(100),
    },
    genderItem: { width: PxFit(20), height: PxFit(20), marginRight: PxFit(8) },
    inputStyle: {
        flex: 1,
        fontSize: PxFit(15),
        color: Theme.defaultTextColor,
        paddingVertical: PxFit(10),
        marginTop: PxFit(6),
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: PxFit(1),
        borderBottomColor: Theme.borderColor,
    },
    itemText: {
        fontSize: PxFit(15),
        color: Theme.defaultTextColor,
        marginRight: PxFit(15),
    },
    linkText: {
        fontSize: PxFit(15),
        color: '#407FCF',
        marginRight: PxFit(6),
    },
    listItem: {
        height: PxFit(50),
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.borderColor,
        paddingHorizontal: PxFit(Theme.itemSpace),
    },
    panelContent: {
        height: 34,
        justifyContent: 'space-between',
        marginLeft: 15,
    },
    panelLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightText: {
        fontSize: PxFit(15),
        color: Theme.subTextColor,
    },
    rightWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userLevel: {
        fontSize: 12,
        color: Theme.subTextColor,
        fontWeight: '300',
        paddingTop: 3,
    },
    userPanel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: PxFit(80),
        borderBottomWidth: PxFit(1),
        borderBottomColor: Theme.borderColor,
    },
});

export default compose(
    graphql(GQL.BindWechatMutation, { name: 'BindWechatMutation' }),
    graphql(GQL.UserAutoQuery, { options: props => ({ variables: { id: props.navigation.state.params.user.id } }) }),
)(AccountSecurity);
