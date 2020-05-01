import React, { Component, useState, useMemo, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { Button, PageContainer, CustomTextInput, TouchFeedback, Iconfont } from 'components';

import { compose, graphql, GQL } from 'apollo';
import { app } from 'store';
import service from '@src/service';

const RetrievePassword = props => {
    const { navigation } = props;
    const account = navigation.getParam('account', '');
    let time = useMemo(() => navigation.getParam('time', 60), []);
    let time_remaining = useRef(time - 1);

    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    const [timeTips, setTimeTips] = useState(`${time_remaining.current}s后重新发送`);
    let timer: any = useRef();

    const resetPassword = () => {
        if (!Helper.regular(account)) {
            Toast.show({ content: '请输入正确的手机号' });
        }

        service.clientMutate({
            mutation: GQL.ResetPasswordMutation,
            variables: {
                account: account,
                password: password,
                code: verificationCode,
            },
            dispatch: (result: any) => {
                //保存用户信息
                const user = result.data.resetPassword;
                app.signIn(user);
                navigation.pop(4);
                Toast.show({
                    content: '新密码设置成功',
                });
            },
        });
    };

    const resendVerificationCode = async () => {
        let result = {};

        const { account } = navigation.state.params;

        service.clientMutate({
            mutation: GQL.SendVerificationCodeMutation,
            variables: {
                account,
                action: 'RESET_PASSWORD',
            },
            dispatch: (result: any) => {
                countDown();
            },
        });
    };

    const countDown = () => {
        console.log('挂载 :');
        timer.current = setInterval(() => {
            --time_remaining.current;
            console.log('countDown time_remaining :', time_remaining.current);
            if (time_remaining.current == 0) {
                time_remaining.current = 60;
                setTimeTips('重新获取验证码');
                return;
            }
            setTimeTips(time_remaining.current + 's后重新发送');
        }, 1000);
    };

    useEffect(() => {
        countDown();
    }, []);

    useEffect(() => {
        return () => {
            console.log('return clearInterval :');
            timer.current && clearInterval(timer.current);
        };
    }, []);

    useEffect(() => {
        if (time_remaining.current == 60) {
            console.log('60 clearInterval :', timer.current);
            timer.current && clearInterval(timer.current);
        }
    }, [time_remaining.current, timer.current]);
    console.log('time_remaining.current :', time_remaining.current, timer.current);
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
                    <Text style={{ fontSize: Font(14), color: '#623605' }}>重置密码</Text>
                </View>
                <View
                    style={{
                        height: Device.NAVBAR_HEIGHT,
                        paddingTop: PxFit(Device.statusBarHeight) + PxFit(10),
                        marginLeft: PxFit(15),
                    }}>
                    <Text style={{ fontSize: Font(14), color: '#623605' }} />
                </View>
            </ImageBackground>
            <View
                style={[
                    styles.textWrap,
                    {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    },
                ]}>
                <CustomTextInput
                    placeholder={'请输入验证码'}
                    placeholderTextColor={'#939393'}
                    style={{ height: PxFit(48) }}
                    onChangeText={value => {
                        setVerificationCode(value);
                    }}
                    autoFocus
                    maxLength={48}
                />
                <TouchFeedback
                    style={{ marginHorizontal: PxFit(25) }}
                    onPress={resendVerificationCode}
                    disabled={!(time_remaining.current == 60)}>
                    <Text
                        style={{
                            color: time_remaining.current == 60 ? '#333333' : '#DDDDDD',
                            fontSize: 13,
                        }}>
                        {timeTips}
                    </Text>
                </TouchFeedback>
            </View>
            <View style={styles.textWrap}>
                <CustomTextInput
                    placeholder={'请输入新密码'}
                    placeholderTextColor={'#939393'}
                    style={{ height: PxFit(48) }}
                    onChangeText={value => {
                        setPassword(value);
                    }}
                    maxLength={48}
                />
            </View>

            <Button style={styles.button} disabled={false} onPress={resetPassword}>
                <Text style={styles.buttonText}>保存新密码</Text>
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

export default RetrievePassword;
