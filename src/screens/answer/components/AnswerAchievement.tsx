/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:28:10
 */

import { Overlay } from 'teaset';
import React, { useState } from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { TouchFeedback, Button, Row, Iconfont } from '@src/components';
import { ad } from 'native';
import { playVideo } from 'common';

interface AnswerInfo {
    answerCount: number;
    errorCount: number;
}

let OverlayKey: any = null;

const AnswerAchievement = props => {
    const { answerCount, errorCount } = props;

    const answerResult = errorCount / answerCount <= 0.4; // 60%正确及格

    return (
        <View style={styles.overlayInner}>
            <View style={styles.container}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('@src/assets/images/bg_answer_achievement_top.png')}
                        style={styles.headerImage}
                    />
                </View>
                {answerResult && (
                    <TouchFeedback style={styles.operation} onPress={hide}>
                        <Iconfont name={'close'} color={'#D8D8D8'} size={Font(16)} />
                    </TouchFeedback>
                )}
                <View style={styles.wrap}>
                    <Text style={{ fontSize: Font(16), fontWeight: 'bold', color: '#333333' }}>{`本轮答题挑战${
                        answerResult ? '成功' : '失败'
                    } `}</Text>
                    <Row
                        style={{
                            justifyContent: 'space-between',
                            width: Device.WIDTH * 0.38,
                            marginTop: PxFit(15),
                        }}>
                        <Text style={{ color: '#666666', fontSize: Font(15) }}>
                            {`正确：`}
                            <Text style={{ color: Theme.weixin, fontSize: Font(16) }}>{answerCount - errorCount}</Text>
                        </Text>
                        <Text style={{ color: '#666666', fontSize: Font(15) }}>
                            {`错误：`}
                            <Text style={{ color: Theme.errorColor, fontSize: Font(16) }}>{errorCount}</Text>
                        </Text>
                    </Row>
                </View>
                <View style={{ alignItems: 'center', marginTop: PxFit(10), paddingBottom: PxFit(5) }}>
                    <Button
                        style={styles.button}
                        textColor={'#623605'}
                        title={'看视频领奖励'}
                        onPress={() => {
                            //加载广告
                            playVideo({
                                type: answerResult ? 'AnswerPass' : 'AnswerFail',
                            });
                            hide();
                        }}
                    />
                </View>

                <View
                    style={{
                        minHeight: PxFit(10),
                        paddingTop: PxFit(10),
                        paddingBottom: PxFit(10),
                        // backgroundColor: '#F00',
                    }}>
                    <View>
                        <ad.FeedAd adWidth={Device.WIDTH - PxFit(70)} />
                    </View>
                </View>
            </View>
        </View>
    );
};

export const show = (props: AnswerInfo) => {
    const overlayView = (
        <Overlay.View animated modal ref={ref => (overlayViewRef = ref)}>
            <AnswerAchievement {...props} />
        </Overlay.View>
    );
    OverlayKey = Overlay.show(overlayView);
};

export const hide = () => {
    Overlay.hide(OverlayKey);
};

const styles = StyleSheet.create({
    overlayInner: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: Device.WIDTH - PxFit(60),
        borderRadius: PxFit(10),
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    wrap: {
        paddingTop: PxFit(20),
        alignItems: 'center',
        paddingBottom: PxFit(20),
        width: Device.WIDTH * 0.4,
    },
    headerImage: {
        width: (Device.WIDTH * 0.25 * 466) / 232,
        height: Device.WIDTH * 0.25,
        marginTop: PxFit(-60),
    },
    operation: {
        position: 'absolute',
        right: PxFit(0),
        top: PxFit(0),
        paddingTop: PxFit(10),
        paddingHorizontal: PxFit(15),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#FCE03D',
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

export default { show, hide };
