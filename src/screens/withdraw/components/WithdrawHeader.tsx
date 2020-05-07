import React, { useState, useEffect, Fragment, useRef } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ImageBackground } from 'react-native';
import { TouchFeedback, Button, SubmitLoading, TipsOverlay, ItemSeparator, Row, Iconfont } from 'components';
import { useQuery, GQL, useMutation } from 'apollo';
import { app, config } from 'store';
import { Overlay } from 'teaset';
import RuleDescription from './RuleDescription';
import { BoxShadow } from 'react-native-shadow';

interface Props {
    navigation: any;
    user: User;
}

interface User {
    gold: any;
    today_contributes: Number;
    exchange_rate: any;
}

const WithdrawHeader = (props: Props) => {
    const { navigation, user } = props;

    const showRule = () => {
        const overlayView = (
            <Overlay.View animated>
                <View style={styles.overlayInner}>
                    <RuleDescription hide={() => Overlay.hide(OverlayKey)} />
                </View>
            </Overlay.View>
        );
        const OverlayKey = Overlay.show(overlayView);
    };

    const fetchGuidanceVideo = () => {
        if (!app.firstOpenContributeVideo) {
            app.setOpenContributeVideo(true);
            app.client
                .query({
                    query: GQL.PostQuery,
                    variables: { id: 33796 },
                    fetchPolicy: 'network-only',
                })
                .then((result: any) => {
                    const post = Helper.syncGetter('data.post', result);
                    Helper.middlewareNavigate('VideoPost', { medium: [post], isPost: true });
                })
                .catch((error: any) => {});
        } else {
            navigation.navigate('MakeMoenyManual', { activeIndex: 1 });
        }
    };

    return (
        <View>
            <ImageBackground
                source={require('@src/assets/images/withdraw_bg.png')}
                style={{
                    width: Device.WIDTH,
                    height: (Device.WIDTH * 687) / 1080,
                    // marginTop: ,
                }}>
                <Row style={{ justifyContent: 'space-between' }}>
                    <TouchFeedback
                        style={{
                            height: Device.NAVBAR_HEIGHT,
                            paddingTop: PxFit(Device.statusBarHeight) + PxFit(10),
                            marginLeft: PxFit(15),
                        }}
                        onPress={() => {
                            navigation.goBack();
                        }}>
                        <Iconfont name={'left'} size={20} color={'#000'} />
                    </TouchFeedback>

                    <TouchFeedback
                        onPress={() => navigation.navigate('BillingRecord')}
                        style={{
                            height: Device.NAVBAR_HEIGHT,
                            paddingTop: PxFit(Device.statusBarHeight) + PxFit(10),
                            marginRight: PxFit(15),
                        }}>
                        <Text style={{ fontSize: Font(15), textAlign: 'center', color: '#333333' }}>提现记录</Text>
                    </TouchFeedback>
                </Row>

                <View style={{ marginTop: PxFit(5) }}>
                    <Text style={styles.greyText}>当前智慧点(个)</Text>
                    <View style={{ marginTop: PxFit(3) }}>
                        <Text style={styles.boldBlackText}>{user.gold || 0}</Text>
                        <View style={{ position: 'absolute', top: PxFit(0), left: Device.WIDTH / 2 + PxFit(30) }}>
                            <Image
                                source={require('@src/assets/images/withdraw_tips.png')}
                                style={{
                                    width: Device.WIDTH / 4 + 10,
                                    height: ((Device.WIDTH / 4 + 10) * 42) / 264,
                                }}
                            />
                            <Text
                                style={{
                                    position: 'absolute',
                                    top: PxFit(1),
                                    left: PxFit(5),
                                    fontSize: PxFit(10),
                                    color: Theme.white,
                                }}>
                                明日预估可提{Helper.money(user)}元
                            </Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
            <View style={{ marginTop: -PxFit(65) }}>
                <BoxShadow
                    setting={Object.assign({}, shadowOpt, {
                        height: PxFit(110),
                    })}>
                    <View style={styles.accumulat}>
                        <TouchFeedback
                            style={styles.accumulated}
                            navigation={navigation}
                            authenticated
                            onPress={fetchGuidanceVideo}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <Text style={styles.greyText}>今日贡献值</Text>
                                {app.firstOpenContributeVideo ? (
                                    <Image
                                        source={require('@src/assets/images/question.png')}
                                        style={{ width: PxFit(15), height: PxFit(15), marginLeft: PxFit(5) }}
                                    />
                                ) : (
                                    <Image
                                        source={require('@src/assets/images/ic_issue.gif')}
                                        style={{ width: PxFit(20), height: PxFit(20), marginLeft: PxFit(3) }}
                                    />
                                )}
                            </View>
                            <Text style={styles.slenderBlackText}>{user.today_contributes || 0}</Text>
                            <Text style={styles.tips}>每日凌晨重新计算</Text>
                        </TouchFeedback>
                        <View style={styles.line} />
                        <View style={styles.accumulated}>
                            <Text style={styles.greyText}>当前汇率(智慧点/元)</Text>
                            <Text style={styles.slenderBlackText}>
                                {user.exchange_rate ? user.exchange_rate : 600}/1
                            </Text>
                            <Text style={styles.tips}>{user.exchange_rate || 600}智慧点可兑换一元</Text>
                        </View>
                    </View>
                </BoxShadow>
            </View>
            <Row style={styles.withdrawTypeWrap}>
                <Row>
                    <View style={styles.titleBadge} />
                    <Text style={{ fontSize: PxFit(15) }}>提现到</Text>
                </Row>
                <TouchFeedback style={{ flexDirection: 'row', alignItems: 'center' }} onPress={showRule}>
                    <Text style={{ color: '#A3A3A3', fontSize: Font(13) }}>提现规则</Text>
                    <Image
                        source={require('@src/assets/images/question.png')}
                        style={{ width: PxFit(12), height: PxFit(12), marginLeft: PxFit(3), marginTop: PxFit(2) }}
                    />
                </TouchFeedback>
            </Row>
        </View>
    );
};

const shadowOpt = {
    width: Device.WIDTH - PxFit(30),
    height: PxFit(80),
    color: '#E8E8E8',
    border: PxFit(5),
    radius: PxFit(10),
    opacity: 0.5,
    x: 0,
    y: 0,
    style: {
        marginHorizontal: PxFit(15),
        // marginVertical: PxFit(15),
    },
};

const styles = StyleSheet.create({
    overlayInner: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rule: {
        flex: 1,
        justifyContent: 'center',
    },
    greyText: {
        textAlign: 'center',
        color: '#333333',
        fontSize: Font(13),
    },
    accumulat: {
        flexDirection: 'row',
        // marginVertical: PxFit(10),
        backgroundColor: '#FFF',
        height: PxFit(110),
        alignItems: 'center',
        borderRadius: PxFit(5),
    },
    accumulated: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slenderBlackText: {
        textAlign: 'center',
        color: Theme.defaultTextColor,
        fontSize: Font(18),
        fontWeight: '300',
        lineHeight: PxFit(18),
        marginTop: PxFit(15),
    },
    tips: {
        fontSize: Font(11),
        color: '#CCCCCC',
        marginTop: PxFit(12),
    },
    line: {
        backgroundColor: Theme.borderColor,
        width: PxFit(0.5),
        height: PxFit(40),
    },
    boldBlackText: {
        textAlign: 'center',
        color: '#FE6767',
        fontSize: PxFit(30),
        fontWeight: '500',
        lineHeight: PxFit(32),
        marginBottom: PxFit(5),
        marginTop: PxFit(15),
    },
    titleBadge: {
        height: PxFit(15),
        width: PxFit(4),
        backgroundColor: '#FFCB03',
        marginRight: PxFit(10),
        borderRadius: PxFit(3),
    },
    withdrawTypeWrap: {
        justifyContent: 'space-between',
        paddingHorizontal: PxFit(Theme.itemSpace),
        paddingTop: PxFit(20),
    },
});
export default WithdrawHeader;
