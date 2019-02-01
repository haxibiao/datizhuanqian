import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';

import { TabTop, BlankContent, Header, Screen, DivisionLine, Iconfont } from '../../components';
import { Colors, Config, Divice } from '../../constants';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { Query, Mutation } from 'react-apollo';

class TaskFailScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { navigation, user } = this.props;
		const { task_id } = navigation.state.params;
		return (
			<ScrollView style={styles.container}>
				<DivisionLine height={5} />
				<Header
					headerRight={
						<TouchableOpacity
							onPress={() => {
								navigation.navigate('提交任务', {
									again: true,
									task_id: task_id
								});
							}}
						>
							<Text style={{ fontSize: 15, color: Colors.black }}>继续提交</Text>
						</TouchableOpacity>
					}
				/>

				<View style={{ height: 150 }}>
					<View style={styles.header}>
						<View style={styles.headerLeft} />
						<Text style={{ color: Colors.themeRed, fontSize: 18 }}>失败原因</Text>
					</View>
					<View style={{ marginLeft: 25, marginTop: 20 }}>
						<Text style={{ fontSize: 16, color: Colors.black }}>未按要求上传图片</Text>
					</View>
				</View>
				<View style={{}}>
					<View style={styles.header}>
						<View style={styles.headerLeft} />
						<Text style={styles.headerContent}>提交内容</Text>
					</View>
					<View style={{ marginHorizontal: 25 }}>
						<Text style={{ fontSize: 16, color: Colors.black }}>小米评论</Text>
						<View style={{ marginTop: 10 }}>
							<Image
								source={{ uri: 'http://staging.datizhuanqian.cn/storage/images/5c513f60d996c.png' }}
								style={{ width: Divice.width - 50, height: Divice.width - 50 }}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFEFC'
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 20,
		paddingBottom: 10
	},
	headerLeft: {
		height: 22,
		width: 10,
		backgroundColor: Colors.theme,
		marginRight: 15
	},
	headerContent: {
		color: Colors.primaryFont,
		fontSize: 18
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(TaskFailScreen);
