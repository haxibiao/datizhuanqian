/*
 * @flow
 * created by wyk made in 2019-04-01 21:22:39
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Keyboard, DeviceEventEmitter } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';
import { TouchFeedback, Iconfont, CustomTextInput, SafeText, Avatar, Row } from '../../../components';
import { Provider, connect } from 'react-redux';
import { Mutation, compose, withApollo } from 'react-apollo';
import { createCommentMutation } from '../../../assets/graphql/feedback.graphql';

class CommentInput extends Component {
	constructor(props) {
		super(props);
		this.state = { content: null };
	}

	sendComment = () => {
		let { content } = this.state;
		if (!content) {
			Toast.show({ content: '还没有输入评论', layout: 'top' });
			return;
		}
		this.addComment();
		// this.props.onCompleted({id:-1,user,body:comment});
		this.setState({ content: '' });
		Keyboard.dismiss();
	};

	onCompleted = comment => {
		this.props.onCompleted(comment, true);
	};

	onError = error => {
		let str = error.toString().replace(/Error: GraphQL error: /, '');
		Toast.show({ content: str });
	};

	onChangeText = text => {
		this.setState({ content: text + '' });
	};

	render() {
		let { question_id, navigation, style } = this.props;
		let { content } = this.state;
		return (
			<Mutation
				mutation={createCommentMutation}
				variables={{
					content,
					commentable_id: question_id,
					commentable_type: 'questions'
				}}
				onCompleted={this.onCompleted}
				onError={this.onError}
			>
				{addComment => {
					this.addComment = addComment;
					return (
						<View style={[styles.footerBar, style]}>
							<CustomTextInput
								placeholder={'发表评论'}
								style={styles.textInput}
								value={content}
								onChangeText={this.onChangeText}
							/>
							<TouchFeedback authenticate style={styles.touchItem} onPress={this.sendComment}>
								<Iconfont
									name="plane-fill"
									size={PxFit(24)}
									color={content ? Theme.secondaryColor : Theme.subTextColor}
								/>
							</TouchFeedback>
						</View>
					);
				}}
			</Mutation>
		);
	}
}

const styles = StyleSheet.create({
	footerBar: {
		height: PxFit(50),
		flexDirection: 'row',
		alignItems: 'stretch',
		paddingHorizontal: PxFit(14),
		borderTopWidth: PxFit(1),
		borderTopColor: Theme.borderColor,
		backgroundColor: '#fff'
	},
	textInput: {
		flex: 1,
		paddingVertical: PxFit(10),
		paddingRight: PxFit(20)
	},
	touchItem: {
		width: PxFit(40),
		alignItems: 'flex-end',
		justifyContent: 'center'
	}
});

export default withApollo(CommentInput);
