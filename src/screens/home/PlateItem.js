import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions } from 'react-native';

import { Colors } from '../../constants';
import { Iconfont } from '../../utils/Fonts';

const { width, height } = Dimensions.get('window');

class PlateItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { category, navigation, login } = this.props;
		return (
			<TouchableOpacity
				style={styles.container}
				onPress={() =>
					login
						? navigation.navigate('回答', {
								category: category
						  })
						: navigation.navigate('登录注册')
				}
			>
				<View style={styles.leftContent}>
					<Image source={{ uri: category.icon }} style={styles.img} />
					<View style={{ paddingHorizontal: 20, width: (width * 3) / 4 }}>
						<Text style={styles.title}>{category.name}</Text>
						<Text style={styles.content}>{category.description}</Text>
					</View>
				</View>
				<Iconfont name={'right'} size={16} />
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 18,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder,
		paddingHorizontal: 15
	},
	leftContent: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	img: {
		width: 48,
		height: 48,
		borderRadius: 2
	},
	title: {
		fontSize: 16,
		fontWeight: '400',
		color: Colors.black
	},
	content: {
		fontSize: 14,
		color: Colors.tintFont,
		paddingTop: 6,
		lineHeight: 20
	}
});

export default PlateItem;
