/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 14:29:10
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Keyboard, FlatList, RefreshControl, ScrollView } from 'react-native';
import { PageContainer, Iconfont, SubmitLoading } from '../../components';

import { Theme, Api, PxFit, SCREEN_WIDTH } from '../../utils';

import { connect } from 'react-redux';
import {
	feedbackCommentsQuery,
	createCommentMutation,
	feedbackQuery,
	feedbacksQuery
} from '../../assets/graphql/feedback.graphql';
import { compose, graphql, Query } from 'react-apollo';

import FeedbackBody from './components/FeedbackBody';
import Comment from './components/Comment';
import Loading from './components/Loading';
import CommentItem from './components/CommentItem';
import FeedbackOverlay from './components/FeedbackOverlay';

class FeedbackDetails extends Component {
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
			image: null,
			feedbackHeight: 50,
			backgroundColor: Theme.white
		};
	}

	//评论
	submitComment = async length => {
		let result = {};
		const { navigation } = this.props;
		const { feedback_id } = navigation.state.params;
		let { comment_id, content, image } = this.state;
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
					images: image ? [image] : null
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
					},
					{
						query: feedbackQuery,
						variables: {
							id: feedback_id
						}
					}
				]
			});
		} catch (ex) {
			result.errors = ex;
		}
		if (result && result.errors) {
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Toast.show({ content: str });
			this.setState({
				waitingVisible: false
			});
		} else {
			this.setState({
				waitingVisible: false
			});
			Toast.show({ content: '评论成功' });
			Keyboard.dismiss();
			this.setState({
				content: '',
				image: null
			});

			this.scrollRef.scrollToIndex({ index: 0 + length, animated: true });
		}
	};

	render() {
		const { navigation, user } = this.props;
		let { feedback_id } = navigation.state.params;
		let { autoFocus, reply, content, waitingVisible, feedbackCommentVisible } = this.state;
		return (
			<PageContainer
				title="反馈详情"
				white
				rightView={
					<TouchableOpacity
						onPress={() => {
							FeedbackOverlay.show();
						}}
					>
						<Iconfont name={'more-horizontal'} size={18} color={Theme.primaryFont} />
					</TouchableOpacity>
				}
			>
				<Query
					query={feedbackCommentsQuery}
					variables={{ commentable_id: feedback_id, commentable_type: 'feedbacks' }}
				>
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return null;
						if (loading) return null;
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
											colors={[Theme.theme]}
										/>
									}
									data={data.comments}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index }) => (
										<CommentItem
											item={item}
											user={user}
											index={index}
											feedback_id={feedback_id}
											navigation={navigation}
											switchKeybord={this.switchKeybord}
											replyComment={this.replyComment}
										/>
									)}
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
										return <FeedbackBody navigation={navigation} feedback_id={feedback_id} />;
									}}
									ListFooterComponent={() => {
										return data && data.comments.length > 0 && this.state.fetchingMore
											? null
											: null;
									}}
								/>
								<Comment
									autoFocus={autoFocus}
									reply={reply}
									content={content}
									changeValue={this.changeValue}
									switchKeybord={this.switchKeybord}
									submitComment={() => {
										this.submitComment(adminComment.length);
									}}
									openPhotos={this.openPhotos}
									image={this.state.image}
									deleteImage={this.deleteImage}
								/>
							</View>
						);
					}}
				</Query>
				<SubmitLoading isVisible={waitingVisible} tips={'发送中'} />
			</PageContainer>
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
		Api.imagePicker(image => {
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
}

export default connect(store => {
	return {
		user: store.users.user
	};
})(compose(graphql(createCommentMutation, { name: 'createCommentMutation' }))(FeedbackDetails));
