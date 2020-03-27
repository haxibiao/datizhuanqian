/*
 * @flow
 * created by wyk made in 2019-03-18 22:28:33
 */

import React, { Component } from 'react';
import { StyleSheet, Platform, View, Keyboard, LayoutAnimation, StatusBar, Dimensions } from 'react-native';
import app from '../../store/app';
import DeviceInfo from 'react-native-device-info';
import { Theme, PxFit, ISIOS, ISAndroid } from '../../utils';

type Props = {
    topInsets?: number,
};

class KeyboardSpacer extends Component<Props> {
    static defaultProps = {
        topInsets: 0,
    };

    constructor(props: Props) {
        super(props);
        this.showListener = null;
        this.hideListener = null;
        this.state = {
            keyboardHeight: 0,
        };
    }

    componentDidMount() {
        if (!this.showListener) {
            const name = ISIOS ? 'keyboardWillShow' : 'keyboardDidShow';
            this.showListener = Keyboard.addListener(name, e => this.onKeyboardShow(e));
        }
        if (!this.hideListener) {
            const name = ISIOS ? 'keyboardWillHide' : 'keyboardDidHide';
            this.hideListener = Keyboard.addListener(name, () => this.onKeyboardHide());
        }
    }

    componentWillUnmount() {
        if (this.showListener) {
            this.showListener.remove();
            this.showListener = null;
        }
        if (this.hideListener) {
            this.hideListener.remove();
            this.hideListener = null;
        }
    }

    componentWillUpdate(props, state) {
        if (state.keyboardHeight !== this.state.keyboardHeight) {
            LayoutAnimation.configureNext({
                duration: 500,
                create: {
                    duration: 300,
                    type: LayoutAnimation.Types.easeInEaseOut,
                    property: LayoutAnimation.Properties.opacity,
                },
                update: {
                    type: LayoutAnimation.Types.spring,
                    springDamping: 200,
                },
            });
        }
    }

    onKeyboardShow(e) {
        let FixTopInsets = 0;
        if (['Redmi', 'Xiaomi', 'HUAWEI', 'OPPO', 'google'].includes(DeviceInfo.getBrand())) {
            FixTopInsets = app.viewportHeight - Dimensions.get('window').height || 0;
        }
        if (
            DeviceInfo.getBrand() === 'meizu' &&
            DeviceInfo.getSystemVersion() >= 8 &&
            Math.floor(Dimensions.get('window').height) === Math.floor(Dimensions.get('screen').height)
        ) {
            FixTopInsets = -16;
        }
        if (!e || !e.endCoordinates || !e.endCoordinates.height) return;
        let height = e.endCoordinates.height + (this.props.topInsets || 0);
        height += FixTopInsets;
        this.setState({ keyboardHeight: height });
    }

    onKeyboardHide() {
        this.setState({ keyboardHeight: 0 });
    }

    render() {
        return <View style={[styles.keyboardSpace, { height: this.state.keyboardHeight }]} />;
    }
}

const styles = StyleSheet.create({
    keyboardSpace: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default KeyboardSpacer;
