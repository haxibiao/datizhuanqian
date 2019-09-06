/*
 * @flow
 * created by wyk made in 2019-03-26 13:28:33
 */
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, ViewPropTypes } from 'react-native';
import { Theme, PxFit, Tools } from '../../utils';

export default class Badge extends Component {
    static propTypes = {
        ...ViewPropTypes,
        countStyle: Text.propTypes.style,
        count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maxCount: PropTypes.number,
    };

    static defaultProps = {
        maxCount: 99,
    };

    buildProps() {
        let { style, countStyle, count, maxCount } = this.props;

        let width, height, borderRadius, borderWidth;
        width = PxFit(20);
        height = PxFit(20);
        borderRadius = width / 2;

        style = [
            {
                backgroundColor: Theme.errorColor,
                minWidth: width,
                height: height,
                borderRadius: borderRadius,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
            },
        ].concat(style);

        countStyle = [
            {
                color: '#fff',
                fontSize: PxFit(11),
            },
        ].concat(countStyle);

        return { style, countStyle, count, maxCount };
    }

    render() {
        let { style, countStyle, count, maxCount } = this.buildProps();
        if (!count || count <= 0) return null;
        return (
            <View style={style}>
                <Text style={countStyle} allowFontScaling={false} numberOfLines={1}>
                    {count > maxCount ? maxCount + '+' : count}
                </Text>
            </View>
        );
    }
}
