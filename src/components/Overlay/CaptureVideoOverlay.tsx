/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:28:10
 */
import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';

import { Overlay } from 'teaset';
import Button from '../TouchableView/Button';

import Iconfont from '../Iconfont';

const { height, width } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;

interface Props {
    path: String;
    image?: String;
}

class CaptureVideoOverlay {
    static OverlayKey: any;
    static show(props: Props) {
        const { path } = props;

        const overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <View style={styles.body}>
                        <Image
                            source={{ uri: 'http://cos.ainicheng.com/storage/img/80597.jpg' }}
                            style={{
                                width: (SCREEN_WIDTH * 4) / 5,
                                height: (((SCREEN_WIDTH * 4) / 5) * 9) / 16,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                            }}
                        />
                        <View
                            style={{ paddingTop: 25, paddingBottom: 15, paddingHorizontal: 15, alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center' }}>{path}</Text>
                        </View>
                        <Button
                            title={'立即发布'}
                            FontSize={14}
                            textColor={Theme.white}
                            style={{
                                height: PxFit(42),
                                borderRadius: PxFit(21),
                                marginTop: PxFit(10),
                                marginBottom: PxFit(20),
                                marginHorizontal: PxFit(40),
                                backgroundColor: Theme.themeRed,
                            }}
                        />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ width: 0.5, height: 26, backgroundColor: '#F0F0F0' }} />
                        <TouchableOpacity
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: '#F0F0F0',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                Overlay.hide(this.OverlayKey);
                            }}>
                            <Iconfont name={'close'} color={'#F0F0F0'} size={28} />
                        </TouchableOpacity>
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
    body: {
        width: (SCREEN_WIDTH * 4) / 5,
        borderRadius: PxFit(5),
        backgroundColor: Theme.white,
        padding: 0,
    },
});

export default CaptureVideoOverlay;
