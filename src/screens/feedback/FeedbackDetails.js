/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 14:29:10
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Keyboard, FlatList, ScrollView } from 'react-native';
import { PageContainer, Iconfont, SubmitLoading, ListFooter, CustomRefreshControl, ErrorView } from 'components';

import { Theme, Api, PxFit, SCREEN_WIDTH } from 'utils';

import { compose, graphql, Query, GQL } from 'apollo';
import { app } from 'store';

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
			commentable_id: null,
			isInput: false,
			comment_id: null,
			reply: null,
			finished: false,
			waitingVisible: false,
			image: null
		};
	}

	render() {
		const { navigation } = this.props;
		let { feedback_id } = navigation.state.params;
		let { isInput, reply, content, waitingVisible } = this.state;
		return (
			<PageContainer title="反馈详情" white topInsets={0}>
				<Query
					query={GQL.feedbackCommentsQuery}
					variables={{ commentable_id: feedback_id, commentable_type: 'feedbacks' }}
					fetchPolicy="network-only"
				>
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <ErrorView onPress={refetch} />;
						if (loading) return <Loading />;
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
									data={data.comments}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index }) => (
										<CommentItem
											item={item}
											user={app.me}
											index={index}
											feedback_id={feedback_id}
											navigation={navigation}
											switchReplyType={this.switchReplyType}
											replyComment={this.replyComment}
										/>
									)}
									onEndReachedThreshold={0.3}
									onEndReached={() => {
										fetchMore({
											variables: {
												offset: data.comments.length
											},
											updateQuery: (prev, { fetchMoreResult }) => {
												if (!(fetchMoreResult && fetchMoreResult.comments.length > 0)) {
													this.setState({
														finished: true
													});
													return prev;
												}
												return Object.assign({}, prev, {
													comments: [...prev.comments, ...fetchMoreResult.comments]
												});
											}
										});
									}}
									ListHeaderComponent={() => {
										return <FeedbackBody navigation={navigation} feedback_id={feedback_id} />;
									}}
									ListFooterComponent={() => {
										return data && data.comments.length > 0 && this.state.finished ? null : null;
									}}
									ListFooterComponent={() => {
										return (
											data &&
											data.comments.length > 0 && <ListFooter finished={this.state.finished} />
										);
									}}
								/>
								<Comment
									isInput={isInput}
									reply={reply}
									content={content}
									changeText={this.changeText}
									switchReplyType={this.switchReplyType}
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
				<SubmitLoading isVisible={waitingVisible} content={'发送中'} />
			</PageContainer>
		);
	}

	//评论
	submitComment = async length => {
		const { navigation } = this.props;
		const { feedback_id } = navigation.state.params;
		let { comment_id, content, image } = this.state;
		let result = {};

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
						query: GQL.feedbackCommentsQuery,
						variables: {
							commentable_id: feedback_id,
							commentable_type: 'feedbacks'
						}
					},
					{
						query: GQL.feedbacksQuery
					},
					{
						query: GQL.feedbackQuery,
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

	switchReplyType = () => {
		this.setState({
			isInput: !this.state.isInput,
			reply: null,
			comment_id: null
		});
	};
	//引用和普通回复切换

	replyComment = comment => {
		this.setState({
			reply: `引用  #${comment.rank}  ${comment.user.name}的评论\n`,
			comment_id: comment.id
		});
	};

	changeText = value => {
		this.setState({
			content: value
		});
	};

	openPhotos = () => {
		Api.imagePicker(
			image => {
				console.log('image', image, image.data);
				this.setState({
					image: `data:${image.mime};base64,${image.data}`,
					isInput: true
				});
			},
			{ includeBase64: true, multiple: false }
		);
	};

	deleteImage = () => {
		this.setState({
			image: ''
		});
	};
}

export default compose(graphql(GQL.createCommentMutation, { name: 'createCommentMutation' }))(FeedbackDetails);
