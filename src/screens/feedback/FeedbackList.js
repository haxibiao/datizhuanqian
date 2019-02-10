import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image, RefreshControl } from 'react-native';
import {
	DivisionLine,
	ErrorBoundary,
	ContentEnd,
	LoadingMore,
	BlankContent,
	Loading,
	LoadingError,
	Avatar,
	Header,
	Screen,
	Iconfont,
	FeedbackItem
} from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Methods } from '../../helpers';

import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import { feedbacksQuery } from '../../graphql/feedback.graphql';

class FeedbackList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			onPress: 'LATEST',
			fetchingMore: true,
			filter: this.props.user.id
		};
	}
	render() {
		let { user, navigation, login } = this.props;
		let { onPress, filter } = this.state;
		return (
			<Screen header tabLabel="反馈记录">
				<DivisionLine height={5} />
				<View style={styles.header}>
					<TouchableOpacity
						style={[styles.tab, { borderBottomColor: filter == null ? Colors.white : Colors.theme }]}
						onPress={() => {
							this.setState({
								filter: user.id
							});
						}}
					>
						<Text>我的反馈</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[{ borderBottomColor: filter == null ? Colors.theme : Colors.white }, styles.tab]}
						onPress={() => {
							this.setState({
								filter: null
							});
						}}
					>
						<Text>反馈列表</Text>
					</TouchableOpacity>
				</View>

				<Query query={feedbacksQuery} variables={{ user_id: filter }} fetchPolicy="network-only">
					{({ data, loading, error, refetch, fetchMore }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (loading) return <Loading />;
						console.log('data.feedback', data);
						if (!(data && data.feedbacks && data.feedbacks.length > 0))
							return <BlankContent text={'暂无反馈'} fontSize={14} />;
						return (
							<View>
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
											colors={[Colors.theme]}
										/>
									}
									onEndReachedThreshold={0.3}
									onEndReached={() => {
										if (data.feedbacks) {
											fetchMore({
												variables: {
													offset: data.feedbacks.length
												},
												updateQuery: (prev, { fetchMoreResult }) => {
													if (!(fetchMoreResult && fetchMoreResult.feedbacks.length > 0)) {
														this.setState({
															fetchingMore: false
														});
														return prev;
													}
													return Object.assign({}, prev, {
														feedbacks: [...prev.feedbacks, ...fetchMoreResult.feedbacks]
													});
												}
											});
										} else {
											this.setState({
												fetchingMore: false
											});
										}
									}}
									ListFooterComponent={() => {
										return this.state.fetchingMore ? (
											<LoadingMore />
										) : (
											<ContentEnd content={'没有更多反馈了~'} />
										);
									}}
								/>
							</View>
						);
					}}
				</Query>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	header: {
		flexDirection: 'row',
		paddingHorizontal: 10,
		borderBottomColor: Colors.lightBorder,
		borderBottomWidth: 1
	},
	tab: {
		borderBottomWidth: 2,
		marginRight: 30,
		paddingVertical: 10
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(FeedbackList);
