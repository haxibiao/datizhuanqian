/*
 * @Author: Gaoxuan
 * @Date:   2019-04-08 11:57:56
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';

import { Theme, PxFit, SCREEN_WIDTH } from '../../utils';

import { ScrollTabBar, PageContainer } from '../../components';

import WithdrawLog from './components/WithdrawLog';
import ExchangeLog from './components/ExchangeLog';
import ObtainLog from './components/ObtainLog';

import ScrollableTabView from 'react-native-scrollable-tab-view';

class BillingRecord extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { navigation } = this.props;
		return (
			<PageContainer white title="账单记录">
				<View style={styles.container}>
					<ScrollableTabView
						renderTabBar={props => <ScrollTabBar {...props} tabUnderlineWidth={PxFit(30)} />}
					>
						<WithdrawLog navigation={navigation} tabLabel="提现" />
						<ExchangeLog navigation={navigation} tabLabel="兑换" />
						<ObtainLog navigation={navigation} tabLabel="收支" />
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
