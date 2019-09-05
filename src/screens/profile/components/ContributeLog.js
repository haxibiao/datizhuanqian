/*
 * @Author: Gaoxuan
 * @Date:   2019-04-20 14:03:49
 */

import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { PageContainer, ListFooter, ErrorView, LoadingSpinner, EmptyView, CustomRefreshControl } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, Tools } from 'utils';
import { Query, GQL } from 'apollo';
class ContributeLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: false
		};
	}

	render() {
		const { navigation } = this.props;

		return (
			<View style={{ flex: 1 }}>
				<Query query={GQL.ContributesQuery} fetchPolicy="network-only">
					{({ data, error, loading, refetch, fetchMore }) => {
						let contributes = Tools.syncGetter('user.contributes', data);
						if (error) return <ErrorView onPress={refetch} error={error} />;

						if (loading) return <LoadingSpinner />;
						if (!contributes || contributes.length === 0)
							return <EmptyView imageSource={require('../../../assets/images/default_message.png')} />;
						return (
							<FlatList
								data={contributes}
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
									<ContributeLogItem item={item} navigation={navigation} />
								)}
								ListHeaderComponent={this._userWithdrawInfo}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									fetchMore({
										variables: {
											offset: contributes.length
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (
												!(
													fetchMoreResult &&
													fetchMoreResult.user &&
													fetchMoreResult.user.contributes &&
													fetchMoreResult.user.contributes.length > 0
												)
											) {
												this.setState({
													finished: true
												});
												return prev;
											}
											return Object.assign({}, prev, {
												user: Object.assign({}, prev.user, {
													contributes: [
														...prev.user.contributes,
														...fetchMoreResult.user.contributes
													]
												})
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

class ContributeLogItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, item } = this.props;
		return (
			<TouchableOpacity style={styles.item} activeOpacity={0.7}>
				<View>
					<Text style={{ fontSize: PxFit(15), color: Theme.defaultTextColor, paddingTop: 10 }}>
						{item.reason}
					</Text>
					<Text style={{ fontSize: 12, color: Theme.grey, paddingTop: 10 }}>{item.time}</Text>
				</View>
				<View>
					<Text style={{ fontSize: 20, color: item.amount > 0 ? Theme.theme : Theme.themeRed }}>
						{item.amount > 0 ? '+' + item.amount : item.amount}
					</Text>
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

export default ContributeLog;
