/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 17:59:47
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SCREEN_WIDTH, Theme, PxFit } from '../../../utils';

class FiexdFooter extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { question } = this.props;
		return (
			<View
				style={{
					backgroundColor: 'transparent',
					position: 'absolute',
					alignItems: 'center',
					bottom: 0,
					width: PxFit(40),
					left: SCREEN_WIDTH / 2 - PxFit(20)
				}}
			>
				<Text
					style={{
						backgroundColor: 'transparent',
						color: '#CFCFCF',
						fontSize: PxFit(11),
						textAlign: 'center'
					}}
				>
					#{question.id}
				</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({});

export default FiexdFooter;
