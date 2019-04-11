/*
 * @flow
 * created by wyk made in 2019-04-11 18:10:13
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Row } from '../../../components';
import { Theme, PxFit } from '../../../utils';

class IncomeAndExpenditureItem extends Component {
	render() {
		const { navigation, item } = this.props;
		return (
			<View style={styles.item}>
				<Row style={{ justifyContent: 'space-between' }}>
					<Text style={{ fontSize: PxFit(15), color: Theme.defaultTextColor }}>{item.remark}</Text>
					<Text
						style={{
							fontSize: PxFit(20),
							color: item.gold > 0 ? Theme.primaryColor : Theme.secondaryColor
						}}
					>
						{item.gold > 0 ? '+' + item.gold : item.gold}
					</Text>
				</Row>
				<Row style={{ justifyContent: 'space-between', marginTop: PxFit(10) }}>
					<Text style={{ fontSize: PxFit(12), color: Theme.subTextColor }}>{item.created_at}</Text>
					<Text style={{ fontSize: PxFit(12), color: Theme.subTextColor }}>剩余智慧点: {item.balance}</Text>
				</Row>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	item: {
		padding: PxFit(Theme.itemSpace),
		borderBottomColor: Theme.borderColor,
		borderBottomWidth: PxFit(1)
	}
});

export default IncomeAndExpenditureItem;
