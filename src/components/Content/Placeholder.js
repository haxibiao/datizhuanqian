/*
* @flow
* created by wyk made in 2019-01-09 21:39:00
*/
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import Iconfont from '../Iconfont';
import Row from '../Container/Row';
import { Theme, PxFit } from '../../utils';

const render = {
	post: color => (
		<View style={styles.placeholder}>
			<Row>
				<View style={[styles.avatar, { backgroundColor: color }]} />
				<Row>
					<View style={[styles.strip, { backgroundColor: color }]} />
				</Row>
			</Row>
			<View style={[styles.content, { backgroundColor: color }]} />
			<Row>
				<View style={[styles.label, { backgroundColor: color }]} />
				<Iconfont name="like-fill" size={PxFit(20)} color={color} style={{ marginHorizontal: PxFit(10) }} />
				<View style={[styles.label, { backgroundColor: color }]} />
				<Iconfont name="comment-fill" size={PxFit(20)} color={color} style={{ marginLeft: PxFit(10) }} />
				<View style={{ flex: 1 }} />
				<Iconfont name="more" size={PxFit(24)} color={color} />
			</Row>
		</View>
	),
	comment: color => (
		<View style={[styles.placeholder, { flexDirection: 'row', alignItems: 'flex-start' }]}>
			<View style={[styles.avatar, { backgroundColor: color }]} />
			<View style={{ flex: 1 }}>
				<View style={styles.group}>
					<View>
						<View style={[styles.strip, { height: PxFit(15), backgroundColor: color }]} />
						<View
							style={[
								styles.strip,
								{ height: PxFit(15), marginVertical: PxFit(10), backgroundColor: color }
							]}
						/>
					</View>
					<Iconfont name="praise-fill" size={PxFit(24)} color={color} />
				</View>
				<View style={[styles.paragraph, { flex: 0, backgroundColor: color }]} />
				<View style={[styles.paragraph, { flex: 0, backgroundColor: color }]} />
			</View>
		</View>
	),
	chat: color => (
		<View style={styles.placeholder}>
			<Row style={{ flex: 1 }}>
				<View style={[styles.avatar, styles.bigAvatar, { backgroundColor: color }]} />
				<View style={{ flex: 1 }}>
					<View style={[styles.paragraph, { flex: 0, backgroundColor: color }]} />
					<View style={[styles.paragraph, { flex: 0, backgroundColor: color }]} />
				</View>
			</Row>
		</View>
	)
};

const START_VALUE = 0.5;
const END_VALUE = 1;
const DURATION = 500;

const AnimatedView = ({ children }) => {
  const animation = new Animated.Value(START_VALUE);

  function start() {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: END_VALUE,
        duration: DURATION,
        useNativeDriver:true,
      }),
      Animated.timing(animation, {
        toValue: START_VALUE,
        duration: DURATION,
        useNativeDriver:true,
      }),
    ]).start((e) => {
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
	type?: 'post' | 'chat'
};

export default function Placeholder(props: args) {
	let quantity = props.quantity || 4;
	let color = props.color || Theme.groundColour;
	let type = props.type || 'post';
	return new Array(quantity).fill(0).map(function(elem, index) {
		return <AnimatedView key={index}>{render[type](color)}</AnimatedView>;
	});
}

const styles = StyleSheet.create({
	placeholder: {
		padding: PxFit(Theme.itemSpace)
	},
	avatar: {
		width: PxFit(40),
		height: PxFit(40),
		borderRadius: PxFit(20),
		backgroundColor: Theme.groundColour,
		marginRight: PxFit(10)
	},
	bigAvatar: { width: PxFit(50), height: PxFit(50), borderRadius: PxFit(25) },
	strip: {
		width: PxFit(80),
		height: PxFit(20),
		borderRadius: PxFit(4),
		backgroundColor: Theme.groundColour
	},
	paragraph: {
		flex: 1,
		marginVertical: PxFit(5),
		height: PxFit(20),
		borderRadius: PxFit(4),
		backgroundColor: Theme.groundColour
	},
	content: {
		height: PxFit(100),
		backgroundColor: Theme.groundColour,
		borderRadius: PxFit(6),
		marginVertical: PxFit(12)
	},
	label: {
		flex: 1,
		height: PxFit(20),
		borderRadius: PxFit(4),
		backgroundColor: Theme.groundColour
	},
	group: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }
});
