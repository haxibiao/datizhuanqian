/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:28:10
 */
import React, { Component, Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, NativeModules, Dimensions, Image } from 'react-native';
import Theme from '../../utils/Theme';
import { WPercent, HPercent, PxFit, FontSize } from '../../utils/Scale';

import { Overlay } from 'teaset';
import { ttad } from 'native';

const { height, width } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;

class RewardTips {
    static show(userReward, navigation) {
        const overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View>
                            <View style={styles.header}>
                                <Image
                                    source={require('../../assets/images/money_old.png')}
                                    style={styles.headerImage}
                                />

                                <View style={{ marginLeft: PxFit(15) }}>
                                    <Text style={styles.title}>
                                        恭喜获得<Text style={{ color: Theme.themeRed }}>{userReward.gold}智慧点</Text>
                                    </Text>

                                    {userReward.ticket || userReward.contribute ? (
                                        <View style={styles.rewardContainer}>
                                            <Text style={{ color: Theme.grey }}>同时奖励</Text>
                                            {userReward.ticket ? (
                                                <Fragment>
                                                    <Image
                                                        source={require('../../assets/images/heart.png')}
                                                        style={styles.ticketImage}
                                                    />
                                                    <Text>+{userReward.ticket}</Text>
                                                </Fragment>
                                            ) : null}
                                            {userReward.contribute ? (
                                                <Fragment>
                                                    <Image
                                                        source={require('../../assets/images/gongxian.png')}
                                                        style={styles.contributeImage}
                                                    />
                                                    <Text>+{userReward.contribute}</Text>
                                                </Fragment>
                                            ) : null}
                                        </View>
                                    ) : null}
                                </View>
                            </View>
                        </View>
                        <View>
                            <ttad.FeedAd adWidth={SCREEN_WIDTH - PxFit(40)} />
                        </View>
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.operation}
                                onPress={() => {
                                    RewardTips.hide();
                                }}>
                                <Text style={styles.operationText}>忽略</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.operation, { borderLeftColor: Theme.lightBorder, borderLeftWidth: 0.5 }]}
                                onPress={() => {
                                    RewardTips.hide();
                                    navigation.navigate('BillingRecord', { initialPage: 1 });
                                }}>
                                <Text style={[styles.operationText, { color: Theme.theme }]}>查看</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Overlay.View>
        );
        this.OverlayKey = Overlay.show(overlayView);
    }

    static hide() {
        Overlay.hide(this.OverlayKey);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerImage: {
        width: 62,
        height: 62,
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
    },
    content: {
        width: SCREEN_WIDTH - PxFit(40),
        borderRadius: PxFit(5),
        backgroundColor: Theme.white,
        padding: 0,
        // alignItems: 'center',
    },
    ticketImage: {
        width: 19,
        height: 19,
        marginLeft: 3,
        marginRight: 2,
    },
    contributeImage: {
        width: 15,
        height: 15,
        marginLeft: 3,
        paddingTop: 2,
        marginRight: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: PxFit(25),
        marginBottom: PxFit(15),
    },
    headerText: {
        color: Theme.grey,
        fontSize: PxFit(13),
        textAlign: 'center',
        paddingTop: PxFit(3),
    },
    center: {
        paddingTop: PxFit(15),
        paddingBottom: PxFit(20),
        paddingHorizontal: PxFit(20),
    },
    centerTitle: {
        fontSize: PxFit(14),
        color: Theme.primaryFont,
        paddingTop: PxFit(10),
        lineHeight: PxFit(22),
    },
    centerInfo: {
        fontSize: PxFit(14),
        color: Theme.primaryFont,
        lineHeight: PxFit(22),
    },
    title: {
        fontSize: PxFit(18),
        color: Theme.black,
        fontWeight: '600',
    },
    modalFooter: {
        borderTopWidth: PxFit(0.5),
        borderTopColor: Theme.tintGray,
        flexDirection: 'row',
        marginTop: PxFit(15),
    },
    operation: {
        paddingVertical: PxFit(15),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    operationText: {
        fontSize: PxFit(15),
        fontWeight: '400',
        color: Theme.grey,
    },
});

export default RewardTips;
