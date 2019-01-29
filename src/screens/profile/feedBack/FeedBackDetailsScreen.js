import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { DivisionLine, Iconfont, Screen, Avatar, Header, Input } from '../../../components';

import { Colors, Divice } from '../../../constants';
import { Methods } from '../../../helpers';

import Comments from './Comments';

class FeedBackDetailsScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '提现多久到账',
			body: '提现3天了还没有点反应。。。',
			images: ['http://cos.qunyige.com/storage/image/14434.jpg']
		};
	}

	submitComment = async () => {};

	render() {
		const { navigation } = this.props;
		let { title, body, images } = this.state;
		let { feedback } = navigation.state.params;
		console.log('feed', feedback);
		return (
			<Screen headerRight={<Iconfont name={'more-horizontal'} size={18} color={Colors.primaryFont} />}>
				<ScrollView style={styles.container}>
					<View style={styles.header}>
						<Text style={styles.title}>{feedback.title}</Text>
						<View style={styles.user}>
							<Avatar uri={feedback.user.avatar} size={34} />
							<View style={styles.userRight}>
								<Text style={{ color: Colors.black }}>{feedback.user.name}</Text>
								<Text style={styles.time}>发布于{feedback.time_ago}</Text>
							</View>
						</View>
					</View>
					<View style={styles.footer}>
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
					<Comments />
				</ScrollView>
				<View style={styles.footer}>
					<Input
						customStyle={styles.input}
						viewStyle={{ paddingHorizontal: 15 }}
						maxLength={140}
						placeholder={'说说你的意见...'}
						multiline
						underline
						changeValue={value => {
							this.setState({
								content: value
							});
						}}
					/>
					<TouchableOpacity onPress={this.submitComment}>
						<Text style={styles.commentText}>发布</Text>
					</TouchableOpacity>
				</View>
			</Screen>
		);
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
		color: Colors.theme,
		fontSize: 16
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
	footer: {
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
		width: Divice.width - 100
	},
	footer: {
		borderTopColor: Colors.lightBorder,
		borderTopWidth: 0.5,
		paddingVertical: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
		maxHeight: 100
	},
	commentText: {
		color: Colors.theme,
		fontSize: 16
	}
});

export default FeedBackDetailsScreen;
