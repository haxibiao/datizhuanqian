import React, { Fragment, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

import { Overlay } from 'teaset';

import { TouchFeedback, Iconfont, Row, Button } from '@src/components';
import { ad } from 'native';
import { playVideo } from 'common';
import { app } from '@src/store';

interface Props {
    handler: Function;
}
let OverlayKey: any = null;

const AuditResultOverlay = props => {
    const { handler } = props;
    const [adShow, setAdShow] = useState(false);
    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.content,
                    adShow ? {} : { borderBottomLeftRadius: PxFit(10), borderBottomRightRadius: PxFit(10) },
                ]}>
                <TouchFeedback style={styles.operation} onPress={hide}>
                    <Iconfont name={'close'} color={'#D8D8D8'} size={Font(16)} />
                </TouchFeedback>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('@src/assets/images/bg_overlay_top.png')} style={styles.headerImage} />
                    </View>

                    <View style={styles.wrap}>
                        <Text style={{ fontSize: Font(16), textAlign: 'center', fontWeight: 'bold' }}>
                            感谢您的审题意见
                        </Text>
                        <View style={styles.rewardContainer}>
                            <Text style={{ color: Theme.grey }}>可额外获得</Text>
                            <Text style={{ color: Theme.theme, paddingLeft: PxFit(3) }}>
                                6智慧点
                                <Text style={{ color: Theme.theme }}>{' 1贡献点'}</Text>
                            </Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: PxFit(5), paddingBottom: PxFit(15) }}>
                        <Button
                            style={styles.button}
                            textColor={'#623605'}
                            title={'看视频领取'}
                            onPress={() => {
                                playVideo({
                                    type: 'Audit',
                                });
                                hide();
                            }}
                        />
                    </View>
                    <Row style={{ justifyContent: 'center' }}>
                        <Text
                            style={{
                                fontSize: Font(12),
                                color: '#999999',
                            }}>
                            小提示:随意审题是会被关小黑屋的哦
                        </Text>
                    </Row>
                </View>
            </View>
            {adShow && (
                <Image
                    source={require('@src/assets/images/bg_feed_overlay_line.png')}
                    style={{
                        width: Device.WIDTH - PxFit(48),
                        height: ((Device.WIDTH - PxFit(48)) * 30) / 640,
                    }}
                />
            )}

            <View
                style={{
                    width: Device.WIDTH - PxFit(48),
                    backgroundColor: '#FFF',
                    borderBottomLeftRadius: PxFit(10),
                    borderBottomRightRadius: PxFit(10),
                }}>
                <ad.FeedAd
                    adWidth={Device.WIDTH - PxFit(50)}
                    onAdShow={() => {
                        setAdShow(true);
                    }}
                />
            </View>
        </View>
    );
};

export const show = (props: Props) => {
    const overlayView = (
        <Overlay.View animated>
            <AuditResultOverlay {...props} />
        </Overlay.View>
    );
    OverlayKey = Overlay.show(overlayView);
};
export const hide = () => {
    Overlay.hide(OverlayKey);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
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
    content: {
        width: Device.WIDTH - PxFit(48),
        borderTopLeftRadius: PxFit(10),
        borderTopRightRadius: PxFit(10),
        backgroundColor: '#FFF',
        alignItems: 'center',
        paddingBottom: PxFit(15),
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
        width: (Device.WIDTH * 0.32 * 487) / 375,
        height: Device.WIDTH * 0.32,
        marginTop: PxFit(-75),
    },
    button: {
        backgroundColor: '#FCE03D',
        borderRadius: PxFit(19),
        height: PxFit(38),
        width: Device.WIDTH * 0.6,
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
    },

    line: {
        backgroundColor: Theme.theme,
        height: PxFit(0.5),
        width: Device.WIDTH / 4,
    },
});

export default { show, hide };
