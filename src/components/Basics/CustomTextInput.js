/*
 * @flow
 * created by wyk made in 2018-12-18 15:46:45
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Theme, PxFit, ISAndroid } from '../../utils';

type Props = {
	textInputRef?: Function,
	defaultValue?: string,
	style?: Object,
	value: string
};

class CustomTextInput extends Component<Props> {
	static defaultProps = {
		underlineColorAndroid: 'transparent',
		placeholderTextColor: Theme.subTextColor,
		selectionColor: Theme.primaryColor
	};

	render() {
		let { style, textInputRef, ...others } = this.props;
		style = {
			fontSize: PxFit(14),
			color: Theme.defaultTextColor,
			paddingTop: 0,
			padding: 0,
			margin: 0,
			...style
		};
		return <TextInput style={style} {...others} ref={textInputRef} />;
	}
}

const styles = StyleSheet.create({});

export default CustomTextInput;
