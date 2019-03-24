/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 13:29:29
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import { Iconfont, Avatar, UserTitle } from '../../../components';
import { Theme, Tools, PxFit } from '../../../utils';

class FeedbackItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { item, navigation } = this.props;
		return (
			<TouchableOpacity
				onPress={() => {
					navigation.navigate('FeedbackDetails', { feedback_id: item.id });
				}}
				style={{ borderBottomWidth: 5, borderBottomColor: Theme.lightBorder }}
			>
				<View style={styles.top}>
					<View style={styles.topLeft}>
						<Avatar source={{ uri: item.user.avatar }} size={28} />
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<View style={{ justifyContent: 'center' }}>
								<Text
									style={{
										color: item.user.is_admin ? Theme.themeRed : Theme.black,
										paddingLeft: 10
									}}
								>
									{item.user.name}
								</Text>
							</View>
							<UserTitle user={item.user} />
						</View>
					</View>
				</View>
				<View style={{ marginLeft: 15, marginRight: 15, paddingBottom: 10 }}>
					<Text style={styles.body} numberOfLines={3}>
						{item.content}
					</Text>
					{this.renderImage(item.images.slice(0, 3))}
				</View>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginHorizontal: 15,
						paddingBottom: 10
					}}
				>
					<View>
						<Text style={styles.text}>{item.time_ago}</Text>
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
							<Iconfont name={'hot'} size={15} color={Theme.theme} style={{ marginHorizontal: 5 }} />
							<Text style={styles.text}>{item.hot}</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Iconfont
								name={'notification'}
								style={{ marginHorizontal: 5 }}
								color={Theme.theme}
								size={12}
							/>
							<Text style={styles.text}>{item.publish_comments_count}</Text>
						</View>
					</View>
				</View>
				{/*<DivisionLine height={5} />*/}
			</TouchableOpacity>
		);
	}
	renderImage = images => {
		let images_length = images.length;
		let sizeArr = Tools.imgsLayoutSize(images_length, images);
		return (
			<View style={styles.images}>
				{images.map((image, index) => {
					return <Image source={{ uri: image.path }} style={sizeArr[index]} key={index} />;
				})}
			</View>
		);
	};
}

const styles = StyleSheet.create({
	top: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10,
		paddingTop: 15,
		marginHorizontal: 15
	},
	topLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	user: {
		paddingLeft: 10,
		justifyContent: 'center'
	},
	text: {
		fontSize: 13,
		color: Theme.grey
	},
	body: {
		fontSize: 16,
		lineHeight: 18,
		color: Theme.primaryFont
	},
	images: {
		flexDirection: 'row',
		marginTop: 10
	}
});

export default FeedbackItem;
