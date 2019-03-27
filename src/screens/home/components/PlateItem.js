/*
 * @flow
 * created by wyk made in 2019-03-19 12:59:55
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { Iconfont, Row, TouchFeedback } from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';

class PlateItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	onPress = () => {
		const { category, navigation } = this.props;
		navigation.navigate('Answer', { category, question_id: null });
	};
	render() {
		const { category } = this.props;
		let { icon, name, description } = category;
		return (
			<TouchFeedback authenticated style={styles.container} onPress={this.onPress}>
				<Image source={{ uri: icon }} style={styles.cover} />
				<View style={{ flex: 1, paddingHorizontal: PxFit(15) }}>
					<Text style={styles.name}>{name}</Text>
					<Text style={styles.description} numberOfLines={1}>
						{description}
					</Text>
				</View>
				<Iconfont name={'right'} size={16} color={Theme.secondaryTextColor} />
			</TouchFeedback>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: PxFit(15),
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.borderColor
	},
	cover: {
		width: PxFit(48),
		height: PxFit(48),
		borderRadius: PxFit(2)
	},
	name: {
		fontSize: PxFit(16),
		fontWeight: '400',
		color: Theme.defaultTextColor
	},
	description: {
		fontSize: PxFit(13),
		color: Theme.subTextColor,
		paddingTop: PxFit(5)
	}
});

export default PlateItem;
