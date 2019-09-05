/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 15:39:23
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import { Theme, Tools, PxFit } from 'utils';
import { Avatar, Iconfont, UserTitle, GenderLabel } from 'components';

import { Query, GQL } from 'apollo';

import Loading from './Loading';

class FeedbackBody extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { navigation, feedback_id, getHeight } = this.props;

		return (
			<Query query={GQL.feedbackQuery} variables={{ id: feedback_id }}>
				{({ data, error, loading }) => {
					if (error) return null;
					if (loading) return <Loading />;
					if (!(data && data.feedback))
						return <View style={{ height: Divice.height / 2, backgroundColor: Theme.white }} />;
					let feedback = data.feedback;
					return (
						<View>
							<View style={styles.header}>
								<View style={styles.user}>
									<TouchableOpacity
										onPress={() => navigation.navigate('User', { user: feedback.user })}
									>
										<Avatar source={{ uri: feedback.user.avatar }} size={34} />
									</TouchableOpacity>

									<View style={styles.userRight}>
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											<Text
												style={{
													color: feedback.user.is_admin ? Theme.secondaryColor : Theme.black
												}}
											>
												{feedback.user.name}
											</Text>
											<UserTitle user={feedback.user} />
											<GenderLabel user={feedback.user} />
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
									let size = Tools.imageSize({ width, height, padding });
									return (
										<Image
											source={{ uri: image.path }}
											style={{
												width: size.width,
												height: size.height,
												marginTop: PxFit(10)
											}}
											key={index}
										/>
									);
								})}
							</View>
							<View style={{ height: PxFit(5), backgroundColor: Theme.lightBorder }} />
							<View style={styles.commentsTab}>
								<Text style={{ fontSize: PxFit(16), color: Theme.black }}>
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
		paddingHorizontal: PxFit(15),
		paddingTop: PxFit(10)
	},
	title: {
		color: Theme.black,
		fontSize: PxFit(18)
	},
	user: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: PxFit(10)
	},
	userRight: {
		paddingLeft: PxFit(10),
		justifyContent: 'space-between',
		height: PxFit(34)
	},
	time: {
		fontSize: PxFit(11),
		color: Theme.grey
	},
	center: {
		marginTop: PxFit(15),
		paddingHorizontal: PxFit(15),
		paddingBottom: PxFit(20)
	},
	body: {
		color: Theme.black,
		fontSize: PxFit(16),
		paddingBottom: PxFit(5),
		lineHeight: PxFit(20)
	},
	commentsTab: {
		paddingHorizontal: PxFit(15),
		paddingVertical: PxFit(10),
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.lightBorder
	}
});

export default FeedbackBody;
