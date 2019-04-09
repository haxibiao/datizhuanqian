/*
 * @flow
 * created by wyk made in 2019-04-09 10:47:03
 */
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, Animated } from 'react-native';
import { TouchFeedback, Iconfont, Row } from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';

type Props = {
	navigation: Object,
	nextQuestion: Function
};
class Audit extends Component<Props> {
	constructor(props) {
		super(props);
		this._animated = new Animated.Value(1);
		this.state = {
			status: 0
		};
	}

	styleMap = left => {
		return {
			opacity: this._animated,
			transform: [
				{
					translateX: this._animated.interpolate({
						inputRange: [0, 1],
						outputRange: [left ? -PxFit(100) : PxFit(100), 0],
						extrapolate: 'clamp'
					})
				}
			]
		};
	};

	// 提交审核
	onSubmitOpinion = opinion => {
		this.setState({ status: opinion });
		this.nextQuestion();
	};

	nextQuestion = () => {
		this.timer && clearInterval(this.timer);
		this.setState(
			prevState => ({ status: 0 }),
			() => {
				Animated.timing(this._animated, {
					toValue: 0,
					duration: 300,
					delay: 500
				}).start();
			}
		);
		this.timer = setTimeout(() => {
			this.props.nextQuestion();
			this._animated.setValue(1);
		}, 900);
	};

	render() {
		let { navigation } = this.props;
		let { status } = this.state;
		switch (status) {
			case -1:
				source = require('../../../assets/images/audit_reject.png');
				break;
			case 0:
				source = require('../../../assets/images/auditing.png');
				break;
			case 1:
				source = require('../../../assets/images/audited.png');
				break;
		}
		return (
			<Animated.View style={styles.footerBar}>
				<Animated.View style={[styles.opinionItem, styles.opinionItemLeft, this.styleMap(true)]}>
					<TouchFeedback
						style={styles.opinionItemButton}
						disabled={status !== 0}
						onPress={() => this.onSubmitOpinion(-1)}
					>
						<Text style={[styles.opinionText, { color: Theme.errorColor, marginRight: PxFit(4) }]}>
							反对
						</Text>
						<Image source={require('../../../assets/images/oppose.png')} style={styles.opinionImage} />
					</TouchFeedback>
				</Animated.View>
				<Image source={source} style={styles.statusImage} />
				<Animated.View style={[styles.opinionItem, styles.opinionItemRight, this.styleMap()]}>
					<TouchFeedback
						style={styles.opinionItemButton}
						disabled={status !== 0}
						onPress={() => this.onSubmitOpinion(1)}
					>
						<Image source={require('../../../assets/images/approve.png')} style={styles.opinionImage} />
						<Text style={[styles.opinionText, { marginLeft: PxFit(4) }]}>赞成</Text>
					</TouchFeedback>
				</Animated.View>
			</Animated.View>
		);
	}
}

const styles = StyleSheet.create({
	footerBar: {
		position: 'absolute',
		bottom: PxFit(Theme.HOME_INDICATOR_HEIGHT) + PxFit(Theme.itemSpace),
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	opinionItem: {
		position: 'absolute',
		height: PxFit(34),
		borderRadius: PxFit(17)
	},
	opinionItemLeft: {
		left: PxFit(-17),
		paddingLeft: PxFit(22),
		paddingRight: PxFit(9),
		backgroundColor: '#f0f0f0'
	},
	opinionItemButton: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	opinionItemRight: {
		right: PxFit(-17),
		paddingRight: PxFit(22),
		paddingLeft: PxFit(9),
		backgroundColor: Theme.correctColor
	},
	opinionText: {
		fontSize: PxFit(14),
		color: '#fff',
		fontWeight: '500',
		letterSpacing: PxFit(4)
	},
	opinionImage: {
		width: PxFit(24),
		height: PxFit(24)
	},
	statusImage: { width: SCREEN_WIDTH / 3, height: SCREEN_WIDTH / 3 }
});

export default Audit;
