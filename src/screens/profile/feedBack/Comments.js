import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';

import { Colors } from '../../../constants';
import { Methods } from '../../../helpers';

import { Avatar, Iconfont, Screen, DivisionLine, FeedbackCommentModal } from '../../../components';

class Comments extends Component {
	constructor(props) {
		super(props);
		this.state = {
			feedbackCommentVisible: false,
			commentable_id: null
		};
	}

	_commentItem = ({ item, index }) => {
		return (
			<View style={styles.container}>
				<View style={styles.top}>
					<View style={styles.topLeft}>
						<Avatar uri={item.user.avatar} size={34} />
						<View style={styles.user}>
							<Text style={styles.name}>{item.user.name}</Text>
							<Text style={styles.time}>评论于{item.time_ago}</Text>
						</View>
					</View>
					<TouchableOpacity
						onPress={() => {
							this.FeedbackCommentModalVisible();
							this.setState({
								commentable_id: item.id
							});
						}}
					>
						<Iconfont name={'more-horizontal'} size={14} />
					</TouchableOpacity>
				</View>

				<View style={{ marginTop: 10, marginLeft: 44 }}>
					<Text style={{ color: Colors.black, fontSize: 15 }}>{item.content}</Text>
				</View>
				{/*<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						paddingTop: 15
					}}
				>
					<View style={styles.button}>
						<Iconfont name={'praise2'} color={Colors.theme} size={14} style={{ paddingRight: 5 }} />
						<Text style={{ color: Colors.theme }}>{item.praise}</Text>
					</View>
					<View style={styles.button}>
						<Iconfont name={'step2'} color={Colors.black} size={14} style={{ paddingRight: 5 }} />
						<Text>{item.step}</Text>
					</View>
				</View>*/}
			</View>
		);
	};

	render() {
		const { navigation, feedback } = this.props;
		let { feedbackCommentVisible, commentable_id } = this.state;
		return (
			<FlatList
				data={feedback.comments}
				keyExtractor={(item, index) => index.toString()}
				renderItem={this._commentItem}
				ListHeaderComponent={() => (
					<View
						style={{
							paddingHorizontal: 15,
							paddingVertical: 10,
							borderBottomWidth: 0.5,
							borderBottomColor: Colors.lightBorder
						}}
					>
						<Text style={{ fontSize: 16, color: Colors.black }}>
							评论 {feedback.publish_comments_count}
						</Text>
						<FeedbackCommentModal
							visible={feedbackCommentVisible}
							handleVisible={() => {
								this.FeedbackCommentModalVisible();
							}}
							// reply={() => {
							// 	this.setState({
							// 		commentable_id:
							// 	})
							// }}
							commentable_id={commentable_id}
						/>
					</View>
				)}
			/>
		);
	}

	FeedbackCommentModalVisible() {
		this.setState(prevState => ({
			feedbackCommentVisible: !prevState.feedbackCommentVisible
		}));
	}
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 15,
		paddingVertical: 15,
		borderBottomColor: Colors.lightBorder,
		borderBottomWidth: 0.5
	},
	top: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	topLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	user: {
		paddingLeft: 10,
		justifyContent: 'space-between',
		height: 34
	},
	name: {
		color: Colors.black,
		fontSize: 14
	},
	time: {
		fontSize: 11,
		color: Colors.grey,
		lineHeight: 16
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: Colors.lightBorder,
		paddingHorizontal: 7,
		paddingVertical: 3,
		borderRadius: 5,
		marginLeft: 8
	}
});

export default Comments;
