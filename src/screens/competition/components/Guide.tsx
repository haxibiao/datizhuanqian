import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@src/components';
import { Theme, SCREEN_WIDTH, PxFit, WPercent } from '@src/utils';
import { app } from 'store';

const Guide = props => {
    return (
        <View style={styles.contentWrap}>
            <Text style={styles.title}>规则说明</Text>
            <View>
                <Text style={styles.text}>1.所有场次对手随即匹配，每场对战总共8道题目。</Text>
                <Text style={styles.highlight}>
                    2.对战开始前，系统自动扣除所需的<Text style={styles.highlight}>{app.gameConfig.ticket_loss}</Text>
                    精力点与<Text style={styles.highlight}>{app.gameConfig.gold_loss}</Text>智慧点。
                </Text>
                <Text style={styles.text}>
                    3.对战结束后将进行奖励结算。战胜对手，奖励翻倍；平局按原智慧点返还；失败则不返还智慧点。
                </Text>
                <Text style={styles.text}>4.为了保障双方游戏体验，对战途中主动离场的一方将默认认输。</Text>
            </View>
            <Button title={'知道了'} onPress={props.hide} style={styles.buttonText} />
        </View>
    );
};

const styles = StyleSheet.create({
    contentWrap: {
        width: WPercent(80),
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
        lineHeight: PxFit(18),
        fontSize: PxFit(14),
        color: Theme.subTextColor,
    },
    highlight: {
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
