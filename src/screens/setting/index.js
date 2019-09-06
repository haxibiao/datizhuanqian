import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView, Linking } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, ListItem, ItemSeparator, PopOverlay } from 'components';
import { Theme, PxFit, Config, ISIOS } from 'utils';
import { app } from 'store';
import { withApollo, GQL } from 'apollo';
import { checkUpdate } from 'common';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storageSize: (Math.random(1, 10) * 10).toFixed(1) + 'M',
        };
    }

    signOut = async () => {
        const { navigation, client } = this.props;

        const result = await client.mutate({
            mutation: GQL.UserAutoQuery,
            variables: {
                id: app.me.id,
            },
        });

        if (result && result.data && result.data.user) {
            const { user } = result.data;
            if (user.auto_uuid_user) {
                PopOverlay({
                    title: '提示',
                    content:
                        '您现在处于游客登录模式，还没有绑定手机号，退出当前账号可能会影响您的智慧点提现，也会影响你之后的正常收益哦~',
                    leftContent: '退出登录',
                    rightContent: '绑定手机号',
                    leftConfirm: async () => {
                        app.signOut();
                        app.forget();
                        navigation.navigate('Main', null, navigation.navigate({ routeName: '答题' }));
                    },
                    onConfirm: () => {
                        navigation.navigate('SetLoginInfo', { phone: null });
                    },
                });
            } else {
                PopOverlay({
                    content: '确定退出登录吗?',
                    onConfirm: async () => {
                        app.signOut();
                        app.forget();
                        navigation.navigate('Main', null, navigation.navigate({ routeName: '答题' }));
                    },
                });
            }
        } else {
            PopOverlay({
                content: '确定退出登录吗?',
                onConfirm: async () => {
                    app.signOut();
                    app.forget();
                    navigation.navigate('Main', null, navigation.navigate({ routeName: '答题' }));
                },
            });
        }
    };

    render() {
        const { navigation } = this.props;
        const { login } = app;
        const { storageSize } = this.state;
        const user = navigation.getParam('user', {});
        return (
            <PageContainer title="设置" white>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={{ paddingBottom: PxFit(20) }}
                    bounces={false}
                    removeClippedSubviews={true}
                    showsVerticalScrollIndicator={false}>
                    {login && (
                        <ListItem
                            onPress={() => {
                                if (login) {
                                    navigation.navigate('AccountSecurity', { user });
                                } else {
                                    navigation.navigate('Register');
                                }
                            }}
                            style={styles.listItem}
                            leftComponent={<Text style={styles.itemText}>账号安全</Text>}
                            rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
                        />
                    )}
                    {login && <ItemSeparator />}
                    <ListItem
                        onPress={() => navigation.navigate('UserProtocol')}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>用户协议</Text>}
                        rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
                    />
                    <ItemSeparator />
                    <ListItem
                        onPress={() => navigation.navigate('PrivacyPolicy')}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>隐私政策</Text>}
                        rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
                    />
                    <ItemSeparator />
                    <ListItem
                        onPress={() => navigation.navigate('ShareApp')}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>分享给好友</Text>}
                        rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
                    />
                    <ItemSeparator />
                    <ListItem
                        onPress={() => navigation.navigate('AboutUs')}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>关于{Config.AppName}</Text>}
                        rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
                    />
                    <ItemSeparator />
                    <ListItem
                        onPress={() =>
                            Linking.openURL(
                                ISIOS
                                    ? 'itms-apps://itunes.apple.com/app/id1462854524'
                                    : 'market://details?id=com.datizhuanqian',
                            )
                        }
                        //  id  答妹上架后的itunes的id  itms-apps://itunes.apple.com/app/id1462854524
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>鼓励一下{Config.AppName}</Text>}
                        rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
                    />
                    <ItemSeparator />
                    <ListItem
                        onPress={() =>
                            Linking.openURL(
                                ISIOS
                                    ? 'itms-apps://itunes.apple.com/app/id1462854524'
                                    : 'market://details?id=com.dianmoge',
                            )
                        }
                        //  id  答妹上架后的itunes的id  itms-apps://itunes.apple.com/app/id1462854524
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>下载点墨阁</Text>}
                        rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
                    />

                    <ItemSeparator />
                    <ListItem
                        onPress={() => navigation.navigate('UpdateLog')}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>更新日志</Text>}
                        rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
                    />
                    <ItemSeparator />
                    <ListItem
                        onPress={() =>
                            setTimeout(() => {
                                this.setState({ storageSize: '0M' }, () => {
                                    Toast.show({ content: '已清除缓存' });
                                });
                            }, 300)
                        }
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>清除缓存</Text>}
                        rightComponent={<Text style={styles.rigthText}>{storageSize}</Text>}
                    />
                    <ItemSeparator />
                    <ListItem
                        onPress={() => checkUpdate()}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>检查更新</Text>}
                        rightComponent={<Text style={styles.rigthText}>{Config.AppVersion}</Text>}
                    />
                    <ItemSeparator />
                    {login && (
                        <TouchFeedback style={[styles.listItem, { justifyContent: 'center' }]} onPress={this.signOut}>
                            <Text style={styles.logout}>退出登录</Text>
                        </TouchFeedback>
                    )}
                </ScrollView>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.groundColour,
    },
    listItem: {
        paddingHorizontal: PxFit(16),
        height: PxFit(50),
        backgroundColor: '#fff',
    },
    itemText: {
        fontSize: PxFit(15),
        color: Theme.defaultTextColor,
        marginRight: PxFit(15),
    },
    rigthText: {
        fontSize: PxFit(14),
        color: Theme.subTextColor,
    },
    logout: {
        fontSize: PxFit(14),
        color: Theme.primaryColor,
        alignSelf: 'center',
    },
});

export default withApollo(index);
