/*
 * @flow
 * created by wyk made in 2019-04-01 17:53:01
 */
'use strict';
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	TouchableWithoutFeedback,
	Image,
	Dimensions,
	FlatList,
	Text,
	Platform,
	BackHandler,
	Keyboard
} from 'react-native';
import Modal from 'react-native-modal';
import {
	TouchFeedback,
	Iconfont,
	Row,
	ItemSeparator,
	StatusView,
	Placeholder,
	KeyboardSpacer,
	ListFooter
} from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, ISIOS, Tools } from '../../../utils';
import { Query, Mutation, withApollo, compose, graphql } from 'react-apollo';
import { createCommentMutation } from '../../../assets/graphql/feedback.graphql';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';

import { BoxShadow } from 'react-native-shadow';
const shadowOpt = {
	width: SCREEN_WIDTH,
	color: '#E8E8E8',
	border: PxFit(3),
	radius: PxFit(10),
	opacity: 0.5,
	x: 0,
	y: 1,
	style: {
		marginTop: 0
	}
};

class CommentOverlay extends Component {
	constructor(props) {
		super(props);
		this.commentLength = props.comments.length;
		console.log('props.comments', props.comments);
		this.state = {
			comments: props.comments,
			finished: this.commentLength < 10
		};
	}

	static defaultProps = {
		comments: []
	};

	componentWillReceiveProps(nextProps) {
		try {
			// 更新comment
			if (nextProps.questionId !== this.props.questionId) {
				this.setState({ comments: nextProps.comments });
			}
		} catch {
			console.log('componentWillReceiveProps error');
		}
	}

	fetchMoreComment = () => {
		if (this.state.finished) return;
		this.props
			.fetchMoreComment(this.commentLength)
			.then(result => {
				this.commentLength += result.comments.length;
				console.log('fetchMoreComment result', result);
				let comments = this.state.comments.concat(result.comments);
				if (result.comments.length < 10) {
					this.setState({ comments, finished: true });
					return;
				}
				this.setState({ comments });
			})
			.catch(err => {
				Toast.show({ content: err.toString().replace(/Error: GraphQL error: /, '') });
			});
	};

	onCommented = (newComment, really) => {
		let { comments } = this.state;
		if (newComment && really) {
			comments[0] = Object.assign({}, comments[0], newComment.createComment);
			this.setState({ comments });
		} else if (newComment) {
			comments.unshift(newComment);
			this.setState({ comments });
			this._flatList &&
				this._flatList.scrollToOffset({
					offset: 0,
					animated: true
				});
		}
	};

	_renderCommentHeader = () => {
		return (
			<View style={styles.header}>
				<Text style={styles.headerText}>评论</Text>
				<TouchFeedback style={styles.close} onPress={this.props.onHide}>
					<Iconfont name="close" size={PxFit(22)} color={Theme.defaultTextColor} />
				</TouchFeedback>
			</View>
		);
	};

	renderContent = () => {
		let { comments } = this.state;
		if (!comments) return <Placeholder type="comment" />;
		if (comments && comments.length === 0) return <StatusView.EmptyView />;
		return (
			<FlatList
				ref={ref => (this._flatList = ref)}
				style={{ flex: 1 }}
				data={comments}
				onScrollBeginDrag={() => {
					Keyboard.dismiss();
				}}
				keyboardShouldPersistTaps="always"
				keyExtractor={(item, index) => item.id.toString()}
				renderItem={({ item, index }) => {
					return <CommentItem comment={item} />;
				}}
				ItemSeparatorComponent={() => <ItemSeparator height={PxFit(1)} />}
				ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
				onEndReachedThreshold={0.3}
				onEndReached={Tools.throttle(this.fetchMoreComment, 500)}
			/>
		);
	};

	render() {
		let { visible, onHide, questionId, hideComment, loadComment } = this.props;
		return (
			<Modal
				isVisible={visible}
				onBackButtonPress={onHide}
				onBackdropPress={onHide}
				backdropColor={'transparent'}
				backdropOpacity={1}
				style={{ justifyContent: 'flex-end', margin: 0 }}
			>
				<BoxShadow
					setting={Object.assign({}, shadowOpt, {
						height: (SCREEN_HEIGHT * 2) / 3
					})}
				>
					<View style={styles.commentContainer}>
						{this._renderCommentHeader()}
						<View style={{ flex: 1 }}>{this.renderContent()}</View>
						<CommentInput questionId={questionId} onCompleted={this.onCommented} />
						{ISIOS && <KeyboardSpacer topInsets={-Theme.HOME_INDICATOR_HEIGHT} />}
					</View>
				</BoxShadow>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	commentContainer: {
		height: (SCREEN_HEIGHT * 2) / 3,
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
		backgroundColor: '#fff',
		borderTopLeftRadius: PxFit(10),
		borderTopRightRadius: PxFit(10)
	},
	header: {
		height: PxFit(50),
		borderTopWidth: PxFit(0.5),
		borderBottomWidth: PxFit(0.5),
		borderColor: Theme.groundColour,
		alignItems: 'center',
		justifyContent: 'center'
	},
	headerText: {
		fontSize: PxFit(16),
		color: Theme.secondaryTextColor
	},
	close: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		width: PxFit(50),
		height: PxFit(50),
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default compose(graphql(createCommentMutation, { name: 'createCommentMutation' }))(CommentOverlay);
