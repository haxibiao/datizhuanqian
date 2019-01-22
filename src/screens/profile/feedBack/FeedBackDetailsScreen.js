import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { DivisionLine, Iconfont, Screen, Avatar, Header } from '../../../components';

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

	render() {
		const { navigation } = this.props;
		let { title, body, images } = this.state;
		return (
			<Screen headerRight={<Iconfont name={'more-horizontal'} size={18} color={Colors.primaryFont} />}>
				<ScrollView style={styles.container}>
					<View style={styles.header}>
						<Text style={{ color: Colors.black, fontSize: 20 }}>{title}</Text>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginTop: 20
							}}
						>
							<Avatar uri={'http://cos.qunyige.com/storage/avatar/13.jpg'} size={34} />
							<View style={{ paddingLeft: 10, justifyContent: 'center' }}>
								<Text style={{ color: Colors.black }}>Xuan</Text>
								<Text style={{ fontSize: 12, color: Colors.grey, lineHeight: 16 }}>发布于3小时前</Text>
							</View>
						</View>
					</View>
					<View style={{ marginTop: 15, paddingHorizontal: 15, paddingBottom: 20 }}>
						<Text style={{ color: Colors.black, fontSize: 14, paddingBottom: 5 }}>{body}</Text>
						{images.map((image, index) => {
							return (
								<Image
									source={{ uri: image }}
									style={{ width: Divice.width - 30, height: Divice.width - 30, marginTop: 10 }}
									key={index}
								/>
							);
						})}
					</View>
					<DivisionLine height={5} />
					<Comments />
				</ScrollView>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	header: {
		paddingHorizontal: 15,
		paddingTop: 20
	}
});

export default FeedBackDetailsScreen;
