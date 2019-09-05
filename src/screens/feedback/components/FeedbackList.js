import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import { PageContainer, ListFooter, ErrorView, LoadingSpinner, EmptyView, CustomRefreshControl } from 'components';

import { Theme, PxFit, SCREEN_WIDTH } from 'utils';
import { Query, GQL } from 'apollo';
import { app } from 'store';

import FeedbackItem from './FeedbackItem';

class FeedbackList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			onPress: 'LATEST',
			fetchingMore: true,
			filter: null,
			finished: false
		};
	}
	render() {
		let { navigation } = this.props;
		let { onPress, filter } = this.state;
		return (
			<PageContainer hiddenNavBar tabLabel="反馈记录">
				<View style={styles.header}>
					<TouchableOpacity
						style={[{ borderBottomColor: filter == null ? Theme.primaryColor : Theme.white }, styles.tab]}
						onPress={() => {
							this.setState({
								filter: null
							});
						}}
					>
						<Text>热门问题</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.tab, { borderBottomColor: filter == null ? Theme.white : Theme.primaryColor }]}
						onPress={() => {
							this.setState({
								filter: app.me.id
							});
						}}
					>
						<Text>我的反馈</Text>
					</TouchableOpacity>
				</View>

				<Query query={GQL.feedbacksQuery} variables={{ user_id: filter }} fetchPolicy="network-only">
					{({ data, loading, error, refetch, fetchMore }) => {
						if (error) return <ErrorView onPress={refetch} />;
						if (loading) return <LoadingSpinner />;
						if (!(data && data.feedbacks && data.feedbacks.length > 0)) return <EmptyView />;
						return (
							<View style={{ flex: 1 }}>
								<FlatList
									removeClippedSubviews
									initialNumToRender={10}
									onEndReachedThreshold={0.2}
									onContentSizeChange={() => {
										this.isCanLoadMore = true;
									}}
									data={data.feedbacks}
									keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
									renderItem={({ item, index }) => (
										<FeedbackItem item={item} navigation={navigation} />
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
									onEndReached={() => {
										if (this.isCanLoadMore) {
											this.isCanLoadMore = false;
											fetchMore({
												variables: {
													offset: data.feedbacks.length
												},
												updateQuery: (prev, { fetchMoreResult }) => {
													if (!(fetchMoreResult && fetchMoreResult.feedbacks.length > 0)) {
														this.setState({
															finished: true
														});
														return prev;
													}
													return Object.assign({}, prev, {
														feedbacks: [...prev.feedbacks, ...fetchMoreResult.feedbacks]
													});
												}
											});
										}
									}}
									ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
								/>
							</View>
						);
					}}
				</Query>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.white
	},
	header: {
		flexDirection: 'row',
		paddingHorizontal: PxFit(10),
		borderBottomColor: Theme.lightBorder,
		borderBottomWidth: PxFit(0.5)
		// borderTopWidth: PxFit(0.5),
		// borderTopColor: Theme.lightBorder
	},
	tab: {
		borderBottomWidth: PxFit(2),
		marginRight: PxFit(30),
		paddingVertical: PxFit(10)
	}
});

export default FeedbackList;
