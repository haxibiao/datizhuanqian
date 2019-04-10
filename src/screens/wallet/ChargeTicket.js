/*
 * @flow
 * created by wyk made in 2019-04-10 17:56:23
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

class ChargeTicket extends Component {
	render() {
		return (
			<PageContainer title="补充精力">
				<View />
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({});

export default ChargeTicket;
