/*
 * @flow
 * created by wyk made in 2019-06-26 16:58:25
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { TouchFeedback, Row } from '../../../components';
import { Theme, PxFit } from '../../../utils';
import { observable, action, runInAction, autorun, computed } from 'mobx';
import { observer, Provider, inject } from 'mobx-react';

import OptionItem from './OptionItem';

@observer
class Options extends Component {
	render() {
		let { options, reduceAnswer, removeOption } = this.props.contributeStore;
		if (options.size > 0) {
			return (
				<View style={styles.shadowView} elevation={10}>
					<View style={styles.shadowTitle}>
						<Row>
							<View style={styles.yellowDot} />
							<Text style={styles.titleText}>答案选项（2~4个）</Text>
						</Row>
						<Text style={{ fontSize: PxFit(13), color: Theme.subTextColor }}>点击设置正确答案</Text>
					</View>
					{[...options].map((option, index) => {
						return (
							<OptionItem
								key={index}
								label={index}
								option={option}
								reduceAnswer={reduceAnswer}
								remove={removeOption}
							/>
						);
					})}
				</View>
			);
		}
		return null;
	}
}

const styles = StyleSheet.create({
	shadowView: {
		margin: PxFit(Theme.itemSpace),
		padding: PxFit(10),
		borderRadius: PxFit(5),
		backgroundColor: '#fff',
		shadowColor: '#b4b4b4',
		shadowOffset: {
			width: 0,
			height: 0
		},
		shadowRadius: 1,
		shadowOpacity: 0.3
	},
	shadowTitle: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	yellowDot: {
		marginRight: PxFit(6),
		width: PxFit(6),
		height: PxFit(6),
		borderRadius: PxFit(3),
		backgroundColor: Theme.primaryColor
	},
	titleText: {
		fontSize: PxFit(14),
		color: Theme.defaultTextColor
	}
});

export default inject('contributeStore')(Options);
