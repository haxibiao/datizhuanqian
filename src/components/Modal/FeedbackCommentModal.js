import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions } from 'react-native';
import BasicModal from './BasicModal';

import { Colors, Divice } from '../../constants';
import { Methods } from '../../helpers';
import { deleteCommentMutation } from '../../graphql/user.graphql';
import { feedbackCommentsQuery } from '../../graphql/feedback.graphql';
import { graphql, compose } from 'react-apollo';

class FeedbackCommentModal extends Component {
	deleteComment = async () => {
		let result = {};
		const { comment, feedback_id, handleVisible } = this.props;
		try {
			result = await this.props.deleteCommentMutation({
				variables: {
					id: comment.id
				},
				refetchQueries: () => [
					{
						query: feedbackQuery,
						variables: {
							commentable_id: feedback_id,
							commentable_type: 'feedbacks'
						}
					}
				]
			});
		} catch (ex) {
			result.errors = result;
		}
		if (result && result.errors) {
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Methods.toast(str, -100);
		} else {
			Methods.toast('删除成功');
			handleVisible();
		}
	};

	render() {
		const {
			visible,
			handleVisible,
			reply,
			commentable_id,
			switchKeybord,
			replyComment,
			comment,
			user,
			feedback
		} = this.props;
		return (
			<BasicModal
				visible={visible}
				handleVisible={handleVisible}
				customStyle={{
					width: Divice.width - 100,
					borderRadius: 10,
					padding: 0
				}}
			>
				<TouchableOpacity
					style={{ paddingVertical: 15 }}
					onPress={() => {
						handleVisible();
					}}
				>
					<Text style={{ fontSize: 15, color: Colors.black, paddingLeft: 15 }}>举报</Text>
				</TouchableOpacity>
				{!feedback && (
					<TouchableOpacity
						style={{ paddingVertical: 15, borderTopColor: Colors.lightBorder, borderTopWidth: 0.5 }}
						onPress={() => {
							handleVisible();
							switchKeybord();
							replyComment(comment);
						}}
					>
						<Text style={{ fontSize: 15, color: Colors.black, paddingLeft: 15 }}>引用</Text>
					</TouchableOpacity>
				)}
				{!feedback
					? user.id == comment.user.id && (
							<TouchableOpacity
								style={{ paddingVertical: 15, borderTopColor: Colors.lightBorder, borderTopWidth: 0.5 }}
								onPress={this.deleteComment}
							>
								<Text style={{ fontSize: 15, color: Colors.black, paddingLeft: 15 }}>删除</Text>
							</TouchableOpacity>
					  )
					: null}
			</BasicModal>
		);
	}
}

const styles = StyleSheet.create({});

export default compose(graphql(deleteCommentMutation, { name: 'deleteCommentMutation' }))(FeedbackCommentModal);
