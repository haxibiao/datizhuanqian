/*
 * @Author: Gaoxuan
 * @Date:   2019-03-27 11:52:27
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, PageContainer, CustomTextInput, TouchFeedback } from 'components';

import { compose, graphql, GQL } from 'apollo';
import { app } from 'store';

class PasswordLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: null,
        };
    }

    //提交密码登录
    setPassword = async () => {
        if (!this.state.password) {
            Toast.show({ content: '请输入密码' });
            return;
        }

        const { navigation } = this.props;
        const { hasPassword } = navigation.state.params;

        this.setState({
            submitting: true,
        });

        if (hasPassword) {
            this.PasswordLogin();
        } else {
            this.ResetPasswordLogin();
        }
    };

    //设置密码登录
    ResetPasswordLogin = async () => {
        const { navigation } = this.props;
        const { token } = navigation.state.params;
        let result = {};
        try {
            result = await this.props.tokenSetPassword({
                variables: {
                    password: this.state.password,
                    token,
                },
                errorPolicy: 'all',
            });
        } catch (ex) {
            result.errors = ex;
        }
        if (result && result.errors) {
            let str = result.errors[0].message;
            Toast.show({ content: str });
            this.setState({
                submitting: false,
            });
        } else {
            const user = result.data.tokenSetPassword;
            this._saveUserData(user);
            Toast.show({ content: '登录成功' });
            navigation.navigate('答题');
        }
    };

    //输入密码登录
    PasswordLogin = async () => {
        const { navigation } = this.props;
        const { account } = navigation.state.params;
        let result = {};
        try {
            result = await this.props.signInMutation({
                variables: {
                    account,
                    password: this.state.password,
                },
                errorPolicy: 'all',
            });
        } catch (ex) {
            result.errors = ex;
        }
        if (result && result.errors) {
            console.log('result', result);
            let str = result.errors[0].message;
            Toast.show({ content: str });
            this.setState({
                submitting: false,
            });
        } else {
            const user = result.data.signIn;
            this._saveUserData(user);
            Toast.show({ content: '登录成功' });
            navigation.navigate('答题');
        }
    };

    //保存用户信息
    _saveUserData = user => {
        app.signIn(user);
        app.remember(user);
        this.setState({
            submitting: false,
        });
    };

    render() {
        const { navigation } = this.props;
        let { submitting } = this.state;
        let { phone, hasPassword } = navigation.state.params;

        return (
            <PageContainer
                title={hasPassword ? '输入密码' : '设置密码'}
                white
                submitting={submitting}
                submitTips="登录中...">
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.tipsText}>
                            {hasPassword ? '请输入密码登录' : '检测到您的账号存在风险，为了您的账号安全，请设置新密码'}
                        </Text>
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
                            autoFocus
                            maxLength={48}
                        />
                    </View>

                    <View style={styles.buttonWrap}>
                        <Button title="完成" onPress={this.setPassword} style={styles.button} />
                    </View>
                    {hasPassword ? (
                        <TouchFeedback
                            onPress={() => navigation.navigate('ForgetPassword', { account: phone, title: '找回密码' })}
                            style={{ paddingLeft: PxFit(25), marginTop: 20 }}>
                            <Text style={styles.bottomInfoText}>忘记密码/设置密码?</Text>
                        </TouchFeedback>
                    ) : null}
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
        height: PxFit(40),
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
    bottomInfoText: {
        fontSize: PxFit(13),
        color: '#7D8089',
    },
});

export default compose(
    graphql(GQL.tokenSetPassword, { name: 'tokenSetPassword' }),
    graphql(GQL.signInMutation, { name: 'signInMutation' }),
)(PasswordLogin);
