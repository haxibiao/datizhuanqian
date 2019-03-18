/*
 * @flow
 * created by wyk made in 2018-12-12 09:02:15
 */
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';

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
				callback();
			} else {
				navigation.navigate('Login');
			}
		};
	}

	buildPorps() {
		let { authenticated, navigation, onPress, ...props } = this.props;
		if (authenticated && navigation) {
			onPress = this.middleware(onPress, navigation);
		}
		return { onPress, ...props };
	}

	render() {
		let props = this.buildPorps();
		return <TouchableOpacity {...props} />;
	}
}

export default TouchFeedback;
