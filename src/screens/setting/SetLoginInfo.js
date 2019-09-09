/*
 * @Author: Gaoxuan
 * @Date:   2019-03-27 11:52:27
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Button, PageContainer, SubmitLoading, CustomTextInput, KeyboardSpacer } from '../../components';
import { Theme, PxFit, Config, SCREEN_WIDTH, Tools } from '../../utils';

import { Mutation, compose, graphql, GQL } from 'apollo';
import { app } from 'store';

import DeviceInfo from 'react-native-device-info';

class SetLoginInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: props.navigation.state.params.phone,
            password: null,
        };
    }

    //提交密码登录
    setLoginInfo = async () => {
        const { navigation } = this.props;
        let { account } = this.state;
        let deviceId = DeviceInfo.getUniqueID();
        let result = {};

        this.setState({
            submitting: true,
        });
        try {
            result = await this.props.UUIDBindMutation({
                variables: {
                    account,
                    password: this.state.password,
                },
                refetchQueries: () => [
                    {
                        query: GQL.UserAutoQuery,
                        variables: { id: app.me.id },
                        fetchPolicy: 'network-only',
                    },
                ],
                errorPolicy: 'all',
            });
        } catch (ex) {
            result.errors = ex;
        }
        if (result && result.errors) {
            this.setState({
                submitting: false,
            });
            let str = result.errors[0].message;
            Toast.show({ content: str });
        } else {
            this.setState({
                submitting: false,
            });
            const user = result.data.uuidBind;
            Toast.show({ content: '设置成功' });
            navigation.goBack();
        }
    };

    render() {
        const { navigation } = this.props;
        let { verificationCode, tips, submitting, password, account } = this.state;
        let { phone } = navigation.state.params;
        return (
            <PageContainer title="设置登录信息" white submitting={submitting} submitTips="注册中...">
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.tipsText}>
                            设置{phone ? '' : '手机及'}
                            密码后,你可以使用该手机号+密码登录
                        </Text>
                    </View>
                    <View style={styles.textWrap}>
                        <CustomTextInput
                            placeholder="请输入手机号"
                            style={{ height: PxFit(48) }}
                            onChangeText={value => {
                                this.setState({
                                    account: value,
                                });
                            }}
                            editable={!phone}
                            value={account}
                            maxLength={48}
                        />
                    </View>
                    <View style={styles.textWrap}>
                        <CustomTextInput
                            placeholder="请输入密码"
                            style={{ height: PxFit(48) }}
                            secureTextEntry={true}
                            onChangeText={value => {
                                this.setState({
                                    password: value,
                                });
                            }}
                            maxLength={48}
                        />
                    </View>

                    <View style={styles.buttonWrap}>
                        <Button
                            title="完成"
                            onPress={this.setLoginInfo}
                            style={styles.button}
                            disabled={password && account ? false : true}
                        />
                    </View>
                </View>
            </PageContainer>
        );
    }
}
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
        height: PxFit(48),
    },
    button: {
        height: PxFit(42),
        fontSize: PxFit(16),
        backgroundColor: Theme.primaryColor,
        borderRadius: PxFit(21),
    },
    textWrap: {
        marginHorizontal: PxFit(25),
        paddingHorizontal: 0,
        // marginTop: PxFit(2),
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.lightBorder,
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
});

export default compose(graphql(GQL.UUIDBindMutation, { name: 'UUIDBindMutation' }))(SetLoginInfo);
