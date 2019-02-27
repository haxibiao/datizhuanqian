import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Keyboard, FlatList, RefreshControl, ScrollView } from 'react-native';
import {
	Screen,
	Iconfont,
	CommentItem,
	FeedbackCommentModal,
	BlankContent,
	LoadingError,
	LoadingMore,
	ContentEnd,
	SubmitLoading
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

import FeedbackBody from './components/FeedbackBody';
import Comment from './components/Comment';
import Loading from './components/Loading';

import KeyboardSpacer from 'react-native-keyboard-spacer';

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
			waitingVisible: false,
			image: '',
			feedbackHeight: 50
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
					comment_id: comment_id,
					images: [this.state.image]
				},
				refetchQueries: () => [
					{
						query: feedbackCommentsQuery,
						variables: {
							commentable_id: feedback_id,
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
			this.scrollRef.scrollToIndex({ index: 1, animated: true });
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
						// if (!(data && data.comments && data.comments.length > 0))
						// 	return <ContentEnd content={'还没有评论'} />;
						let adminComment = data.comments.filter((elem, i) => {
							return elem.user.is_admin == true;
						});
						return (
							<View style={{ flex: 1 }}>
								<FlatList
									ref={ref => (this.scrollRef = ref)}
									onScrollBeginDrag={() => {
										Keyboard.dismiss();
									}}
									refreshControl={
										<RefreshControl
											refreshing={loading}
											onRefresh={refetch}
											colors={[Colors.theme]}
										/>
									}
									data={data.comments}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index }) =>
										item.user.is_admin ? null : (
											<CommentItem
												item={item}
												user={user}
												feedback_id={feedback_id}
												navigation={navigation}
												switchKeybord={this.switchKeybord}
												replyComment={this.replyComment}
											/>
										)
									}
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
									ListHeaderComponent={() => {
										return (
											<View>
												<FeedbackBody navigation={navigation} feedback_id={feedback_id} />
												{adminComment.map((comment, index) => {
													return (
														<CommentItem
															item={comment}
															user={user}
															feedback_id={feedback_id}
															navigation={navigation}
															switchKeybord={this.switchKeybord}
															replyComment={this.replyComment}
															key={index}
														/>
													);
												})}
											</View>
										);
									}}
									ListFooterComponent={() => {
										return data && data.comments.length > 0 && this.state.fetchingMore ? (
											<LoadingMore />
										) : (
											<ContentEnd content={'没有更多评论了'} />
										);
									}}
								/>
								<Comment
									autoFocus={autoFocus}
									reply={reply}
									content={content}
									changeValue={this.changeValue}
									switchKeybord={this.switchKeybord}
									submitComment={this.submitComment}
									openPhotos={this.openPhotos}
									image={this.state.image}
									deleteImage={this.deleteImage}
								/>
							</View>
						);
					}}
				</Query>

				{Divice.isIos && <KeyboardSpacer />}
				<FeedbackCommentModal
					visible={this.state.feedbackCommentVisible}
					handleVisible={() => {
						this.FeedbackCommentModalVisible();
					}}
					feedback
				/>
				<SubmitLoading isVisible={waitingVisible} tips={'发送中'} />
			</Screen>
		);
	}

	switchKeybord = () => {
		this.setState({
			autoFocus: !this.state.autoFocus,
			// content: '',
			reply: null,
			comment_id: null
		});
	};

	replyComment = comment => {
		this.setState({
			reply: `引用  #${comment.rank}  ${comment.user.name}的评论\n`,
			// content: `引用  #${comment.id}  ${comment.user.name}的评论\n`,
			comment_id: comment.id
		});
	};

	changeValue = value => {
		this.setState({
			content: value
		});
	};

	openPhotos = () => {
		Methods.imagePicker(image => {
			this.setState({
				image: `data:${image.mime};base64,${image.data}`,
				autoFocus: true
			});
		}, false);
	};

	deleteImage = () => {
		this.setState({
			image: ''
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
