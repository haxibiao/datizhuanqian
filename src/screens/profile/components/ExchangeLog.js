/*
 * @Author: Gaoxuan
 * @Date:   2019-04-08 13:57:15
 */

import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { PageContainer, ListFooter, ErrorView, LoadingSpinner, EmptyView, CustomRefreshControl } from 'components';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';

import { Query, GQL } from 'apollo';

class ExchangeLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: true
		};
	}

	render() {
		const { navigation } = this.props;

		return (
			<View style={{ flex: 1 }}>
				<Query query={GQL.ExchangesQuery} fetchPolicy="network-only">
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <ErrorView onPress={refetch} />;
						if (loading) return <LoadingSpinner />;
						if (!(data && data.exchanges.length > 0))
							return <EmptyView imageSource={require('../../../assets/images/default_message.png')} />;
						return (
							<FlatList
								data={data.exchanges}
								keyExtractor={(item, index) => index.toString()}
								refreshControl={
									<CustomRefreshControl
										refreshing={loading}
										onRefresh={refetch}
										reset={() =>
											this.setState({
												finished: false
											})
										}
									/>
								}
								renderItem={({ item, index }) => (
									<ExchangeLogItem item={item} navigation={navigation} />
								)}
								ListHeaderComponent={this._userWithdrawInfo}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									fetchMore({
										variables: {
											offset: data.exchanges.length
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (
												!(
													fetchMoreResult &&
													fetchMoreResult.exchanges &&
													fetchMoreResult.exchanges.length > 0
												)
											) {
												this.setState({
													finished: true
												});
												return prev;
											}
											return Object.assign({}, prev, {
												exchanges: [...prev.exchanges, ...fetchMoreResult.exchanges]
											});
										}
									});
								}}
								ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
							/>
						);
					}}
				</Query>
			</View>
		);
	}
}

class ExchangeLogItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, item } = this.props;
		return (
			<TouchableOpacity style={styles.item} activeOpacity={0.7}>
				<View>
					<Text style={{ fontSize: 15, color: Theme.primaryFont }}>智慧点提现</Text>
					<Text style={{ fontSize: 12, color: Theme.grey, paddingTop: 10 }}>{item.created_at}</Text>
				</View>
				<View>
					<Text style={{ fontSize: 18, color: Theme.primaryFont }}>- {item.gold}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
		borderBottomColor: Theme.lightBorder,
		borderBottomWidth: 0.5,
		paddingHorizontal: 15
	}
});

export default ExchangeLog;
