/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 13:45:50
 */

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Linking } from 'react-native';
import { Button, PageContainer, TouchFeedback } from 'components';
import { Theme, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit, Config, ISIOS } from 'utils';
import { Overlay } from 'teaset';
import { ad } from 'native';

import { observer, app, config, keys, storage } from 'store';

class WithdrawApply extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { navigation } = this.props;

        this.loadCache();
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    async loadCache() {
        const commentAppStoreVersion = (await storage.getItem(keys.commentAppStoreVersion)) || 1;
        if (Config.Version !== commentAppStoreVersion) {
            this.timer = setTimeout(() => {
                this.showTips();
            }, 500);
        }
    }

    showTips = () => {
        let overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <View
                        style={{
                            backgroundColor: '#FFF',
                            paddingHorizontal: 40,
                            paddingVertical: 20,
                            borderRadius: 5,
                        }}>
                        <View style={{ paddingBottom: 25, paddingTop: 10 }}>
                            <Text style={{ fontSize: 15, fontWeight: '500' }}>做应用商店好评任务</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <TouchFeedback
                                onPress={() => {
                                    Overlay.hide(this.OverlayKey);
                                    this.updateVersion(Config.Version);
                                }}>
                                <Text style={{ fontSize: 15, color: Theme.grey, textAlign: 'center' }}>下次吧</Text>
                            </TouchFeedback>
                            <TouchFeedback
                                onPress={() => {
                                    Linking.openURL(
                                        ISIOS
                                            ? 'itms-apps://itunes.apple.com/app/id1462854524'
                                            : 'market://details?id=' + Config.PackageName,
                                    );
                                    // 除华为 小米  oppo 之外改名com.damei
                                    Overlay.hide(this.OverlayKey);
                                    this.updateVersion(Config.Version);
                                }}>
                                <Text style={{ fontSize: 15, color: Theme.theme }}>去评价</Text>
                            </TouchFeedback>
                        </View>
                    </View>
                </View>
            </Overlay.View>
        );
        this.OverlayKey = Overlay.show(overlayView);
    };

    updateVersion = version => {
        app.updateCommentAppStoreVersion(version);
    };

    render() {
        const { navigation } = this.props;
        const { amount } = navigation.state.params;
        return (
            <PageContainer
                navBarStyle={{
                    backgroundColor: Theme.themeRed,
                    borderBottomWidth: 0,
                    borderBottomColor: Theme.themeRed,
                }}>
                <Image source={require('../../assets/images/money.png')} style={styles.image} />
                <View style={styles.content}>
                    <Text style={styles.header}>提现申请已提交</Text>
                    <View style={styles.center}>
                        <Text style={styles.money}>{amount}</Text>
                        <Text style={{ fontSize: PxFit(15), color: Theme.secondaryColor, paddingTop: PxFit(32) }}>
                            {' '}
                            元
                        </Text>
                    </View>
                    <View style={styles.bottom}>
                        <Text style={styles.text}>预计3~5个工作日内到账支付宝</Text>
                        <TouchFeedback
                            onPress={() => {
                                navigation.navigate('任务');
                            }}>
                            <Text style={styles.tips}>做应用商店好评任务、奖励更多、提现更多</Text>
                        </TouchFeedback>
                    </View>
                    <Button
                        title={'确定'}
                        style={styles.button}
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                    />
                </View>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: SCREEN_WIDTH,
        height: (SCREEN_WIDTH * PxFit(617)) / PxFit(1080),
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: PxFit(20),
    },
    header: {
        fontSize: PxFit(22),
        color: Theme.black,
    },
    center: {
        flexDirection: 'row',
        marginTop: PxFit(20),
    },
    money: {
        fontSize: PxFit(50),
        color: Theme.secondaryColor,
    },
    bottom: {
        alignItems: 'center',
        marginTop: PxFit(20),
    },
    text: {
        fontSize: PxFit(15),
        color: Theme.black,
    },
    tips: {
        fontSize: PxFit(14),
        color: Theme.themeRed,
        paddingTop: PxFit(10),
    },
    button: {
        height: PxFit(38),
        borderRadius: PxFit(19),
        marginTop: PxFit(40),
        width: SCREEN_WIDTH - PxFit(60),
        backgroundColor: Theme.themeRed,
    },
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default WithdrawApply;
