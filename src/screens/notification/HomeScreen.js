import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, RefreshControl } from 'react-native';
import {
	Header,
	BlankContent,
	Loading,
	LoadingError,
	LoadingMore,
	ContentEnd,
	Iconfont,
	Screen,
	Avatar
} from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Methods } from '../../helpers';

import { connect } from 'react-redux';

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true
		};
	}

	render() {
		let { navigation } = this.props;
		return (
			<Screen>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						paddingHorizontal: 15,
						paddingVertical: 10,
						alignItems: 'center'
					}}
					onPress={() => {
						navigation.navigate('系统通知');
					}}
				>
					<Avatar uri={'http://cos.datizhuanqian.cn/storage/app/avatars/avatar.png'} size={48} />
					<View
						style={{
							marginLeft: 10,
							borderBottomWidth: 0.5,
							borderBottomColor: Colors.lightBorder,
							paddingVertical: 20,
							flex: 1,
							flexDirection: 'row'
						}}
					>
						<Text style={{ fontSize: 15, color: Colors.balck }}>系统通知</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						paddingHorizontal: 15,
						paddingVertical: 10,
						alignItems: 'center'
					}}
					onPress={() => {
						navigation.navigate('评论');
					}}
				>
					<Avatar uri={'http://cos.datizhuanqian.cn/storage/app/avatars/avatar.png'} size={48} />
					<View
						style={{
							marginLeft: 10,
							borderBottomWidth: 0.5,
							borderBottomColor: Colors.lightBorder,
							paddingVertical: 20,
							flex: 1,
							flexDirection: 'row'
						}}
					>
						<Text style={{ fontSize: 15, color: Colors.balck }}>评论</Text>
					</View>
				</TouchableOpacity>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightBorder
	}
});

export default connect(store => {
	return { user: store.users.user };
})(HomeScreen);
