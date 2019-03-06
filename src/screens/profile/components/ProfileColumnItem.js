/*
 * @Author: Gaoxuan
 * @Date:   2019-03-06 14:22:09
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Divice, Colors } from '../../../constants';

type Props = {
	path: any,
	title: string,
	handler: Function
};

class ProfileColumnItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { path, title, navigation, handler } = this.props;
		return (
			<TouchableOpacity style={styles.container} onPress={handler}>
				<Image source={path} style={styles.image} />
				<Text style={styles.text}> {title}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: Divice.width / 4,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10
	},
	image: {
		width: 28,
		height: 28,
		marginBottom: 10
	},
	text: {
		fontSize: 13,
		color: Colors.black
	}
});

export default ProfileColumnItem;
