/*
 * @flow
 * created by wyk made in 2019-08-29 21:34:55
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Theme, PxFit, ISIOS, ISAndroid } from '../../utils';
class ProgressWithdrawal extends Component {
    render() {
        const { step, data } = this.props;
        // step={parseInt(user.gold / 300)}
        // data={['¥0.5', '¥1.0', '¥1.5', '¥2.0', '¥2.5', '¥3.0']}
        let progress = Math.min((step / data.length) * 100, 100) + '%';
        return (
            <View style={styles.progressBar}>
                <View style={styles.progress}>
                    <View style={[styles.active, { width: progress }]} />
                    {data.map((elem, index) => {
                        return (
                            <View style={styles.progressItem} key={index}>
                                {step > index && (
                                    <Image source={require('../../assets/images/coin.png')} style={styles.coin} />
                                )}
                                <View style={styles.dot} />
                            </View>
                        );
                    })}
                </View>
                <View style={styles.row}>
                    {data.map((elem, index) => {
                        return (
                            <Text style={styles.text} key={index}>
                                {elem}
                            </Text>
                        );
                    })}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    progressBar: {
        position: 'relative',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    stepItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progress: {
        marginVertical: PxFit(5),
        position: 'relative',
        flexDirection: 'row',
        height: PxFit(8),
        borderRadius: PxFit(8),
        backgroundColor: '#FFF4E9',
    },
    active: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 0,
        borderRadius: PxFit(8),
        backgroundColor: '#ff5644',
    },
    progressItem: {
        flex: 1,
        marginHorizontal: PxFit(1),
        alignSelf: 'stretch',
        borderRadius: PxFit(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: PxFit(3),
        height: PxFit(3),
        borderRadius: PxFit(3),
        backgroundColor: '#fff',
    },
    coin: {
        backgroundColor: '#fff',
        width: PxFit(20),
        height: PxFit(20),
        borderRadius: PxFit(10),
    },
    text: {
        fontSize: PxFit(11),
        color: '#CBD7E1',
    },
});

export default ProgressWithdrawal;
