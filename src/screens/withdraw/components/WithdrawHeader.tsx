import React, { useState, useEffect, Fragment, useRef } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ImageBackground } from 'react-native';
import { TouchFeedback, Button, SubmitLoading, TipsOverlay, ItemSeparator, Row, Iconfont } from 'components';
import { useQuery, GQL, useMutation } from 'apollo';
import { app, config } from 'store';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, Tools, ISAndroid, NAVBAR_HEIGHT } from 'utils';
import { playVideo, bindWechat, checkUserInfo } from 'common';
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
    console.log('WithdrawHeader user :', user);
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

    return (
        <View>
            <ImageBackground
                source={require('@src/assets/images/withdraw_bg.png')}
                style={{
                    width: SCREEN_WIDTH,
                    height: (SCREEN_WIDTH * 687) / 1080,
                    // marginTop: ,
                }}>
                <View
                    style={{
                        height: PxFit(NAVBAR_HEIGHT),
                        paddingTop: PxFit(Theme.statusBarHeight) + PxFit(10),
                    }}>
                    <Text style={{ fontSize: PxFit(17), textAlign: 'center', color: Theme.navBarTitleColor }}>
                        提现
                    </Text>
                </View>
                <View style={{ marginTop: PxFit(10) }}>
                    <Text style={styles.greyText}>当前智慧点(个)</Text>
                    <View style={{ marginTop: PxFit(3) }}>
                        <Text style={styles.boldBlackText}>{user.gold || 0}</Text>
                        <View style={{ position: 'absolute', top: PxFit(0), left: SCREEN_WIDTH / 2 + PxFit(30) }}>
                            <Image
                                source={require('@src/assets/images/withdraw_tips.png')}
                                style={{
                                    width: SCREEN_WIDTH / 4 + 10,
                                    height: ((SCREEN_WIDTH / 4 + 10) * 42) / 264,
                                }}
                            />
                            <Text
                                style={{
                                    position: 'absolute',
                                    top: PxFit(1),
                                    left: PxFit(8),
                                    fontSize: PxFit(10),
                                    color: Theme.white,
                                }}>
                                明日预估可提{((user.gold || 1) / (user.exchange_rate || 600)).toFixed(1)}元
                            </Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
            <View style={{ marginTop: -PxFit(65) }}>
                <BoxShadow
                    setting={Object.assign({}, shadowOpt, {
                        height: PxFit(80),
                    })}>
                    <View style={styles.accumulat}>
                        <View style={styles.accumulated}>
                            <TouchFeedback
                                onPress={() => navigation.navigate('MakeMoenyManual')}
                                style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.greyText}>今日贡献值</Text>
                                <Image
                                    source={require('../../../assets/images/question.png')}
                                    style={{ width: PxFit(11), height: PxFit(11), marginLeft: PxFit(3) }}
                                />
                            </TouchFeedback>
                            <Text style={styles.slenderBlackText}>{user.today_contributes || 0}</Text>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.accumulated}>
                            <Text style={styles.greyText}>当前汇率(智慧点/元)</Text>
                            <Text style={styles.slenderBlackText}>
                                {user.exchange_rate ? user.exchange_rate : 600}/1
                            </Text>
                        </View>
                    </View>
                </BoxShadow>
            </View>
            <Row style={styles.withdrawTypeWrap}>
                <Row>
                    <View style={styles.titleBadge}></View>
                    <Text style={{ fontSize: PxFit(15) }}>提现到</Text>
                </Row>
                <TouchFeedback style={{ flexDirection: 'row', alignItems: 'center' }} onPress={showRule}>
                    <Text style={{ color: Theme.grey, fontSize: PxFit(13) }}>提现规则</Text>
                    <Image
                        source={require('../../../assets/images/question.png')}
                        style={{ width: PxFit(12), height: PxFit(12), marginLeft: PxFit(3) }}
                    />
                </TouchFeedback>
            </Row>
        </View>
    );
};

const shadowOpt = {
    width: SCREEN_WIDTH - PxFit(30),
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
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rule: {
        flex: 1,
        justifyContent: 'center',
    },
    greyText: {
        textAlign: 'center',
        color: Theme.black,
        fontSize: PxFit(13),
    },
    accumulat: {
        flexDirection: 'row',
        // marginVertical: PxFit(10),
        backgroundColor: '#FFF',
        height: PxFit(80),
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
        fontSize: PxFit(17),
        fontWeight: '300',
        lineHeight: PxFit(18),
        marginTop: PxFit(10),
    },
    line: {
        backgroundColor: Theme.borderColor,
        width: PxFit(0.5),
        height: PxFit(40),
    },
    boldBlackText: {
        textAlign: 'center',
        color: Theme.secondaryColor,
        fontSize: PxFit(30),
        fontWeight: '500',
        lineHeight: PxFit(32),
        marginBottom: PxFit(5),
        marginTop: PxFit(15),
    },
    titleBadge: {
        height: 16,
        width: 3,
        backgroundColor: Theme.primaryColor,
        marginRight: PxFit(10),
    },
    withdrawTypeWrap: {
        justifyContent: 'space-between',
        paddingHorizontal: PxFit(Theme.itemSpace),
        paddingTop: PxFit(Theme.itemSpace),
    },
});
export default WithdrawHeader;
