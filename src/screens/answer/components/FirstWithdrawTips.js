/* eslint-disable react-native/sort-styles */
/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 14:41:10
 */

import React, { Component } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { TouchFeedback, Iconfont } from 'components';
import { Config, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, Theme } from 'utils';

import { app } from 'store';

class FirstWithdrawTips extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { navigation, hide } = this.props;
        return (
            <TouchFeedback
                style={styles.container}
                onPress={() => {
                    app.updateWithdrawTips(true);
                    hide();
                }}>
                <TouchFeedback
                    onPress={() => {
                        app.updateWithdrawTips(true);
                        navigation.navigate('提现');
                        hide();
                    }}>
                    <Image
                        source={require('../../../assets/images/first_withdraw_tips.png')}
                        style={{ width: (SCREEN_WIDTH * 4) / 5, height: (((SCREEN_WIDTH * 4) / 5) * 984) / 800 }}
                    />
                </TouchFeedback>
                <TouchFeedback
                    style={styles.close}
                    onPress={() => {
                        app.updateWithdrawTips(true);
                        hide();
                    }}>
                    <Iconfont name={'close'} color={Theme.white} size={24} />
                </TouchFeedback>
            </TouchFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    close: {
        borderColor: Theme.white,
        borderWidth: 1,
        borderRadius: 18,
        height: 36,
        width: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
});

export default FirstWithdrawTips;
