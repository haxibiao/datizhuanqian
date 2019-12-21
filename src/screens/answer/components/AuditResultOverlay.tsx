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
    title: string;
    rewardVideo: boolean;
}

class AuditResultOverlay {
    static OverlayKey: any;
    static show(props: Props) {
        const { title, rewardVideo } = props;

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
                                <Text style={{ fontSize: PxFit(15) }}>感谢您的审题意见</Text>
                                <View style={{ marginTop: PxFit(15) }}>
                                    <Text style={styles.rewordText}>正在发放审题辛苦奖励</Text>
                                    <Row>
                                        <Text style={styles.rewordText}>退出将错失领取</Text>
                                        <Row style={styles.reword}>
                                            <Image
                                                source={require('../../../assets/images/diamond.png')}
                                                style={{ width: PxFit(18), height: PxFit(18) }}
                                            />
                                            <Text style={styles.rewordText}>{`+6`}</Text>
                                        </Row>
                                        <Row style={styles.reword}>
                                            <Image
                                                source={require('../../../assets/images/gongxian.png')}
                                                style={{ width: PxFit(14), height: PxFit(14) }}
                                            />
                                            <Text style={styles.rewordText}>{`+1`}</Text>
                                        </Row>
                                        <Text style={styles.rewordText}>奖励的机会</Text>
                                    </Row>
                                </View>
                            </View>

                            <View>
                                <ad.FeedAd adWidth={SCREEN_WIDTH - PxFit(48)} />
                            </View>

                            <View style={{ alignItems: 'center', marginTop: PxFit(5), paddingBottom: 10 }}>
                                <Button
                                    style={styles.button}
                                    textColor={Theme.white}
                                    title={'看视频领奖励'}
                                    onPress={() => {
                                        playVideo({
                                            type: 'Audit',
                                        });
                                        AuditResultOverlay.hide();
                                    }}
                                />

                                <TouchFeedback
                                    style={{ paddingTop: 10 }}
                                    onPress={() => {
                                        AuditResultOverlay.hide();
                                    }}>
                                    <Text style={{ color: Theme.grey }}>{'放弃奖励'}</Text>
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

export default AuditResultOverlay;
