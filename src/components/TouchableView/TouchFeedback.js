/*
 * @flow
 * created by wyk made in 2018-12-12 09:02:15
 */
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

class TouchFeedback extends Component {
	static propTypes = {
		authenticated: PropTypes.bool,
		...TouchableOpacity.propTypes
	};

	static defaultProps = {
		authenticated: false,
		...TouchableOpacity.defaultProps,
		activeOpacity: 0.6
	};

	middleware(callback, navigation) {
		return () => {
			if (TOKEN) {
				callback && callback();
			} else {
				navigation.navigate('Login');
			}
		};
	}

	checkNetwork(submit) {
		NetInfo.isConnected.fetch().then(isConnected => {
			if (isConnected) {
				submit && submit();
			} else {
				Toast.show({ content: '网络错误,请检查是否连接网络' });
			}
		});
	}

	buildPorps() {
		let { authenticated, navigation, onPress, disabled, checkNetwork, style, ...props } = this.props;
		if (authenticated && navigation) {
			onPress = this.middleware(onPress, navigation);
		}

		if (checkNetwork) {
			onPress = this.checkNetwork(onPress);
		}

		if (disabled) {
			if (style instanceof Array) {
				style = [
					{
						opacity: 0.6
					},
					...style
				];
			} else {
				style = [
					{
						opacity: 0.6
					},
					style
				];
			}
		}
		return { onPress, disabled, style, ...props };
	}

	render() {
		let props = this.buildPorps();
		return <TouchableOpacity {...props} />;
	}
}

export default TouchFeedback;
