/*
 * @flow
 * created by wyk made in 2019-04-11 21:15:04
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { PageContainer, ListFooter, ErrorView, LoadingSpinner, EmptyView } from '../../components';
import { Theme, PxFit } from '../../utils';

import { connect } from 'react-redux';
import { WithdrawsQuery } from '../../assets/graphql/withdraws.graphql';
import { UserWithdrawQuery } from '../../assets/graphql/user.graphql';
import { Query } from 'react-apollo';

class OrderDetail extends Component {
	render() {
		return (
			<PageContainer white title="充值详情">
				<View />
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({});

export default OrderDetail;
