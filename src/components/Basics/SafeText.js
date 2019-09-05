/*
* @flow
* created by wyk made in 2018-12-12 12:02:46
*/
'use strict';

import React, { Component } from 'react';

import { StyleSheet, View, Text } from 'react-native';

type Props = {
	...Text.propTypes
};

class SafeText extends Component<Props> {
	render() {
		let { children, ...other } = this.props;
		if (
			(typeof children === 'string' ||
				children instanceof String ||
				typeof children === 'number' ||
				children instanceof Number) &&
			new String(children).toString() !== 'null' &&
			new String(children).toString() !== ''
		) {
			return <Text {...other}>{children}</Text>;
		} else return null;
	}
}

const styles = StyleSheet.create({});

export default SafeText;
