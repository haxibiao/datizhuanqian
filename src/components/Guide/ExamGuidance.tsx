/*
 * @flow
 * created by wyk made in 2019-09-10 14:32:24
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function ExamGuidance() {
    return (
        <View style={styles.flexCenter}>
            <View style={{ alignItems: 'center', height: Device.HEIGHT * 0.6, justifyContent: 'space-between' }}>
                <View style={{ width: Device.WIDTH - PxFit(60), alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: PxFit(20), fontWeight: 'bold' }}>考试模式</Text>
                    <Text style={{ color: 'white', fontSize: PxFit(15), marginTop: PxFit(40) }}>
                        由答题官方为您个性化推荐的练习题组，每5~10题为1组，考试结束系统自动提醒交卷
                    </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: PxFit(15) }}>左右滑动可切上一题、下一题哦</Text>
                    <View
                        style={{
                            borderWidth: PxFit(1),
                            borderColor: 'white',
                            borderRadius: PxFit(6),
                            width: Device.WIDTH - PxFit(60),
                            height: PxFit(48),
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: PxFit(50),
                        }}>
                        <Text style={{ color: 'white', fontSize: PxFit(15) }}>知道了</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const WIDTH = Device.WIDTH;
const HEIGHT = (WIDTH * 1059) / 1040;
// const RIGHT = WIDTH / 2 - (WIDTH * 140) / 411;

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerGuide: {
        position: 'absolute',
        // top: TOP,
        // right: RIGHT,
        width: WIDTH,
        height: HEIGHT,
        resizeMode: 'contain',
    },
});

export default ExamGuidance;
