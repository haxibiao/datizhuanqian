import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';

import { Colors } from '../../constants';
import { Methods } from '../../helpers';

import { Avatar, Iconfont, Screen, DivisionLine, FeedbackCommentModal } from '../../components';

class FeedbackBody extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { navigation, feedback } = this.props;

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
										source={require('../../../assets/images/admin.png')}
										style={{ height: 13, width: 13, marginLeft: 5 }}
									/>
								) : (
									<View style={styles.level}>
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
						let size = Methods.imageSize({ width, height });
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
				<View style={styles.commentsTab}>
					<Text style={{ fontSize: 16, color: Colors.black }}>评论 {feedback.publish_comments_count}</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
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
	commentsTab: {
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderBottomWidth: 0.5,
		borderBottomColor: Colors.lightBorder
	}
});

export default FeedbackBody;
