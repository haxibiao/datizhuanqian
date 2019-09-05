/*
 * @flow
 * created by wyk made in 2019-07-09 14:02:36
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import Iconfont from '../Iconfont';
import TouchFeedback from '../TouchableView/TouchFeedback';
import CustomTextInput from '../Basics/CustomTextInput';
import { PxFit, Theme, NAVBAR_HEIGHT, Tools } from '../../utils';
import { observer, Provider, inject } from 'mobx-react';

@observer
class SearchBar extends Component {
	state = {
		text: ''
	};

	onInput = text => {
		this.setState(
			prev => ({ text }),
			() => {
				this.props.onChangeText(this.state.text);
			}
		);
	};

	onSubmit = () => {
		this.props.onChangeText(this.state.text);
		this.setState({ text: '' });
	};

	render() {
		let { placeholder } = this.props;
		return (
			<TouchableWithoutFeedback>
				<View style={styles.searchContainer}>
					<View style={styles.searchLeft}>
						<CustomTextInput
							value={this.state.text}
							placeholder={placeholder}
							onChangeText={this.onInput}
							style={{ flex: 1 }}
						/>
					</View>
					<TouchFeedback style={styles.searchRight} onPress={this.onSubmit}>
						<Iconfont name="search" size={PxFit(20)} color={Theme.subTextColor} />
					</TouchFeedback>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	searchContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: PxFit(5),
		paddingHorizontal: PxFit(10),
		backgroundColor: Theme.groundColour,
		borderRadius: PxFit(30),
		overflow: 'hidden'
	},
	searchLeft: {
		flex: 1,
		alignSelf: 'stretch',
		borderRightWidth: PxFit(1),
		borderRightColor: Theme.borderColor
	},
	searchRight: {
		width: PxFit(30),
		alignSelf: 'stretch',
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		fontSize: PxFit(15),
		color: Theme.subTextColor
	}
});

export default SearchBar;
