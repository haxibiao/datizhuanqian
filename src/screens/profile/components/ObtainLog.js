/*
 * @Author: Gaoxuan
 * @Date:   2019-04-08 14:04:27
 */

import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { PageContainer, ListFooter, ErrorView, LoadingSpinner, EmptyView } from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';

import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import { GoldsQuery } from '../../../assets/graphql/user.graphql';

class ObtainLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: true
		};
	}

	render() {
		const { user, navigation } = this.props;

		return (
			<View style={{ flex: 1 }}>
				<Query query={GoldsQuery} fetchPolicy="network-only" variables={{ user_id: user.id }}>
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <ErrorView onPress={() => refetch()} />;
						if (loading) return <LoadingSpinner />;
						if (!(data && data.golds))
							return <EmptyView imageSource={require('../../../assets/images/default_message.png')} />;
						return (
							<FlatList
								data={data.golds}
								keyExtractor={(item, index) => index.toString()}
								refreshControl={
									<RefreshControl
										refreshing={loading}
										onRefresh={refetch}
										colors={[Theme.primaryColor]}
									/>
								}
								renderItem={({ item, index }) => <ObtainItem item={item} navigation={navigation} />}
								ListHeaderComponent={this._userWithdrawInfo}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									fetchMore({
										variables: {
											offset: data.golds.length
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (
												!(
													fetchMoreResult &&
													fetchMoreResult.golds &&
													fetchMoreResult.golds.length > 0
												)
											) {
												this.setState({
													finished: true
												});
												return prev;
											}
											return Object.assign({}, prev, {
												golds: [...prev.golds, ...fetchMoreResult.golds]
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

class ObtainItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, item } = this.props;
		return (
			<TouchableOpacity style={styles.item} activeOpacity={0.7}>
				<View>
					<Text style={{ fontSize: 15, color: Theme.primaryFont }}>{item.remark}</Text>
					<Text style={{ fontSize: 12, color: Theme.grey, paddingTop: 10 }}>{item.created_at}</Text>
				</View>
				<View style={{ alignItems: 'flex-end' }}>
					<Text style={{ fontSize: 20, color: item.gold > 0 ? Theme.themeRed : Theme.grey }}>
						{item.gold > 0 ? '+' + item.gold : item.gold}
					</Text>
					<Text style={{ fontSize: 12, color: Theme.grey }}>剩余智慧点：{item.balance}</Text>
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

export default connect(store => {
	return {
		user: store.users.user
	};
})(ObtainLog);
