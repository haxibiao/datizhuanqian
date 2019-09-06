/*
 * @flow
 * created by wyk made in 2019-03-22 14:31:09
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Iconfont from '../Iconfont';
import { Theme, PxFit, Tools } from '../../utils';

class GenderLabel extends Component {
    static defaultProps = {
        size: PxFit(15),
    };

    render() {
        let { user, size } = this.props;
        return (
            <Iconfont
                name={user.gender ? 'woman' : 'man'}
                size={size}
                color={user.gender ? Theme.girlColor : Theme.boyColor}
            />
        );
    }
}

const styles = StyleSheet.create({});

export default GenderLabel;
