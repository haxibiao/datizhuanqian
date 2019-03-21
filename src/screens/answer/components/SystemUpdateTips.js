/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 17:45:22
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class SystemUpdateTips extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let info = error.toString().indexOf('维护');
		if (info > -1) {
			//维护处理
			return (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						width: SCREEN_WIDTH - 30
					}}
				>
					<Text style={{ textAlign: 'center' }}>
						{error.toString().replace(/Error: GraphQL error: /, '')}
					</Text>
				</View>
			);
		}
		return null;
	}
}

const styles = StyleSheet.create({});

export default SystemUpdateTips;
