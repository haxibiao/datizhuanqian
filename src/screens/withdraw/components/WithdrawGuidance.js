/*
 * @flow
 * created by wyk made in 2019-03-26 18:08:36
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';
import { withApollo, GQL } from 'apollo';
import { app } from 'store';
import { checkLoginInfo } from 'common';

class WithdrawGuidance extends Component {
    checkUser = async () => {
        const { navigation, client } = this.props;
        const result = await client.mutate({
            mutation: GQL.UserAutoQuery,
            variables: {
                id: app.me.id,
            },
        });
        if (result && result.data && result.data.user) {
            const { user } = result.data;
            checkLoginInfo(user.auto_uuid_user, user.auto_phone_user, navigation, user);
        } else {
            Toast.show({
                content: '获取账号信息失败，请检查网络',
            });
        }
    };

    render() {
        const { tips } = this.props;
        return (
            <View
                style={{
                    flex: 1,
                    // justifyContent: 'f',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                }}>
                <Image
                    source={require('../../../assets/images/alipay.jpg')}
                    style={{ width: SCREEN_WIDTH / 2.8, height: SCREEN_WIDTH / 3 }}
                />
                <Text style={{ color: Theme.subTextColor, fontSize: PxFit(13), fontWeight: '300' }}>
                    {tips ? tips : '目前没有绑定支付宝账户哦'}
                </Text>

                <TouchableOpacity onPress={this.checkUser} style={{ alignItems: 'center' }}>
                    <Text
                        style={{
                            color: Theme.linkColor,
                            fontSize: PxFit(13),
                            fontWeight: '300',
                            paddingTop: PxFit(10),
                        }}>
                        去绑定支付宝账号
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({});

export default withApollo(WithdrawGuidance);
