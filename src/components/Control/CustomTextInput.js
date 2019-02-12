/*
* @flow
* created by wyk made in 2019-02-12 14:50:41
*/
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Colors, Config, Divice } from '../../constants';

type Props = {
	textInputRef?:Function,
	defaultValue: string,
	value: string
};

class CustomTextInput extends Component<Props> {
	static defaultProps = {
		underlineColorAndroid: 'transparent',
		placeholderTextColor: '#A0A0A0',
		selectionColor: Colors.theme
	};

	render() {
		let { style,textInputRef, ...others } = this.props;
		style = {
			fontSize: 14,
			color: Colors.primaryFont,
			padding: 0,
			margin: 0,
			...style
		};
		return <TextInput style={style} {...others} ref={textInputRef}/>;
	}
}

const styles = StyleSheet.create({});

export default CustomTextInput;