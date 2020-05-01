/*
 * @flow
 * created by wyk made in 2019-03-22 14:31:09
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import Iconfont from '../Iconfont';

class GenderLabel extends Component {
    render() {
        const { user } = this.props;
        return (
            <ImageBackground
                source={
                    user.gender
                        ? require('@src/assets/images/bg_gender_label_girl.png')
                        : require('@src/assets/images/bg_gender_label_boy.png')
                }
                style={{
                    height: PxFit(11),
                    width: (PxFit(11) * 82) / 35,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Iconfont name={user.gender ? 'woman' : 'man'} size={PxFit(8)} color={Theme.white} />
                <Text
                    style={{
                        fontSize: PxFit(8),
                        color: '#fff',
                        paddingLeft: PxFit(1),
                    }}>
                    {Helper.syncGetter('profile.age', user) || 1}
                </Text>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({});

export default GenderLabel;
