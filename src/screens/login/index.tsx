import React, { Component, useState } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, Button, CustomTextInput, Loading } from 'components';

import { withApollo, compose, graphql, GQL } from 'apollo';
import { app } from 'store';
import { Util } from 'native';
import { getWechatAuthCode } from 'common';
import * as WeChat from 'react-native-wechat';

import UserRewardOverlay from '../home/components/UserRewardOverlay';

import { Overlay } from 'teaset';
import service from 'service';

import DeviceInfo from 'react-native-device-info';

const index = props => {
    const [readed, setReaded] = useState(true);

    const { navigation } = props;
    const deviceId = DeviceInfo.getUniqueID();

    //微信登录
    const wechatLogin = () => {
        checkAgree();
        getWechatAuthCode({
            callback: (code: any) => {
                service.getWechatInfo(code, (result: { data: { unionid: any; user: any } }) => {
                    if (Helper.syncGetter('data.unionid', result)) {
                        // 新用户绑定手机号
                        navigation.navigate('PhoneBind', {
                            data: result.data,
                        });
                    } else {
                        // 老用户直接登录
                        getUserData(result.data.user);
                    }
                });
            },
        });
    };

    //获取用户信息(微信登录)
    const getUserData = (user: { id: any; api_token: any }) => {
        Loading.show();
        app.client
            .query({
                query: GQL.UserQuery,
                variables: {
                    id: user.id,
                },
            })
            .then((result: { data: { user: any } }) => {
                Loading.hide();
                const userLoginInfo = {
                    ...result.data.user,
                    token: user.api_token,
                };
                saveUserData(userLoginInfo);
            })
            .catch((error: { toString: () => string }) => {
                Loading.hide();
                const str = error.toString().replace(/Error: GraphQL error: /, '');
                Toast.show({ content: str });
            });
    };

    //UUID一键登录
    const uuidSign = () => {
        checkAgree();
        console.log('uuidSign :>> ', deviceId);
        service.clientMutate({
            mutation: GQL.autoSignInMutation,
            variables: {
                uuid: deviceId,
            },
            dispatch: (result: { data: { autoSignIn: any } }) => {
                const user = result.data.autoSignIn;
                saveUserData(user);
            },
        });
    };

    //保存用户信息
    const saveUserData = (user: any) => {
        app.signIn(user);
        navigation.goBack();
        Toast.show({ content: '登录成功' });
    };

    const checkAgree = () => {
        if (!readed) {
            return Toast.show({
                content: '请先勾选同意”用户协议“和”隐私政策“',
            });
        }
    };

    return (
        <PageContainer hiddenNavBar>
            <View style={styles.container}>
                <Image
                    source={require('@src/assets/images/bg_login_top.png')}
                    style={{
                        width: Device.WIDTH,
                        height: (Device.WIDTH * 811) / 1500,
                    }}
                />
                <View style={styles.formContainer}>
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={require('@src/assets/images/icon.png')}
                            style={{
                                width: 90,
                                height: 90,
                            }}
                        />

                        <Button style={styles.button} disabled={!readed} onPress={uuidSign}>
                            <Text style={styles.buttonText}>{'本机号码一键登录'}</Text>
                        </Button>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View
                            style={{
                                marginBottom: 55,
                                width: Device.WIDTH,
                            }}>
                            <Row style={styles.rowCenter}>
                                <Text style={{ marginHorizontal: 20, color: '#999999', fontSize: Font(13) }}>
                                    其他方式登录
                                </Text>
                            </Row>
                            <Row
                                style={{
                                    alignItems: 'stretch',
                                }}>
                                <TouchFeedback style={styles.otherLogin} onPress={wechatLogin}>
                                    <Image
                                        source={require('@src/assets/images/wechat.png')}
                                        style={{
                                            width: 26,
                                            height: 26,
                                            marginBottom: 8,
                                        }}
                                    />
                                    <Text style={{ color: '#333333', fontSize: Font(14) }}>微信登录</Text>
                                </TouchFeedback>

                                <TouchFeedback
                                    style={styles.otherLogin}
                                    onPress={() => navigation.navigate('PasswordLogin')}>
                                    <Image
                                        source={require('@src/assets/images/ic_login_password.png')}
                                        style={{
                                            width: 28,
                                            height: 28,
                                            marginBottom: 8,
                                        }}
                                    />
                                    <Text style={{ color: '#333333', fontSize: Font(14) }}>密码登录</Text>
                                </TouchFeedback>
                            </Row>
                        </View>
                        <Row style={styles.rowCenter}>
                            <TouchFeedback
                                style={styles.bageWrap}
                                onPress={() => {
                                    setReaded(!readed);
                                }}>
                                {readed ? (
                                    <View style={styles.bage}>
                                        <Iconfont name={'correct'} color={Theme.white} size={Font(8)} />
                                    </View>
                                ) : null}
                            </TouchFeedback>

                            <Text style={styles.bottomInfoText}>登录即代表同意</Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <TouchFeedback onPress={() => navigation.navigate('UserProtocol')}>
                                    <Text
                                        style={{
                                            fontSize: PxFit(12),
                                            // color: Theme.theme,
                                            color: '#7D8089',
                                        }}>
                                        《用户协议》
                                    </Text>
                                </TouchFeedback>
                                <Text style={styles.bottomLinkText}>和</Text>
                                <TouchFeedback onPress={() => navigation.navigate('PrivacyPolicy')}>
                                    <Text
                                        style={{
                                            fontSize: PxFit(12),
                                            // color: Theme.theme,
                                            color: '#7D8089',
                                        }}>
                                        《用户隐私政策》
                                    </Text>
                                </TouchFeedback>
                            </View>
                        </Row>
                    </View>
                </View>
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    formContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: PxFit(35),
        marginTop: 20,
        marginHorizontal: 15,
    },
    fieldGroup: {
        marginBottom: PxFit(10),
        backgroundColor: '#000000',
    },
    field: {
        fontSize: PxFit(16),
        color: '#666',
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.lightBorder,
        marginTop: 15,
    },
    inputStyle: {
        flex: 1,
        height: PxFit(40),
        fontSize: PxFit(15),
        color: Theme.defaultTextColor,
        paddingBottom: PxFit(10),
        paddingTop: PxFit(10),
    },
    button: {
        marginTop: PxFit(50),
        height: PxFit(42),
        backgroundColor: '#FCE13D',
        borderRadius: PxFit(20),
    },
    buttonText: {
        fontSize: Font(15),
        color: '#623605',
    },
    bottomInfo: {
        width: Device.WIDTH,
        paddingHorizontal: PxFit(50),
        marginTop: PxFit(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomInfoText: {
        fontSize: PxFit(12),
        color: '#7D8089',
    },
    bottomLinkText: {
        fontSize: PxFit(12),
        color: '#7D8089',
    },
    protocol: {
        position: 'absolute',
        bottom: Device.HOME_INDICATOR_HEIGHT + PxFit(Theme.itemSpace),
        left: 0,
        right: 0,
    },
    line: {
        width: Device.WIDTH / 5,
        height: 0.5,
        backgroundColor: Theme.grey,
    },
    otherLogin: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    bageWrap: {
        height: 14,
        width: 14,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Theme.grey,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    bage: {
        backgroundColor: '#FEC53F',
        height: 14,
        width: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayInner: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: Device.HOME_INDICATOR_HEIGHT + PxFit(Theme.itemSpace),
    },
});

export default index;
