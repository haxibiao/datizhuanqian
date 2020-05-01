/*
 * @flow
 * created by wyk made in 2019-09-10 15:38:23
 */
import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback } from 'react-native';

function inputGuidance({ onDismiss }) {
    const [step, setStep] = useState(0);
    const guidesView = useMemo(() => {
        return [
            <TouchableWithoutFeedback
                key={1}
                onPress={() => {
                    setStep(1);
                }}>
                <View style={styles.flexContainer}>
                    <Image style={styles.guideImage01} source={require('../../assets/images/set_question_1_1.png')} />
                    <Image style={styles.guideImage02} source={require('../../assets/images/set_question_1_2.png')} />
                </View>
            </TouchableWithoutFeedback>,
            <TouchableWithoutFeedback
                key={2}
                onPress={() => {
                    onDismiss();
                }}>
                <View style={styles.flexContainer}>
                    <Image style={styles.guideImage03} source={require('../../assets/images/set_question_2_1.png')} />
                    <Image style={styles.guideImage04} source={require('../../assets/images/set_question_2_2.png')} />
                </View>
            </TouchableWithoutFeedback>,
        ];
    }, []);

    return guidesView[step];
}

function submitGuidance({ onDismiss }) {
    const [step, setStep] = useState(0);
    const guidesView = useMemo(() => {
        return [
            <TouchableWithoutFeedback
                key={1}
                onPress={() => {
                    setStep(1);
                }}>
                <View style={styles.flexContainer}>
                    <Image style={styles.guideImage05} source={require('../../assets/images/set_question_3_1.png')} />
                </View>
            </TouchableWithoutFeedback>,
            <TouchableWithoutFeedback
                key={2}
                onPress={() => {
                    setStep(2);
                }}>
                <View style={styles.flexContainer}>
                    <Image style={styles.guideImage06} source={require('../../assets/images/set_question_4_1.png')} />
                </View>
            </TouchableWithoutFeedback>,
            <TouchableWithoutFeedback
                key={3}
                onPress={() => {
                    onDismiss();
                }}>
                <View style={styles.flexContainer}>
                    <Image style={styles.guideImage07} source={require('../../assets/images/set_question_5_1.png')} />
                    <Image style={styles.guideImage08} source={require('../../assets/images/set_question_5_2.png')} />
                </View>
            </TouchableWithoutFeedback>,
        ];
    }, []);

    return guidesView[step];
}

const G3Width = Device.WIDTH * 0.45;
const G5Width = Device.WIDTH - PxFit(Theme.itemSpace * 5);

const isSmallHeight = Device.HEIGTH < 667;
const G3Height = (G3Width * 505) / 473;
const G5Height = (G5Width * 280) / 810;
const G6Height = ((Device.WIDTH - PxFit(Theme.itemSpace) * 2) * 445) / 1001;
const G7Height = ((Device.WIDTH - PxFit(Theme.itemSpace) * 2) * 357) / 1003;

const G5Top = isSmallHeight ? Device.HEIGTH - G5Height : Device.NAVBAR_HEIGHT + PxFit(Theme.itemSpace) * 6 + PxFit(360);
const G6Top = isSmallHeight ? Device.HEIGTH - G6Height : Device.NAVBAR_HEIGHT + PxFit(Theme.itemSpace) * 6 + PxFit(254);
const G7Top = isSmallHeight
    ? Device.HEIGTH - G7Height
    : Device.NAVBAR_HEIGHT + PxFit(Theme.itemSpace) * 6 + PxFit(202) - (G7Height * 220) / 357;

const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGTH,
    },
    guideImage01: {
        position: 'absolute',
        top: Device.NAVBAR_HEIGHT + PxFit(Theme.itemSpace) * 3,
        right: PxFit(Theme.itemSpace),
        width: Device.WIDTH / 2,
        height: ((Device.WIDTH / 2) * 253) / 586,
        resizeMode: 'contain',
    },
    guideImage02: {
        position: 'absolute',
        top: Device.NAVBAR_HEIGHT + PxFit(Theme.itemSpace) * 3 + PxFit(130),
        left: PxFit(Theme.itemSpace),
        width: Device.WIDTH * 0.6,
        height: (Device.WIDTH * 0.6 * 360) / 731,
        resizeMode: 'contain',
    },
    guideImage03: {
        position: 'absolute',
        top: Device.NAVBAR_HEIGHT + PxFit(Theme.itemSpace) * 4 + PxFit(160) - (G3Height * 334) / 505,
        left: PxFit(Theme.itemSpace),
        width: G3Width,
        height: G3Height,
        resizeMode: 'contain',
    },
    guideImage04: {
        position: 'absolute',
        top: Device.NAVBAR_HEIGHT + PxFit(Theme.itemSpace) * 6 + PxFit(160),
        right: PxFit(Theme.itemSpace) + PxFit(10),
        width: Device.WIDTH / 2,
        height: ((Device.WIDTH / 2) * 359) / 550,
        resizeMode: 'contain',
    },
    guideImage05: {
        position: 'absolute',
        top: G5Top,
        left: PxFit(Theme.itemSpace + 10),
        width: G5Width,
        height: G5Height,
        resizeMode: 'contain',
    },
    guideImage06: {
        position: 'absolute',
        top: G6Top,
        left: PxFit(Theme.itemSpace),
        width: Device.WIDTH - PxFit(Theme.itemSpace) * 2,
        height: G6Height,
        resizeMode: 'contain',
    },
    guideImage07: {
        position: 'absolute',
        top: G7Top,
        left: PxFit(Theme.itemSpace),
        width: Device.WIDTH - PxFit(Theme.itemSpace) * 2,
        height: G7Height,
        resizeMode: 'contain',
    },
    guideImage08: {
        position: 'absolute',
        top: PxFit(Device.statusBarHeight),
        right: 0,
        width: 60 * (266 / 150),
        height: (60 * (266 / 150) * 285) / 266,
        resizeMode: 'contain',
    },
});

export default {
    inputGuidance,
    submitGuidance,
};
