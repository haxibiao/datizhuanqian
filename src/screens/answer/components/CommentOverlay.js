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
	KeyboardSpacer
} from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, ISIOS } from '../../../utils';
import { Query, Mutation, withApollo, compose, graphql } from 'react-apollo';
import { createCommentMutation } from '../../../assets/graphql/feedback.graphql';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';

class CommentOverlay extends Component {
	constructor(props) {
		super(props);
		this.state = {
			comments: props.comments
		};
	}

	static defaultProps = {
		comments: []
	};

	componentWillReceiveProps(nextProps) {
		try {
			// 更新comment
			if (nextProps.comments) {
				let comments = [...this.state.comments, ...nextProps.comments];
				this.setState({ comments });
			}
		} catch {
			console.log('componentWillReceiveProps error');
		}
	}

	onCommented = newComment => {
		if (newComment) {
			let { comments } = this.state;
			comments.unshift(newComment);
			this.setState({ comments });
			this._flatList.scrollToOffset({
				offset: 0,
				animated: true
			});
			Toast.show({ content: '评论成功', layout: 'bottom' });
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
		let { fetchMoreComment } = this.props;
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
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item, index }) => {
					return <CommentItem comment={item} />;
				}}
				ItemSeparatorComponent={() => <ItemSeparator height={PxFit(1)} />}
				onEndReachedThreshold={0.3}
				onEndReached={() => fetchMoreComment()}
			/>
		);
	};

	render() {
		let { visible, onHide, question_id, hideComment, loadComment } = this.props;
		return (
			<Modal
				isVisible={visible}
				onBackButtonPress={onHide}
				onBackdropPress={onHide}
				backdropColor={'transparent'}
				backdropOpacity={1}
				style={{ justifyContent: 'flex-end', margin: 0 }}
			>
				<View style={styles.commentContainer}>
					{this._renderCommentHeader()}
					<View style={{ flex: 1 }}>{this.renderContent()}</View>
					<CommentInput commentable_id={question_id} onCompleted={this.onCommented} />
					<KeyboardSpacer topInsets={-Theme.HOME_INDICATOR_HEIGHT} />
				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	commentContainer: {
		height: (SCREEN_HEIGHT * 2) / 3,
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
		backgroundColor: '#fff'
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
