/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 17:49:49
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PxFit } from '../../../utils';

class Default extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<BlankContent
				children={
					<View>
						<Text style={{ fontSize: PxFit(15), color: Theme.tintFont, marginTop: PxFit(12) }}>
							{category.name}的题目已经答完了哦
						</Text>
						<Text
							style={{
								fontSize: PxFit(15),
								color: Theme.tintFont,
								marginTop: PxFit(12),
								textAlign: 'center'
							}}
						>
							快去其他分类继续答题赚钱吧~
						</Text>
					</View>
				}
			/>
		);
	}
}

const styles = StyleSheet.create({});

export default Default;
