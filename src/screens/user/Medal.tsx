import React, { useState, useEffect, Fragment, useRef } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ImageBackground } from 'react-native';
import { TouchFeedback, Button, SubmitLoading, TipsOverlay, ItemSeparator, Row, Iconfont } from 'components';
import { useQuery, GQL, useMutation } from 'apollo';
import { app, config } from 'store';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, Tools, ISAndroid, NAVBAR_HEIGHT } from 'utils';
import { playVideo, bindWechat, checkUserInfo } from 'common';
import { Overlay } from 'teaset';
import MedalIntro from './components/MedalIntro';

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

    const showMedalIntro = medal => {
        const overlayView = (
            <Overlay.View animated>
                <View style={styles.overlayInner}>
                    <MedalIntro hide={() => Overlay.hide(OverlayKey)} medal={medal} />
                </View>
            </Overlay.View>
        );
        const OverlayKey = Overlay.show(overlayView);
    };

    const { data, loading, error } = useQuery(GQL.MedalsQuery, { fetchPolicy: 'network-only' });

    if (loading) return null;
    return (
        <View>
            <ImageBackground
                source={require('@src/assets/images/medal_bg.png')}
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
            <View style={styles.medalList}>
                {data.medals.map((medal, index) => {
                    return (
                        <TouchFeedback style={styles.medalContent} key={index} onPress={() => showMedalIntro(medal)}>
                            <Image source={{ uri: medal.done_icon_url }} style={styles.medalImage} />
                            <Text>{medal.name_cn || '才高八斗'}</Text>
                        </TouchFeedback>
                    );
                })}
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
    medalList: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: PxFit(15),
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor: '#FEFEFE',
    },
    medalContent: {
        alignItems: 'center',
        marginTop: PxFit(25),
    },
    medalImage: {
        width: SCREEN_WIDTH / 4,
        height: SCREEN_WIDTH / 4,
        marginBottom: PxFit(10),
    },
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
});
export default Medal;