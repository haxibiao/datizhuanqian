import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions } from 'react-native';

import { Colors } from '../../constants';
import { Methods } from '../../helpers';
import { Iconfont } from '../utils/Fonts';

class CorrectionItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, item } = this.props;
		return (
			<TouchableOpacity
				style={styles.container}
				onPress={() => {
					navigation.dispatch(
						Methods.navigationAction({
							routeName: '回答',
							params: {
								category: {
									id: null
								},
								question_id: item.question.id
							}
						})
					);
				}}
			>
				<Text style={styles.content}>{item.question.description}</Text>
				{item.content && (
					<View style={{ paddingTop: 6 }}>
						<Text style={{ fontSize: 13, color: Colors.black }}>{item.content}</Text>
					</View>
				)}

				<View style={styles.footer}>
					<View style={styles.left}>
						{item.status == 1 && <Text style={{ color: Colors.weixin, fontSize: 12 }}>已采纳</Text>}
						{item.status == 0 && <Text style={{ color: Colors.theme, fontSize: 12 }}>审核中</Text>}
						{item.status == -1 && <Text style={{ color: Colors.themeRed, fontSize: 12 }}>未采纳</Text>}
						{item.type == 0 && <Text style={styles.greyText}>·题干有误</Text>}
						{item.type == 1 && <Text style={styles.greyText}>·答案有误</Text>}
						{item.type == 2 && <Text style={styles.greyText}>·图片缺少或不清晰</Text>}
						{item.type == 3 && <Text style={styles.greyText}>·其他</Text>}
					</View>
					<Text style={styles.greyText}>{item.created_at}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 15,
		paddingVertical: 10,
		justifyContent: 'center',
		borderBottomColor: Colors.lightBorder,
		borderBottomWidth: 0.5
	},
	content: {
		fontSize: 15,
		color: Colors.black
	},
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: 6
	},
	left: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	greyText: {
		color: Colors.grey,
		fontSize: 12
	}
});

export default CorrectionItem;