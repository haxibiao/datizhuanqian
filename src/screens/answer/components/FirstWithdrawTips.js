/* eslint-disable react-native/sort-styles */
/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 14:41:10
 */

import React, { Component } from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import { TouchFeedback } from 'components';
import { Config, PxFit, SCREEN_WIDTH } from 'utils';

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
                    hide();
                    navigation.navigate('提现');
                    app.updateWithdrawTips(false);
                    // this.props.hide();
                    console.log('this.props.hide();', this.props.hide);
                }}>
                <Image
                    source={require('../../../assets/images/first_withdraw_tips.png')}
                    style={{ width: (SCREEN_WIDTH * 4) / 5, height: (((SCREEN_WIDTH * 4) / 5) * 984) / 800 }}
                />
            </TouchFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH - PxFit(90),
        borderRadius: PxFit(15),
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
});

export default FirstWithdrawTips;
