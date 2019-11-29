/*
 * @flow
 * created by wyk made in 2019-03-22 14:31:09
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Iconfont from '../Iconfont';
import { Theme, PxFit, Tools } from '../../utils';
import { app } from 'store';

class GenderLabel extends Component {
    render() {
        const { user } = this.props;
        return (
            <View
                style={{
                    backgroundColor: user.gender ? Theme.girlColor : Theme.boyColor,
                    paddingVertical: PxFit(1),
                    paddingHorizontal: PxFit(4),
                    // marginHorizontal: PxFit(5),
                    borderRadius: PxFit(10),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Iconfont name={user.gender ? 'woman' : 'man'} size={PxFit(8)} color={Theme.white} />
                <Text style={{ fontSize: PxFit(8), color: '#fff', lineHeight: PxFit(10), paddingLeft: PxFit(1) }}>
                    {Tools.syncGetter('profile.age', user) || 1}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({});

export default GenderLabel;
