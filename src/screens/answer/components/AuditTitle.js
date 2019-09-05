/*
 * @flow
 * created by wyk made in 2019-04-09 17:49:01
 */
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, Animated } from 'react-native';
import { TouchFeedback, Iconfont, Row } from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';

class AuditTitle extends Component {
	_animated = new Animated.Value(0);

	componentDidMount() {
		this.animation();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.id !== this.props.id) {
			this._animated.setValue(0);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		this.animation();
	}

	animation() {
		Animated.timing(this._animated, {
			toValue: 1,
			velocity: 10,
			tension: -10,
			friction: 5,
			delay: 350
		}).start();
	}

	animated = even => {
		return {
			opacity: this._animated,
			transform: [
				{
					translateX: this._animated.interpolate({
						inputRange: [0, 1],
						outputRange: [even ? -SCREEN_WIDTH : SCREEN_WIDTH, 0],
						extrapolate: 'clamp'
					})
				}
			]
		};
	};

	render() {
		return (
			<Row style={styles.title}>
				<Animated.View style={this.animated(true)}>
					<Row>
						<Iconfont name={'audit'} size={PxFit(14)} color={Theme.primaryColor} />
						<Text style={styles.titleText}>待审题</Text>
					</Row>
				</Animated.View>
				<Animated.View style={this.animated()}>
					<TouchFeedback
						style={styles.rule}
						onPress={() => {
							this.props.navigation.navigate('AuditRule');
						}}
					>
						<Text style={styles.ruleText}>审题指南</Text>
						<Iconfont name={'question'} size={PxFit(14)} color={Theme.subTextColor} />
					</TouchFeedback>
				</Animated.View>
			</Row>
		);
	}
}

const styles = StyleSheet.create({
	title: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: PxFit(20)
	},
	titleText: {
		marginLeft: PxFit(2),
		fontSize: PxFit(14),
		color: Theme.defaultTextColor
	},
	rule: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	ruleText: { fontSize: PxFit(13), color: Theme.subTextColor, marginRight: PxFit(2) }
});

export default AuditTitle;
