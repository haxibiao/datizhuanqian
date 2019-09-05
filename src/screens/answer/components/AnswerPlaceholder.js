/*
 * @flow
 * created by wyk made in 2019-04-03 11:51:05
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Row, Iconfont } from '../../../components';
import { Theme, PxFit, WPercent } from '../../../utils';

const START_VALUE = 0.6;
const END_VALUE = 1;
const DURATION = 600;
class AnswerPlaceholder extends Component {
	animation = new Animated.Value(START_VALUE);

	start() {
		Animated.sequence([
			Animated.timing(this.animation, {
				toValue: END_VALUE,
				duration: DURATION,
				useNativeDriver: true
			}),
			Animated.timing(this.animation, {
				toValue: START_VALUE,
				duration: DURATION,
				useNativeDriver: true
			})
		]).start(e => {
			if (e.finished) {
				this.start();
			}
		});
	}

	render() {
		this.start();
		const style = { opacity: this.animation };

		return (
			<Animated.View style={[styles.placeholder, style]}>
				<View>
					{this.props.answer ? <View style={styles.header} /> : null}
					<View style={{ padding: PxFit(Theme.itemSpace) }}>
						<Row style={{ marginBottom: PxFit(5) }}>
							<View style={styles.avatar} />
							<View style={styles.strip} />
						</Row>
						<View style={styles.paragraph} />
						<View
							style={[
								styles.paragraph,
								{
									width: WPercent(80)
								}
							]}
						/>
						<View style={styles.content} />
						<View style={[styles.answer, { width: WPercent(70) }]} />
						<View style={[styles.answer, { width: WPercent(50) }]} />
						<View style={[styles.answer, { width: WPercent(60) }]} />
						<View style={[styles.answer, { width: WPercent(80) }]} />
					</View>
				</View>
				<View style={styles.footerContainer}>
					<View style={styles.footerBar} />
				</View>
			</Animated.View>
		);
	}
}

const styles = StyleSheet.create({
	placeholder: {
		flex: 1,
		justifyContent: 'space-between'
	},
	header: {
		height: PxFit(44),
		backgroundColor: '#f0f0f0'
	},
	paragraph: {
		marginVertical: PxFit(5),
		height: PxFit(Theme.itemSpace),
		borderRadius: PxFit(4),
		backgroundColor: '#f0f0f0'
	},
	content: {
		height: PxFit(150),
		backgroundColor: '#f0f0f0',
		borderRadius: PxFit(6),
		marginVertical: PxFit(Theme.itemSpace)
	},
	answer: {
		width: WPercent(60),
		height: PxFit(20),
		backgroundColor: '#f0f0f0',
		marginTop: PxFit(Theme.itemSpace)
	},
	avatar: {
		width: PxFit(24),
		height: PxFit(24),
		borderRadius: PxFit(20),
		backgroundColor: '#f0f0f0',
		marginRight: PxFit(10)
	},
	strip: {
		width: PxFit(80),
		height: PxFit(Theme.itemSpace),
		borderRadius: PxFit(4),
		backgroundColor: '#f0f0f0'
	},
	footerContainer: {
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
		backgroundColor: '#fff'
	},
	footerBar: {
		height: PxFit(48),
		backgroundColor: '#f0f0f0'
	}
});

export default AnswerPlaceholder;
