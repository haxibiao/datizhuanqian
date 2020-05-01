import React, { Component, useState } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { Button, PageContainer, CustomTextInput, TouchFeedback, Iconfont } from 'components';

import { compose, graphql, GQL } from 'apollo';
import { app } from 'store';
import service from '@src/service';

const PasswordLogin = props => {
    const { navigation } = props;
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');

    const signIn = async () => {
        service.clientMutate({
            mutation: GQL.signInMutation,
            variables: {
                account,
                password,
            },
            dispatch: (result: { data: { signIn: any } }) => {
                const user = result.data.signIn;
                saveUserData(user);
            },
        });
    };

    const saveUserData = (user: any) => {
        app.signIn(user);
        app.remember(user);
        Toast.show({ content: '登录成功' });
        navigation.navigate('答题');
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('@src/assets/images/bg_login_top.png')}
                style={{
                    width: Device.WIDTH,
                    height: (Device.WIDTH * 811) / 1500,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                <TouchFeedback
                    style={{
                        height: Device.NAVBAR_HEIGHT,
                        paddingTop: PxFit(Device.statusBarHeight) + PxFit(10),
                        marginLeft: PxFit(15),
                    }}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Iconfont name={'left'} size={20} color={'#623605'} />
                </TouchFeedback>
                <View
                    style={{
                        height: Device.NAVBAR_HEIGHT,
                        paddingTop: PxFit(Device.statusBarHeight) + PxFit(10),
                    }}>
                    <Text style={{ fontSize: Font(14), color: '#623605' }}>登录账号</Text>
                </View>
                <TouchFeedback
                    style={{
                        height: Device.NAVBAR_HEIGHT,
                        paddingTop: PxFit(Device.statusBarHeight) + PxFit(10),
                        marginRight: PxFit(15),
                    }}
                    onPress={() => {
                        navigation.navigate('ForgetPassword', { account });
                    }}>
                    <Text style={{ fontSize: Font(13), color: '#623605' }}>忘记密码?</Text>
                </TouchFeedback>
            </ImageBackground>

            <View style={styles.textWrap}>
                <CustomTextInput
                    placeholder="请输入手机号码"
                    placeholderTextColor={'#939393'}
                    style={{ height: PxFit(48) }}
                    onChangeText={value => {
                        setAccount(value);
                    }}
                    autoFocus
                    maxLength={48}
                />
            </View>
            <View style={styles.textWrap}>
                <CustomTextInput
                    placeholder="请输入登录密码"
                    placeholderTextColor={'#939393'}
                    style={{ height: PxFit(48) }}
                    secureTextEntry={true}
                    onChangeText={value => {
                        setPassword(value);
                    }}
                    maxLength={48}
                />
            </View>
            <Button style={styles.button} disabled={false} onPress={signIn}>
                <Text style={styles.buttonText}>登录</Text>
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.white,
    },
    header: {
        marginTop: PxFit(30),
        paddingHorizontal: PxFit(25),
        marginBottom: 15,
    },
    title: {
        color: Theme.black,
        fontSize: PxFit(20),
        fontWeight: '600',
    },
    tipsText: {
        color: Theme.grey,
        fontSize: PxFit(12),
        paddingTop: PxFit(20),
    },
    buttonWrap: {
        marginHorizontal: PxFit(25),
        marginTop: PxFit(35),
        height: PxFit(40),
    },
    button: {
        marginTop: PxFit(50),
        height: PxFit(44),
        backgroundColor: '#FCE13D',
        borderRadius: PxFit(22),
        marginHorizontal: PxFit(30),
    },
    buttonText: {
        fontSize: Font(15),
        color: '#623605',
    },
    textWrap: {
        marginHorizontal: PxFit(30),
        paddingHorizontal: 0,
        backgroundColor: '#F9F9F9',
        marginTop: PxFit(20),
        borderRadius: PxFit(30),
        paddingLeft: PxFit(15),
    },
    textInput: {
        fontSize: PxFit(16),
        color: Theme.primaryFont,
        padding: 0,
        height: PxFit(50),
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: PxFit(25),
        marginTop: PxFit(15),
    },
    bottomInfoText: {
        fontSize: PxFit(13),
        color: '#7D8089',
    },
});

export default PasswordLogin;
