/*
 * @Author: Gaoxuan
 * @Date:   2019-04-08 11:57:56
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';

import { Theme, PxFit, SCREEN_WIDTH } from '../../utils';
import { ScrollTabBar, PageContainer } from '../../components';

import WithdrawLog from './components/WithdrawLog';
import TopUpLog from './components/TopUpLog';
import IncomeAndExpenditure from './components/IncomeAndExpenditure';

import ScrollableTabView from 'react-native-scrollable-tab-view';

class BillingRecord extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { navigation } = this.props;
		return (
			<PageContainer white title="我的账单">
				<View style={styles.container}>
					<ScrollableTabView
						renderTabBar={props => <ScrollTabBar {...props} tabUnderlineWidth={PxFit(30)} />}
					>
						<WithdrawLog navigation={navigation} tabLabel="提现" />
						<TopUpLog navigation={navigation} tabLabel="充值" />
						<IncomeAndExpenditure navigation={navigation} tabLabel="明细" />
					</ScrollableTabView>
				</View>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.white
	}
});

export default BillingRecord;
