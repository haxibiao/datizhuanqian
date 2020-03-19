import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { PageContainer, Iconfont, Row, Button, CustomTextInput, TouchFeedback } from 'components';

import { GQL } from 'apollo';
import { app } from 'store';
import { Alipay } from 'native';
import { bindAlipayFailedTrack, bindAlipaySucceedTrack, bindAlipayTrack, getAlipayAuthCode, bindAlipay } from 'common';

const SettingWithdrawInfo = props => {
    const [realName, setRealName] = useState(Helper.syncGetter('userCache.wallet.real_name', app) || '');
    const [submitting, setSubmitting] = useState(false);
    const [authCode, setAuthCode] = useState(Helper.syncGetter('userCache.wallet.bind_platforms.alipay', app) || '');
    const { navigation } = props;

    //支付宝授权
    const getAuthCode = () => {
        getAlipayAuthCode({
            callback: (code: any) => setAuthCode(code),
        });
    };

    //绑定真实姓名
    const bindRealName = () => {
        setSubmitting(true);
        app.client
            .mutate({
                mutation: GQL.SetWalletInfoMutation,
                variables: {
                    data: {
                        real_name: realName,
                    },
                },
                refetchQueries: () => [
                    {
                        query: GQL.UserMeansQuery,
                        variables: { id: app.me.id },
                    },
                    {
                        query: GQL.UserQuery,
                        variables: { id: app.me.id },
                    },
                ],
            })
            .then(() => {
                setSubmitting(false);
                if (Helper.syncGetter('userCache.wallet.bind_platforms.alipay', app)) {
                    Toast.show({
                        content: '绑定成功',
                    });
                    navigation.navigate('Main', null, navigation.navigate({ routeName: '提现' }));
                } else {
                    bindAlipay({
                        authCode,
                        onFaild: () => setAuthCode(''),
                    });
                }
            })
            .catch((error: { toString: () => string }) => {
                setSubmitting(false);
                Toast.show({
                    content: error.toString().replace(/Error: GraphQL error: /, ''),
                });
                bindAlipayFailedTrack(error.toString());
            });
    };

    const disabledButton = realName.length <= 0 || authCode.length <= 0;

    return (
        <PageContainer white submitting={submitting} navBarStyle={styles.border}>
            <View style={styles.container}>
                <View style={{ marginTop: PxFit(50), paddingHorizontal: PxFit(25), paddingBottom: PxFit(30) }}>
                    <Text style={styles.title}>支付宝绑定</Text>
                    <Text style={styles.tipsText}>提现到支付宝需要完善真实姓名</Text>
                </View>
                <View style={styles.inputWrap}>
                    <CustomTextInput
                        placeholder={Helper.syncGetter('userCache.wallet.real_name', app) || '请输入支付宝真实姓名'}
                        style={{ height: PxFit(48) }}
                        onChangeText={(value: React.SetStateAction<string>) => {
                            setRealName(value);
                        }}
                    />
                </View>
                <TouchFeedback style={styles.bind} onPress={getAuthCode} disabled={authCode.length > 0}>
                    <Row>
                        <Image source={require('@src/assets/images/zhifubao.png')} style={styles.image} />
                        <Text style={{ fontSize: PxFit(13) }}>{'支付宝授权'}</Text>
                    </Row>
                    <Row>
                        <Text style={{ color: Theme.subTextColor, fontSize: PxFit(13) }}>
                            {authCode.length > 0 ? '已授权' : '去授权'}
                        </Text>
                        <Iconfont name="right" size={PxFit(13)} color={Theme.subTextColor} />
                    </Row>
                </TouchFeedback>
                <Button
                    title={'安全保存'}
                    style={{ ...styles.button, backgroundColor: disabledButton ? Theme.grey : Theme.primaryColor }}
                    onPress={bindRealName}
                    disabled={disabledButton}
                />
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    border: {
        borderBottomWidth: 0,
        borderBottomColor: '#fff',
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: Theme.white,
    },
    header: {
        paddingHorizontal: PxFit(25),
        marginVertical: PxFit(15),
    },
    title: {
        color: Theme.black,
        fontSize: PxFit(28),
        fontWeight: '700',
        paddingBottom: PxFit(10),
    },
    tipsText: {
        color: Theme.grey,
        fontSize: PxFit(13),
    },
    inputWrap: {
        borderBottomWidth: PxFit(0.3),
        borderBottomColor: Theme.borderColor,
        marginHorizontal: PxFit(25),
        paddingHorizontal: 0,
    },
    bind: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: PxFit(25),
        paddingVertical: PxFit(15),
        borderBottomWidth: PxFit(0.3),
        borderBottomColor: Theme.borderColor,
    },
    image: {
        width: PxFit(24),
        height: PxFit(24),
        marginRight: PxFit(5),
    },
    button: {
        height: PxFit(42),
        borderRadius: PxFit(21),
        marginHorizontal: PxFit(25),
        marginTop: PxFit(35),
    },
});

export default SettingWithdrawInfo;
