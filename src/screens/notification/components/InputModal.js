/*
 * @flow
 * created by wyk made in 2019-05-10 22:42:25
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Keyboard } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, ISIOS, Tools } from '../../../utils';
import { KeyboardSpacer, CustomTextInput, TouchFeedback, Iconfont } from '../../../components';

import Modal from 'react-native-modal';

import { Query, withApollo, GQL, compose, graphql } from 'apollo';
import { app } from 'store';

class InputModal extends Component {
	constructor(props) {
		super(props);
		this.state = { content: null };
	}

	render() {
		const { visible, hideModal, comment_id, questionId, reply, createChildComment, switchReplyType } = this.props;
		let { content } = this.state;
		let disabled = !content || !content.trim();

		return (
			<Modal
				isVisible={visible}
				onBackdropPress={hideModal}
				backdropOpacity={0}
				style={{ justifyContent: 'flex-end', width: SCREEN_WIDTH, margin: 0 }}
				onShow={() => {
					this.textInput.focus();
				}}
				onDismiss={switchReplyType}
			>
				<View>
					<View style={styles.footerBar}>
						<CustomTextInput
							textInputRef={input => {
								this.textInput = input;
							}}
							placeholder={reply ? reply : '发表评论'}
							style={styles.textInput}
							onChangeText={this.onChangeText}
						/>
						<TouchFeedback
							disabled={disabled}
							style={styles.touchItem}
							onPress={() => {
								createChildComment({
									variables: {
										content: content && content.trim(),
										// commentable_id: questionId,
										comment_id: comment_id,
										commentable_type: 'comments'
									}
								}).then(data => {
									console.log('data0', data);
								});
								this.setState({ content: '' });
								Keyboard.dismiss();
								hideModal();
							}}
						>
							<Iconfont
								name="plane-fill"
								size={PxFit(24)}
								color={!disabled ? Theme.secondaryColor : Theme.subTextColor}
							/>
						</TouchFeedback>
					</View>
					{ISIOS && <KeyboardSpacer />}
				</View>
			</Modal>
		);
	}

	onChangeText = text => {
		this.setState({ content: text });
	};
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

export default compose(
	withApollo,
	graphql(GQL.createChildCommentMutation, { name: 'createChildComment' })
)(InputModal);
