import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image, RefreshControl } from 'react-native';
import { PageContainer, ListFooter } from '../../../components';

import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';

import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import { feedbacksQuery } from '../../../assets/graphql/feedback.graphql';

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
		let { user, navigation, login } = this.props;
		let { onPress, filter } = this.state;
		return (
			<PageContainer hiddenNavBar tabLabel="反馈记录">
				{/*<DivisionLine height={5} />*/}
				<View style={styles.header}>
					<TouchableOpacity
						style={[{ borderBottomColor: filter == null ? Theme.theme : Theme.white }, styles.tab]}
						onPress={() => {
							this.setState({
								filter: null
							});
						}}
					>
						<Text>热门问题</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.tab, { borderBottomColor: filter == null ? Theme.white : Theme.theme }]}
						onPress={() => {
							this.setState({
								filter: user.id
							});
						}}
					>
						<Text>我的反馈</Text>
					</TouchableOpacity>
				</View>

				<Query query={feedbacksQuery} variables={{ user_id: filter }} fetchPolicy="network-only">
					{({ data, loading, error, refetch, fetchMore }) => {
						if (error) return null;
						if (loading) return null;
						if (!(data && data.feedbacks && data.feedbacks.length > 0)) return null;
						return (
							<View style={{ flex: 1 }}>
								<FlatList
									data={data.feedbacks}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index }) => (
										<FeedbackItem item={item} navigation={navigation} />
									)}
									refreshControl={
										<RefreshControl
											refreshing={loading}
											onRefresh={refetch}
											Colors={[Theme.theme]}
										/>
									}
									onEndReachedThreshold={0.3}
									onEndReached={() => {
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
		borderBottomWidth: PxFit(1),
		borderTopWidth: PxFit(5),
		borderTopColor: Theme.lightBorder
	},
	tab: {
		borderBottomWidth: PxFit(2),
		marginRight: PxFit(30),
		paddingVertical: PxFit(10)
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(FeedbackList);
