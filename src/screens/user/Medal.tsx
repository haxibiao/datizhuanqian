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

const Medal = (props: Props) => {
    const { navigation, user } = props;
    console.log('WithdrawHeader user :', user);

    return (
        <View>
            <ImageBackground
                source={require('@src/assets/images/withdraw_bg.png')}
                style={{
                    width: SCREEN_WIDTH,
                    height: (SCREEN_WIDTH * 687) / 1080,
                }}>
                <Row style={styles.header}>
                    <TouchFeedback onPress={() => navigation.goBack()}>
                        <Iconfont name="left" color={Theme.navBarTitleColor} size={PxFit(21)} />
                    </TouchFeedback>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerText}>我的勋章</Text>
                    </View>
                </Row>
                <Row style={styles.title}>
                    <Text style={styles.titleCount}>2</Text>
                    <Text style={styles.titleText}>个</Text>
                </Row>
            </ImageBackground>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: PxFit(15),
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                }}>
                <View style={{ alignItems: 'center', marginTop: PxFit(15) }}>
                    <Image
                        source={require('@src/assets/images/medal1.png')}
                        style={{ width: SCREEN_WIDTH / 4, height: SCREEN_WIDTH / 4, marginBottom: PxFit(10) }}
                    />
                    <Text>答题王者</Text>
                </View>
                <View style={{ alignItems: 'center', marginTop: PxFit(15) }}>
                    <Image
                        source={require('@src/assets/images/medal1.png')}
                        style={{ width: SCREEN_WIDTH / 4, height: SCREEN_WIDTH / 4, marginBottom: PxFit(10) }}
                    />
                    <Text>答题王者</Text>
                </View>
                <View style={{ alignItems: 'center', marginTop: PxFit(15) }}>
                    <Image
                        source={require('@src/assets/images/medal1.png')}
                        style={{ width: SCREEN_WIDTH / 4, height: SCREEN_WIDTH / 4, marginBottom: PxFit(10) }}
                    />
                    <Text>答题王者</Text>
                </View>
                <View style={{ alignItems: 'center', marginTop: PxFit(15) }}>
                    <Image
                        source={require('@src/assets/images/medal1.png')}
                        style={{ width: SCREEN_WIDTH / 4, height: SCREEN_WIDTH / 4, marginBottom: PxFit(10) }}
                    />
                    <Text>答题王者</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: PxFit(NAVBAR_HEIGHT),
        paddingTop: PxFit(Theme.statusBarHeight) + PxFit(10),
    },
    headerCenter: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
    },
    headerText: {
        fontSize: PxFit(17),
        color: Theme.navBarTitleColor,
        paddingRight: PxFit(10),
    },
    title: {
        marginTop: PxFit(25),
        justifyContent: 'center',
    },
    titleCount: {
        fontSize: PxFit(50),
        fontWeight: '600',
        color: Theme.white,
    },
    titleText: {
        fontSize: PxFit(15),
        color: Theme.white,
        paddingTop: PxFit(26),
        paddingLeft: PxFit(10),
    },
});
export default Medal;
