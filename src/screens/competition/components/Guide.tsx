import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@src/components';

const Guide = props => {
    return (
        <View style={styles.contentWrap}>
            <Text style={styles.title}>规则说明</Text>
            <View>
                <Text style={styles.text}>1. 所有场次对手随即匹配，每场对战总共8道题目。</Text>
                <Text style={styles.text}>2. 每道题目的答题时间为10秒钟，系统自动切换题目。</Text>
                <Text style={styles.highlight}>
                    3. 对战结束后将进行奖励结算。战胜对手，最高可获得
                    <Text style={{ fontWeight: 'bold', color: Theme.primaryColor }}>200智慧点</Text>奖励。
                </Text>
                <Text style={styles.text}>4. 为了保障双方游戏体验，对战途中主动离场的一方将默认认输。</Text>
            </View>
            <Button title={'知道了'} onPress={props.hide} style={styles.buttonText} />
        </View>
    );
};

const styles = StyleSheet.create({
    contentWrap: {
        width: Percent(80),
        maxWidth: PxFit(300),
        padding: PxFit(20),
        borderRadius: PxFit(10),
        backgroundColor: '#fff',
    },
    title: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(18),
        textAlign: 'center',
        marginBottom: PxFit(10),
    },
    text: {
        paddingVertical: PxFit(5),
        lineHeight: PxFit(20),
        fontSize: PxFit(14),
        color: Theme.subTextColor,
    },
    highlight: {
        paddingVertical: PxFit(5),
        lineHeight: PxFit(20),
        fontSize: PxFit(14),
        color: Theme.watermelon,
    },
    buttonText: {
        height: PxFit(40),
        borderRadius: PxFit(20),
        marginTop: PxFit(15),
        backgroundColor: Theme.watermelon,
    },
});

export default Guide;
