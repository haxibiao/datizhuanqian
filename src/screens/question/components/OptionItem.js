/*
 * @flow
 * created by wyk made in 2019-03-28 11:52:05
 */
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, Animated } from 'react-native';
import { TouchFeedback, Iconfont } from 'components';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';

class OptionItem extends Component {
	_animated = new Animated.Value(0);

	componentDidMount() {
		this.animation();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.questionId !== this.props.questionId) {
			this.animation();
		}
	}

	animation() {
		this.disable = true;
		this._animated.setValue(0);
		Animated.timing(this._animated, {
			toValue: 1,
			velocity: 10,
			tension: -10,
			friction: 5,
			delay: 350
		}).start(() => {
			this.disable = false;
		});
	}

	onPress = () => {
		if (this.disable) return;
		let { option, singleOption } = this.props;
		this.props.onSelectOption(option.Value, singleOption);
	};

	buildProps = () => {
		let { selectedOption, option, submited, correct } = this.props;
		let status, labelStyle, contentStyle, label, focused;
		focused = selectedOption && selectedOption.includes(option.Value);
		if (submited) {
			if (focused) {
				if (correct) {
					status = 'correct';
				} else {
					status = 'error';
				}
			} else if (correct) {
				status = 'missing';
			}
		} else if (focused) {
			status = 'selected';
		}
		switch (status) {
			case 'selected':
				labelStyle = { backgroundColor: '#b6c2e1', borderWidth: 0 };
				label = <Text style={[styles.optionLabelText, { color: '#fff' }]}>{option.Value}</Text>;
				break;
			case 'correct':
				labelStyle = { backgroundColor: Theme.correctColor, borderWidth: 0 };
				contentStyle = { color: Theme.correctColor };
				label = <Iconfont name="correct" size={PxFit(16)} color={'#fff'} />;
				break;
			case 'missing':
				labelStyle = { backgroundColor: Theme.correctColor, borderWidth: 0 };
				contentStyle = { color: Theme.correctColor };
				label = <Text style={[styles.optionLabelText, { color: '#fff' }]}>{option.Value}</Text>;
				break;
			case 'error':
				labelStyle = { backgroundColor: Theme.errorColor, borderWidth: 0 };
				contentStyle = { color: Theme.errorColor };
				label = <Iconfont name="close" size={PxFit(19)} color={'#fff'} />;
				break;
			default:
				label = <Text style={styles.optionLabelText}>{option.Value}</Text>;
				break;
		}
		return { labelStyle, contentStyle, label };
	};

	render() {
		let { option, submited, even } = this.props;
		let { labelStyle, contentStyle, label } = this.buildProps();
		const animateStyles = {
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
		return (
			<Animated.View style={animateStyles}>
				<View style={styles.optionItemWrap}>
					<TouchFeedback disabled={submited} style={styles.optionItem} onPress={this.onPress}>
						<View style={[styles.optionLabel, labelStyle]}>{label}</View>
						<View style={styles.optionContent}>
							<Text style={[styles.optionContentText, contentStyle]}>{option.Text}</Text>
						</View>
					</TouchFeedback>
				</View>
			</Animated.View>
		);
	}
}

const styles = StyleSheet.create({
	optionItemWrap: {
		marginBottom: PxFit(20)
	},
	optionItem: {
		opacity: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	optionLabel: {
		marginRight: PxFit(15),
		width: PxFit(34),
		height: PxFit(34),
		borderRadius: PxFit(17),
		borderWidth: PxFit(1),
		borderColor: Theme.borderColor,
		justifyContent: 'center',
		alignItems: 'center'
	},
	selectedOption: { backgroundColor: '#b6c2e1', borderWidth: 0 },
	correctOption: { backgroundColor: Theme.correctColor, borderWidth: 0 },
	errorOption: { backgroundColor: Theme.errorColor, borderWidth: 0 },
	optionLabelText: {
		fontSize: PxFit(17),
		color: Theme.defaultTextColor
	},
	optionContent: {
		flex: 1,
		minHeight: PxFit(34),
		justifyContent: 'center'
	},
	optionContentText: {
		fontSize: PxFit(16),
		lineHeight: PxFit(20),
		color: Theme.defaultTextColor
	}
});

export default OptionItem;
