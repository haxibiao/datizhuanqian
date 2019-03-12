/*
 * @flow
 * created by wyk made in 2019-03-12 17:23:10
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, Platform, View, Keyboard, LayoutAnimation } from 'react-native';
import DeviceInfo from 'react-native-device-info';
const systemVersion = DeviceInfo.getSystemVersion();

type Props = {
	topInsets?: number
};

class KeyboardSpacer extends Component<Props> {
	static defaultProps = {
		topInsets: 0
	};

	constructor(props: Props) {
		super(props);
		this.showListener = null;
		this.hideListener = null;
		this.state = {
			keyboardHeight: 0
		};
	}

	componentDidMount() {
		if (!this.showListener) {
			let name = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
			this.showListener = Keyboard.addListener(name, e => this.onKeyboardShow(e));
		}
		if (!this.hideListener) {
			let name = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
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
					property: LayoutAnimation.Properties.opacity
				},
				update: {
					type: LayoutAnimation.Types.spring,
					springDamping: 200
				}
			});
		}
	}

	onKeyboardShow(e) {
		if (!e || !e.endCoordinates || !e.endCoordinates.height) return;
		let height = e.endCoordinates.height + (this.props.topInsets ? this.props.topInsets : 0);
		if (Platform.OS === 'android' && systemVersion == 9) {
			height += 75;
		}
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
		left: 0,
		right: 0,
		bottom: 0
	}
});

export default KeyboardSpacer;
