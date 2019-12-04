import React, { Component, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { PageContainer, Iconfont, Row, Button, CustomTextInput, TouchFeedback } from 'components';
import { Theme, PxFit } from 'utils';

import { compose, graphql, GQL } from 'apollo';
import { app } from 'store';
import { Alipay } from 'native';

const SettingWithdrawInfo = () => {
    const [realName, setRealName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [authCode, setAuthCode] = useState('');

    const getAuthCode = () => {
        Alipay.AlipayAuth().then((code: any) => {
            console.log('code', code);
            setAuthCode(code);
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
                        placeholder={'请输入支付宝真实姓名'}
                        style={{ height: PxFit(48) }}
                        onChangeText={(value: React.SetStateAction<string>) => {
                            setRealName(value);
                        }}
                    />
                </View>
                <TouchFeedback style={styles.bind} onPress={getAuthCode} disabled={authCode.length > 0}>
                    <Row>
                        <Image source={require('@src/assets/images/zhifubao.png')} style={styles.image} />
                        <Text>{authCode.length > 0 ? '已授权' : '支付宝授权'}</Text>
                    </Row>
                    <Row>
                        <Text style={{ color: Theme.subTextColor }}>去授权</Text>
                        <Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />
                    </Row>
                </TouchFeedback>
                <Button
                    title={'安全保存'}
                    style={{ ...styles.button, backgroundColor: disabledButton ? Theme.grey : Theme.primaryColor }}
                    onPress={() => {}}
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
