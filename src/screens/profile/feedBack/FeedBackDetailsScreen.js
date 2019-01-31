import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	Text,
	TouchableOpacity,
	Image,
	Keyboard,
	FlatList,
	RefreshControl
} from 'react-native';
import {
	DivisionLine,
	Iconfont,
	Screen,
	Avatar,
	Header,
	Input,
	CommentItem,
	FeedbackCommentModal,
	BlankContent,
	Loading,
	LoadingError,
	LoadingMore,
	ContentEnd
} from '../../../components';

import { Colors, Divice } from '../../../constants';
import { Methods } from '../../../helpers';

import { connect } from 'react-redux';
import { createCommentMutation, feedbackQuery } from '../../../graphql/user.graphql';
import { feedbackCommentsQuery } from '../../../graphql/feedback.graphql';
import { compose, graphql, Query } from 'react-apollo';

import Comments from './Comments';

class FeedBackDetailsScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: '',
			feedbackCommentVisible: false,
			commentable_id: null,
			autoFocus: false,
			comment_id: null,
			reply: null,
			fetchingMore: true
		};
	}

	submitComment = async () => {
		let result = {};
		const { navigation } = this.props;
		const { feedback_id } = navigation.state.params;
		let { comment_id, content } = this.state;
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
							commentable_id: feedback_id,
							commentable_type: 'feedbacks'
						}
					}
				]
			});
		} catch (ex) {
			result.errors = ex;
		}
		if (result && result.errors) {
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Methods.toast(str, -100);
		} else {
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
		let { autoFocus, reply } = this.state;
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
						// if (!(data && data.comments.length > 0)) return null;

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
								ListHeaderComponent={this.feedbackDetails(data.comments)}
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
										<ContentEnd content={'没有更多记录了~'} />
									);
								}}
							/>
						);
					}}
				</Query>

				<TouchableOpacity style={styles.footer} onPress={this.switchKeybord}>
					{autoFocus ? (
						<View>
							{reply && (
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<View style={{ height: 16, width: 4, backgroundColor: '#dfe2e5' }} />
									<Text
										style={{
											color: Colors.grey,
											fontSize: 13,
											paddingLeft: 10,
											height: 20
										}}
									>
										{reply}
									</Text>
								</View>
							)}
							<Input
								customStyle={styles.input}
								viewStyle={{ paddingHorizontal: 0 }}
								maxLength={140}
								placeholder={'说说你的意见...'}
								multiline
								underline
								autoFocus
								onEndEditing={this.switchKeybord}
								defaultValue={this.state.content}
								changeValue={value => {
									this.setState({
										content: value
									});
								}}
							/>
						</View>
					) : (
						<Text style={{ color: Colors.grey, fontSize: 15 }}>说说你的意见</Text>
					)}
					<TouchableOpacity onPress={this.submitComment}>
						<Text style={styles.commentText}>发布</Text>
					</TouchableOpacity>
				</TouchableOpacity>
				<FeedbackCommentModal
					visible={this.state.feedbackCommentVisible}
					handleVisible={() => {
						this.FeedbackCommentModalVisible();
					}}
					feedback
				/>
			</Screen>
		);
	}

	feedbackDetails = comment => {
		const { navigation } = this.props;
		const { feedback_id } = navigation.state.params;
		return (
			<Query query={feedbackQuery} variables={{ id: feedback_id }}>
				{({ data, error, loading }) => {
					if (error) return <LoadingError reload={() => refetch()} />;
					if (loading) return <Loading />;
					if (!(data && data.feedback))
						return <View style={{ height: Divice.height / 2, backgroundColor: Colors.white }} />;
					let feedback = data.feedback;
					console.log('');
					return (
						<View>
							<View style={styles.header}>
								<Text style={styles.title}>{feedback.title}</Text>
								<View style={styles.user}>
									<Avatar uri={feedback.user.avatar} size={34} />
									<View style={styles.userRight}>
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											<Text
												style={{
													color: feedback.user.is_admin ? Colors.themeRed : Colors.black
												}}
											>
												{feedback.user.name}
											</Text>
											{feedback.user.is_admin ? (
												<Image
													source={require('../../../../assets/images/admin.png')}
													style={{ height: 13, width: 13, marginLeft: 5 }}
												/>
											) : (
												<View
													style={{
														backgroundColor: Colors.theme,
														paddingHorizontal: 2,
														marginLeft: 5,
														marginTop: 1,
														borderRadius: 1
													}}
												>
													<Text style={{ fontSize: 8, color: Colors.white }}>
														Lv.{feedback.user.level.level}
													</Text>
												</View>
											)}
										</View>
										<Text style={styles.time}>发布于{feedback.time_ago}</Text>
									</View>
								</View>
							</View>
							<View style={styles.center}>
								<Text style={styles.body}>{feedback.content}</Text>
								{feedback.images.map((image, index) => {
									let width = image.width;
									let height = image.height;
									let size = imageSize({ width, height });
									return (
										<Image
											source={{ uri: image.path }}
											style={{
												width: size.width,
												height: size.height,
												marginTop: 10
											}}
											key={index}
										/>
									);
								})}
							</View>
							<DivisionLine height={5} />
							<View
								style={{
									paddingHorizontal: 15,
									paddingVertical: 10,
									borderBottomWidth: 0.5,
									borderBottomColor: Colors.lightBorder
								}}
							>
								<Text style={{ fontSize: 16, color: Colors.black }}>评论 {comment.length}</Text>
							</View>
						</View>
					);
				}}
			</Query>
		);
	};
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

	FeedbackCommentModalVisible() {
		this.setState(prevState => ({
			feedbackCommentVisible: !prevState.feedbackCommentVisible
		}));
	}
}

function imageSize({ width, height }) {
	var size = {};
	if (width > Divice.width) {
		size.width = Divice.width - 30;
		size.height = ((Divice.width - 30) * height) / width;
	} else {
		size = { width, height };
	}
	return size;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	header: {
		paddingHorizontal: 15,
		paddingTop: 20
	},
	title: {
		color: Colors.black,
		fontSize: 18
	},
	user: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 20
	},
	userRight: {
		paddingLeft: 10,
		justifyContent: 'space-between',
		height: 34
	},
	time: {
		fontSize: 12,
		color: Colors.grey
	},
	center: {
		marginTop: 15,
		paddingHorizontal: 15,
		paddingBottom: 20
	},
	body: {
		color: Colors.black,
		fontSize: 16,
		paddingBottom: 5,
		lineHeight: 20
	},
	input: {
		padding: 0,
		height: null,
		margin: 0,
		width: Divice.width - 60
	},
	footer: {
		borderTopColor: Colors.lightBorder,
		borderTopWidth: 0.5,
		paddingVertical: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 15,
		maxHeight: 100
	},
	commentText: {
		color: Colors.theme,
		fontSize: 16
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(compose(graphql(createCommentMutation, { name: 'createCommentMutation' }))(FeedBackDetailsScreen));
