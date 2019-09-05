/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 17:45:22
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PxFit, SCREEN_WIDTH } from '../../../utils';

class SystemUpdateTips extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { error } = this.props;
		//维护处理
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					paddingHorizontal: 15
				}}
			>
				<Text style={{ textAlign: 'center', fontSize: 18, lineHeight: 20 }}>
					{error.toString().replace(/Error: GraphQL error: /, '')}
				</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({});

export default SystemUpdateTips;
