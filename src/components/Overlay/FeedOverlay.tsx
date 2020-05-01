/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:28:10
 */
import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';

import Button from '../TouchableView/Button';
import TouchFeedback from '../TouchableView/TouchFeedback';

import { Overlay } from 'teaset';
import { ad } from 'native';
import { playVideo } from 'common';

interface Props {
    title: String;
}

class FeedOverlay {
    static OverlayKey: any;
    static show(props: Props) {
        const { title } = props;
        const overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View>
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={require('@src/assets/images/bg_answer_achievement_top.png')}
                                    style={styles.headerImage}
                                />
                            </View>
                            <View style={styles.wrap}>
                                <Text style={{ fontSize: Font(16), textAlign: 'center', fontWeight: 'bold' }}>
                                    领取失败
                                </Text>
                                <Text style={{ fontSize: Font(14), textAlign: 'center', marginTop: PxFit(8) }}>
                                    {title}
                                </Text>
                            </View>
                            {/*  <View>
                                <ad.FeedAd adWidth={Device.WIDTH - PxFit(80)} />
                            </View> */}

                            <View style={{ alignItems: 'center', marginTop: PxFit(5), paddingBottom: PxFit(15) }}>
                                <Button
                                    style={styles.button}
                                    textColor={Theme.white}
                                    title={'知道了'}
                                    onPress={() => {
                                        FeedOverlay.hide();
                                    }}
                                />
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
        width: Device.WIDTH,
        height: Device.HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: Device.WIDTH - PxFit(48),
        borderRadius: PxFit(10),
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    wrap: {
        alignItems: 'center',
        marginTop: PxFit(15),
        paddingBottom: PxFit(15),
        paddingHorizontal: PxFit(25),
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
        width: (Device.WIDTH * 0.25 * 466) / 232,
        height: Device.WIDTH * 0.25,
        marginTop: PxFit(-60),
    },
    button: {
        backgroundColor: Theme.themeRed,
        borderRadius: PxFit(19),
        height: PxFit(38),
        width: (Device.WIDTH * 5) / 12,
    },
    line: {
        backgroundColor: Theme.theme,
        height: PxFit(0.5),
        width: Device.WIDTH / 4,
    },
});

export default FeedOverlay;
