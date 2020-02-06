/*
 * @flow
 * created by wyk made in 2018-12-10 11:39:59
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Image, PixelRatio } from 'react-native';
import { Theme, PxFit } from '../../utils';

const ViewProps = require('ViewPropTypes');

type Props = {
    size?: number,
    style?: typeof ViewProps,
    ...Image.propTypes,
};

class Avatar extends Component<Props> {
    static defaultProps = {
        size: PxFit(44),
        style: {},
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
        };
    }

    render() {
        let { source, size, style } = this.props;
        let avatar = {
            width: size,
            height: size,
            borderRadius: PixelRatio.roundToNearestPixel(size / 2),
            backgroundColor: '#f9f9f9',
        };
        if (typeof source === 'string') {
            source = { uri: source };
        }

        return (
            <Image
                source={this.state.loading ? source : 'http://cos.datizhuanqian.com/storage/app/avatars/avatar.png'}
                resizeMode="cover"
                style={[avatar, style]}
                onError={this._onError}
            />
        );
    }

    _onError = nativeEvent => {
        console.log('nativeEvent', nativeEvent);
        this.setState({
            loading: false,
        });
    };
}

const styles = StyleSheet.create({});

export default Avatar;
