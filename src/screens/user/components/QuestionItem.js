/*
 * @Author: Gaoxuan
 * @Date:   2019-03-06 16:42:20
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../../constants';

class Default extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { question } = this.props;
		return (
			<View style={styles.container}>
				<Text style={{ fontSize: 14, color: Colors.black }}>{question.description}</Text>
				<View style={styles.footer}>
					<Text style={{ color: Colors.theme, fontSize: 13 }}>#{question.category.name}</Text>
					<Text style={{ color: Colors.grey, fontSize: 13 }}>{question.count}人答过</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 12,
		paddingHorizontal: 15,
		borderBottomWidth: 0.5,
		borderBottomColor: Colors.lightBorder
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 16
	}
});

export default Default;
