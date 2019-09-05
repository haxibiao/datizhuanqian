/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 13:29:29
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import { Iconfont, Avatar, UserTitle, GenderLabel } from 'components';
import { Theme, Tools, PxFit } from 'utils';

class FeedbackItem extends React.PureComponent {
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
				style={styles.container}
			>
				<View style={styles.top}>
					<View style={styles.topLeft}>
						<Avatar source={{ uri: item.user.avatar }} size={28} />
						<View style={styles.row}>
							<View style={{ justifyContent: 'center' }}>
								<Text
									style={{
										color: item.user.is_admin ? Theme.secondaryColor : Theme.black,
										paddingLeft: PxFit(10)
									}}
								>
									{item.user.name}
								</Text>
							</View>
							<UserTitle user={item.user} />
							<GenderLabel user={item.user} />
						</View>
					</View>
				</View>
				<View style={styles.content}>
					<Text style={styles.body} numberOfLines={3}>
						{item.content}
					</Text>
					{this.renderImage(item.images.slice(0, 3))}
				</View>
				<View style={styles.footer}>
					<View>
						<Text style={styles.text}>{item.time_ago}</Text>
					</View>
					<View style={styles.footerRight}>
						<View style={[styles.row, { marginRight: PxFit(10) }]}>
							<Iconfont
								name={'hot'}
								size={15}
								color={Theme.primaryColor}
								style={{ marginHorizontal: PxFit(5) }}
							/>
							<Text style={styles.text}>{item.hot}</Text>
						</View>
						<View style={styles.row}>
							<Iconfont
								name={'notification'}
								style={{ marginHorizontal: PxFit(5) }}
								color={Theme.primaryColor}
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
	container: {
		borderBottomWidth: PxFit(5),
		borderBottomColor: Theme.lightBorder
	},
	top: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: PxFit(10),
		paddingTop: PxFit(15),
		marginHorizontal: PxFit(15)
	},
	topLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	content: {
		marginLeft: PxFit(15),
		marginRight: PxFit(15),
		paddingBottom: PxFit(10)
	},

	body: {
		fontSize: PxFit(16),
		lineHeight: PxFit(18),
		color: Theme.primaryFont
	},
	images: {
		flexDirection: 'row',
		marginTop: PxFit(10)
	},
	text: {
		fontSize: PxFit(13),
		color: Theme.grey
	},
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: PxFit(15),
		paddingBottom: PxFit(10)
	},
	footerRight: { flexDirection: 'row', alignItems: 'center' }
});

export default FeedbackItem;
