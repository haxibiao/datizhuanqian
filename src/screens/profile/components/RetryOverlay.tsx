/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:28:10
 */
import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';

import { TouchFeedback, Button, Row } from 'components';

import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT } from 'utils';

import { Overlay } from 'teaset';
import { ad } from 'native';
import { playVideo } from 'common';

interface Props {
    callback: Function;
}

class RetryOverlay {
    static OverlayKey: any;
    static show(props: Props) {
        const overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View>
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={require('../../../assets/images/money_.png')}
                                    style={styles.headerImage}
                                />
                            </View>
                            <View style={styles.wrap}>
                                <Text style={{ fontSize: PxFit(15) }}>看视频即可重新上传</Text>
                            </View>
                            <View>
                                <ad.FeedAd adWidth={SCREEN_WIDTH - PxFit(48)} />
                            </View>

                            <View style={{ alignItems: 'center', marginTop: PxFit(5), paddingBottom: 10 }}>
                                <Button
                                    style={styles.button}
                                    textColor={Theme.white}
                                    title={'看激励视频'}
                                    onPress={() => {
                                        playVideo({
                                            type: 'Spider',
                                            callback: props.callback,
                                            noReward: true,
                                        });
                                        RetryOverlay.hide();
                                    }}
                                />

                                <TouchFeedback
                                    style={{ paddingTop: 10 }}
                                    onPress={() => {
                                        RetryOverlay.hide();
                                    }}>
                                    <Text style={{ color: Theme.grey }}>{'下次吧'}</Text>
                                </TouchFeedback>
                            </View>
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
    content: {
        width: SCREEN_WIDTH - PxFit(48),
        borderRadius: PxFit(6),
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    wrap: {
        alignItems: 'center',
        paddingBottom: 10,
    },
    reword: {
        marginLeft: PxFit(2),
    },
    rewordText: {
        color: Theme.primaryColor,
        fontSize: PxFit(13),
        fontWeight: '200',
        textAlign: 'center',
        // fontFamily: '',
    },
    headerImage: {
        width: 120,
        height: 120,
        marginTop: -60,
    },
    button: {
        backgroundColor: Theme.themeRed,
        borderRadius: PxFit(19),
        height: PxFit(38),
        width: (SCREEN_WIDTH * 5) / 12,
    },
    line: {
        backgroundColor: Theme.theme,
        height: PxFit(0.5),
        width: SCREEN_WIDTH / 4,
    },
});

export default RetryOverlay;
