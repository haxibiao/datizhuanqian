import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';

import { Colors } from '../../constants';
import { Methods } from '../../helpers';

import { Avatar, Iconfont, Screen, DivisionLine, Loading, LoadingError, UserTitle } from '../../components';

import { Query } from 'react-apollo';
import { feedbackQuery } from '../../graphql/feedback.graphql';

class FeedbackBody extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { navigation, feedback_id } = this.props;

		return (
			<Query query={feedbackQuery} variables={{ id: feedback_id }}>
				{({ data, error, loading }) => {
					if (error) return <LoadingError reload={() => refetch()} />;
					if (loading) return <Loading />;
					if (!(data && data.feedback))
						return <View style={{ height: Divice.height / 2, backgroundColor: Colors.white }} />;
					let feedback = data.feedback;

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
											<UserTitle user={feedback.user} />
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
									let padding = 30;
									let size = Methods.imageSize({ width, height, padding });
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
								<Text style={{ fontSize: 16, color: Colors.black }}>
									评论 {feedback.publish_comments_count}
								</Text>
							</View>
						</View>
					);
				}}
			</Query>
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
		fontSize: 11,
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
