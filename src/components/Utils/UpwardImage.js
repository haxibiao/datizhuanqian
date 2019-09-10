/*
 * @flow
 * created by wyk made in 2019-07-04 11:48:14
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import { Theme, PxFit, Tools } from '../../utils';

const START_VALUE = 0;
const END_VALUE = 1;
const DURATION = 600;

class UpwardImage extends React.PureComponent {
    state = {
        show: false,
    };
    _animated = new Animated.Value(START_VALUE);

    start() {
        this._animated.setValue(START_VALUE);
        Animated.sequence([
            Animated.timing(this._animated, {
                toValue: END_VALUE,
                duration: DURATION,
                useNativeDriver: true,
            }),
            Animated.timing(this._animated, {
                toValue: START_VALUE,
                duration: DURATION,
                useNativeDriver: true,
            }),
        ]).start(e => {
            if (e.finished) {
                this.start();
            }
        });
    }

    show() {
        console.log('show');
        this.setState(
            pre => ({
                show: true,
            }),
            () => {
                this.start();
                this.interval();
            },
        );
    }

    hide() {
        this.setState({ show: false });
    }

    interval() {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.hide();
        }, 3500);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        if (!this.state.show) {
            return null;
        }
        console.log('render');
        return (
            <View style={[styles.wrap, this.props.style]}>
                <Animated.Image
                    source={require('../../assets/images/upward.png')}
                    style={{
                        width: PxFit(30),
                        height: PxFit(30),
                        transform: [
                            {
                                translateY: this._animated.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, PxFit(30)],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: PxFit(30),
    },
});

export default UpwardImage;
