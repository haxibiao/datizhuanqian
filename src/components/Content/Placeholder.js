/*
 * @flow
 * created by wyk made in 2019-01-09 21:39:00
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import Iconfont from '../Iconfont';
import Row from '../Container/Row';
import { Theme, PxFit, WPercent } from '../../utils';

const render = {
	question: color => (
		<View style={styles.placeholder}>
			<View>
				<Row style={{ marginBottom: PxFit(5) }}>
					<View style={[styles.avatar, { width: PxFit(24), height: PxFit(24), backgroundColor: color }]} />
					<View style={[styles.strip, { backgroundColor: color }]} />
				</Row>
				<View style={[styles.paragraph, { height: PxFit(Theme.itemSpace), backgroundColor: color }]} />
				<View
					style={[
						styles.paragraph,
						{
							width: WPercent(80),
							height: PxFit(Theme.itemSpace),
							backgroundColor: color
						}
					]}
				/>
			</View>
			<View style={[styles.content, { backgroundColor: color }]} />
			<View style={[styles.answer, { width: WPercent(70), backgroundColor: color }]} />
			<View style={[styles.answer, { width: WPercent(50), backgroundColor: color }]} />
			<View style={[styles.answer, { width: WPercent(60), backgroundColor: color }]} />
			<View style={[styles.answer, { width: WPercent(80), backgroundColor: color }]} />
		</View>
	),
	comment: color => (
		<View style={[styles.placeholder, { flexDirection: 'row' }]}>
			<View
				style={[
					styles.avatar,
					{ width: PxFit(30), height: PxFit(30), borderRadius: PxFit(15), backgroundColor: color }
				]}
			/>
			<View style={{ flex: 1 }}>
				<View style={styles.group}>
					<View>
						<View style={[styles.strip, { backgroundColor: color }]} />
					</View>
					<Iconfont name="praise-fill" size={PxFit(20)} color={color} />
				</View>
				<View style={[styles.paragraph, { backgroundColor: color }]} />
				<View style={[styles.paragraph, { backgroundColor: color }]} />
			</View>
		</View>
	),
	list: color => (
		<View style={styles.placeholder}>
			<Row>
				<View style={[styles.avatar, styles.cover, { backgroundColor: color }]} />
				<View style={{ flex: 1 }}>
					<View style={[styles.paragraph, { backgroundColor: color }]} />
					<View style={[styles.paragraph, { backgroundColor: color }]} />
				</View>
			</Row>
		</View>
	)
};

const START_VALUE = 0.6;
const END_VALUE = 1;
const DURATION = 600;

const AnimatedView = ({ children }) => {
	const animation = new Animated.Value(START_VALUE);

	function start() {
		Animated.sequence([
			Animated.timing(animation, {
				toValue: END_VALUE,
				duration: DURATION,
				useNativeDriver: true
			}),
			Animated.timing(animation, {
				toValue: START_VALUE,
				duration: DURATION,
				useNativeDriver: true
			})
		]).start(e => {
			if (e.finished) {
				start();
			}
		});
	}

	start();
	const style = { opacity: animation };
	return <Animated.View style={style}>{children}</Animated.View>;
};

type args = {
	quantity?: number,
	color?: any,
	type?: 'question' | 'comment' | 'list'
};

export default function Placeholder(props: args) {
	let quantity = props.quantity || 1;
	let color = props.color || Theme.groundColour;
	let type = props.type || 'question';
	return new Array(quantity).fill(0).map(function(elem, index) {
		return <AnimatedView key={index}>{render[type](color)}</AnimatedView>;
	});
}

const styles = StyleSheet.create({
	placeholder: {
		padding: PxFit(Theme.itemSpace)
	},
	paragraph: {
		marginVertical: PxFit(5),
		height: PxFit(20),
		borderRadius: PxFit(4),
		backgroundColor: '#f0f0f0'
	},
	content: {
		height: PxFit(100),
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
		width: PxFit(40),
		height: PxFit(40),
		borderRadius: PxFit(20),
		backgroundColor: '#f0f0f0',
		marginRight: PxFit(10)
	},
	cover: { width: PxFit(48), height: PxFit(48), borderRadius: PxFit(2) },
	strip: {
		width: PxFit(80),
		height: PxFit(Theme.itemSpace),
		borderRadius: PxFit(4),
		backgroundColor: '#f0f0f0'
	},
	label: {
		flex: 1,
		height: PxFit(20),
		borderRadius: PxFit(4),
		backgroundColor: '#f0f0f0'
	},
	group: { height: PxFit(30), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }
});
