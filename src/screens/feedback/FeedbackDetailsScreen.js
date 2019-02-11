import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Keyboard, FlatList, RefreshControl } from 'react-native';
import {
	Screen,
	Iconfont,
	CommentItem,
	FeedbackCommentModal,
	BlankContent,
	Loading,
	LoadingError,
	LoadingMore,
	ContentEnd,
	Waiting
} from '../../components';

import { Colors, Divice } from '../../constants';
import { Methods } from '../../helpers';

import { connect } from 'react-redux';
import {
	feedbackCommentsQuery,
	createCommentMutation,
	feedbackQuery,
	feedbacksQuery
} from '../../graphql/feedback.graphql';
import { compose, graphql, Query } from 'react-apollo';

import FeedbackBody from './FeedbackBody';
import Comment from './Comment';

class FeedbackDetailsScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: '',
			feedbackCommentVisible: false,
			commentable_id: null,
			autoFocus: false,
			comment_id: null,
			reply: null,
			fetchingMore: true,
			waitingVisible: false
		};
	}

	//评论
	submitComment = async () => {
		let result = {};
		const { navigation } = this.props;
		const { feedback_id } = navigation.state.params;
		let { comment_id, content } = this.state;
		this.setState({
			waitingVisible: true
		});
		try {
			result = await this.props.createCommentMutation({
				variables: {
					content: this.state.content,
					commentable_type: 'feedbacks',
					commentable_id: feedback_id,
					comment_id: comment_id
				},
				refetchQueries: () => [
					{
						query: feedbackCommentsQuery,
						variables: {
							commentable_id: feedback.id,
							commentable_type: 'feedbacks'
						}
					},
					{
						query: feedbacksQuery
					}
				]
			});
		} catch (ex) {
			result.errors = ex;
		}
		if (result && result.errors) {
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Methods.toast(str, -100);
			this.setState({
				waitingVisible: false
			});
		} else {
			this.setState({
				waitingVisible: false
			});
			Methods.toast('评论成功', -100);
			Keyboard.dismiss();
		}
		this.setState({
			content: ''
		});
	};

	render() {
		const { navigation, user } = this.props;
		let { feedback_id } = navigation.state.params;
		let { autoFocus, reply, content, waitingVisible } = this.state;

		return (
			<Screen
				headerRight={
					<TouchableOpacity onPress={() => this.FeedbackCommentModalVisible()}>
						<Iconfont name={'more-horizontal'} size={18} color={Colors.primaryFont} />
					</TouchableOpacity>
				}
			>
				<Query
					query={feedbackCommentsQuery}
					variables={{ commentable_id: feedback_id, commentable_type: 'feedbacks' }}
				>
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (loading) return <Loading />;
						return (
							<FlatList
								ref={flatList => (this._flatList = flatList)}
								onScrollBeginDrag={() => {
									Keyboard.dismiss();
								}}
								refreshControl={
									<RefreshControl refreshing={loading} onRefresh={refetch} colors={[Colors.theme]} />
								}
								data={data.comments}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item, index }) => (
									<CommentItem
										item={item}
										user={user}
										feedback_id={feedback_id}
										navigation={navigation}
										switchKeybord={this.switchKeybord}
										replyComment={this.replyComment}
									/>
								)}
								ListHeaderComponent={() => {
									return <FeedbackBody navigation={navigation} feedback_id={feedback_id} />;
								}}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									if (data.comments) {
										fetchMore({
											variables: {
												offset: data.comments.length
											},
											updateQuery: (prev, { fetchMoreResult }) => {
												if (!(fetchMoreResult && fetchMoreResult.comments.length > 0)) {
													this.setState({
														fetchingMore: false
													});
													return prev;
												}
												return Object.assign({}, prev, {
													comments: [...prev.comments, ...fetchMoreResult.comments]
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
									return data && data.comments.length > 0 && this.state.fetchingMore ? (
										<LoadingMore />
									) : (
										<ContentEnd content={'还没有评论'} />
									);
								}}
							/>
						);
					}}
				</Query>
				<Comment
					autoFocus={autoFocus}
					reply={reply}
					content={content}
					changeValue={this.changeValue}
					switchKeybord={this.switchKeybord}
					submitComment={this.submitComment}
				/>
				<FeedbackCommentModal
					visible={this.state.feedbackCommentVisible}
					handleVisible={() => {
						this.FeedbackCommentModalVisible();
					}}
					feedback
				/>
				<Waiting isVisible={waitingVisible} customStyle={{ backgroundColor: 'transparent' }} />
			</Screen>
		);
	}

	switchKeybord = () => {
		this.setState({
			autoFocus: !this.state.autoFocus,
			content: '',
			reply: null,
			comment_id: null
		});
	};

	replyComment = comment => {
		this.setState({
			reply: `引用  #${comment.id}  ${comment.user.name}的评论\n`,
			// content: `引用  #${comment.id}  ${comment.user.name}的评论\n`,
			comment_id: comment.id
		});
	};

	changeValue = value => {
		this.setState({
			content: value
		});
	};

	FeedbackCommentModalVisible() {
		this.setState(prevState => ({
			feedbackCommentVisible: !prevState.feedbackCommentVisible
		}));
	}
}

export default connect(store => {
	return {
		user: store.users.user
	};
})(compose(graphql(createCommentMutation, { name: 'createCommentMutation' }))(FeedbackDetailsScreen));
