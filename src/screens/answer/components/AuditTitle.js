/*
 * @flow
 * created by wyk made in 2019-04-09 17:49:01
 */
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, Animated } from 'react-native';
import { TouchFeedback, Iconfont, Row } from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';

class AuditTitle extends Component {
	render() {
		return (
			<Row style={styles.title}>
				<View>
					<Text style={styles.titleText}>#待审题</Text>
				</View>
				<TouchFeedback
					style={styles.rule}
					onPress={() => {
						this.props.navigation.navigate('AuditRule');
					}}
				>
					<Iconfont name={'question'} size={PxFit(14)} color={Theme.errorColor} />
					<Text style={styles.ruleText}>审题指南</Text>
				</TouchFeedback>
			</Row>
		);
	}
}

const styles = StyleSheet.create({
	title: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: PxFit(Theme.itemSpace)
	},
	titleText: {
		fontSize: PxFit(14),
		color: Theme.correctColor
	},
	rule: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	ruleText: { fontSize: PxFit(13), color: Theme.errorColor, marginLeft: PxFit(2) }
});

export default AuditTitle;
