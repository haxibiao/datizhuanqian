/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 13:38:51
 */

import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { PageContainer, ListFooter, ErrorView, LoadingSpinner, EmptyView, CustomRefreshControl } from 'components';
import { Theme, PxFit } from 'utils';

import { Query, withApollo, GQL } from 'apollo';
import { app } from 'store';

import OfficialNoticeItem from './components/OfficialNoticeItem';

class OfficialNotice extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: false
		};
	}

	componentWillUnmount() {
		const { client } = this.props;

		client.query({
			query: GQL.userUnreadQuery,
			variable: {
				id: app.me.id
			},
			fetchPolicy: 'network-only'
		});
	}

	render() {
		const { navigation } = this.props;
		return (
			<PageContainer title="官方公告" white>
				<Query query={GQL.NoticesQuery} fetchPolicy="network-only">
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <ErrorView onPress={refetch} />;
						if (loading) return <LoadingSpinner />;
						if (!(data && data.notices.length > 0)) return <EmptyView />;
						return (
							<FlatList
								style={{ backgroundColor: Theme.lightBorder }}
								data={data.notices}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item, index }) => (
									<OfficialNoticeItem notice={item} navigation={navigation} user={app.me.id} />
								)}
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
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									fetchMore({
										variables: {
											offset: data.notices.length
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (!(fetchMoreResult && fetchMoreResult.notices.length > 0)) {
												this.setState({
													finished: true
												});
												return prev;
											}
											return Object.assign({}, prev, {
												notices: [...prev.notices, ...fetchMoreResult.notices]
											});
										}
									});
								}}
								ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
							/>
						);
					}}
				</Query>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({});

export default withApollo(OfficialNotice);
