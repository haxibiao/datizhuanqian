/*
 * @flow
 * created by wyk made in 2019-03-22 12:02:09
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
    PageContainer,
    TouchFeedback,
    Iconfont,
    Row,
    ListItem,
    Button,
    CustomTextInput,
    KeyboardSpacer,
    SubmitLoading,
} from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH, Tools } from 'utils';

import { compose, graphql, GQL } from 'apollo';
import { app } from 'store';

class EditProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pay_account: '',
            submitting: false,
        };
    }

    sendVerificationCode = async () => {
        const { navigation, data } = this.props;
        const { user } = data;
        if (user && user.account) {
            let result = {};
            this.setState({
                submitting: true,
            });
            try {
                result = await this.props.SendVerificationCodeMutation({
                    variables: {
                        account: user.account,
                        action: 'USER_INFO_CHANGE',
                    },
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
                navigation.navigate('VerificationCode', {
                    code: result.data.sendVerificationCode.code,
                    time: result.data.sendVerificationCode.surplusSecond,
                });
            }
        } else {
            Toast.show({ content: '账号获取失败，请重新登录' });
        }
    };

    render() {
        let { navigation, data } = this.props;
        const { pay_account, submitting } = this.state;
        if (loading) return null;
        let { loading, user } = data;
        return (
            <PageContainer title="账户绑定" white submitting={submitting}>
                <View style={styles.container}>
                    <View style={{ marginTop: PxFit(50), paddingHorizontal: PxFit(25), paddingBottom: PxFit(15) }}>
                        <Text
                            style={{
                                color: Theme.black,
                                fontSize: 20,
                                fontWeight: '600',
                                paddingBottom: PxFit(20),
                            }}>
                            验证账号
                        </Text>
                        <Text style={styles.tipsText}>绑定支付宝信息需要验证账号的安全性</Text>
                        {/*<Text style={styles.tipsText}>
							验证码将发送至账号
							<Text style={{ color: Theme.secondaryColor }}> {user.account}</Text>
						</Text>*/}
                    </View>
                    <View style={styles.inputWrap}>
                        <CustomTextInput
                            placeholder={
                                user && user.account ? '验证码将发送至账号 ' + user.account : '账号获取失败，请重新登录'
                            }
                            style={{ height: PxFit(48) }}
                            onChangeText={value => {
                                this.setState({
                                    pay_account: value,
                                });
                            }}
                            editable={false}
                        />
                    </View>
                    <Button title={'确认发送验证码'} style={styles.button} onPress={this.sendVerificationCode} />
                    <TouchFeedback
                        style={{ marginHorizontal: 28, marginTop: 15 }}
                        onPress={() => {
                            user.verified_at
                                ? Toast.show({ content: '已经修改或绑定了哦' })
                                : navigation.navigate('ModifyAccount');
                        }}>
                        <Text style={{ color: Theme.grey, fontSize: 13 }}>账号有误?</Text>
                    </TouchFeedback>
                    {/*<View style={{ paddingHorizontal: PxFit(25), marginTop: PxFit(5) }}>
						<Text style={styles.footer}>
							* 每个支付宝只能被一个{Config.AppName}账号绑定，多账号绑定将无法享受提现功能。
						</Text>
					</View>*/}
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
        paddingHorizontal: PxFit(25),
        marginVertical: PxFit(15),
    },
    tips: {
        fontWeight: '300',
        color: Theme.grey,
        lineHeight: PxFit(20),
    },
    tipsText: {
        color: Theme.grey,
        fontSize: PxFit(13),
    },
    inputWrap: {
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.borderColor,
        marginHorizontal: PxFit(25),
        paddingHorizontal: 0,
    },
    button: {
        height: PxFit(38),
        borderRadius: PxFit(5),
        marginHorizontal: PxFit(25),
        marginTop: PxFit(35),
        backgroundColor: Theme.primaryColor,
    },
    footer: {
        fontSize: PxFit(12),
        lineHeight: PxFit(16),
        color: Theme.secondaryColor,
        paddingTop: PxFit(15),
    },
});

export default compose(
    graphql(GQL.SendVerificationCodeMutation, { name: 'SendVerificationCodeMutation' }),
    graphql(GQL.UserQuery, { options: props => ({ variables: { id: app.me.id } }) }),
)(EditProfileScreen);
