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
	Avatar,
	DivisionLine
} from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Methods } from '../../helpers';

import { connect } from 'react-redux';
import { userUnreadQuery } from '../../graphql/notification.graphql';
import { Query } from 'react-apollo';

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true
		};
	}

	render() {
		let { navigation, user } = this.props;
		return (
			<Screen>
				<DivisionLine height={5} />
				<TouchableOpacity
					style={styles.item}
					onPress={() => {
						navigation.navigate('系统通知');
					}}
				>
					<Avatar uri={'http://cos.datizhuanqian.cn/storage/app/avatars/avatar.png'} size={48} />
					<View style={styles.itemRight}>
						<Text style={{ fontSize: 15, color: Colors.black }}>答题赚钱</Text>
						<Query query={userUnreadQuery} variables={{ id: user.id }} fetchPolicy="network-only">
							{({ data, error }) => {
								if (error) return null;
								if (!(data && data.user)) return null;
								if (data.user.unread_withdraw_notifications_count) {
									return (
										<View style={styles.redDot}>
											<Text style={{ fontSize: 10, color: Colors.white }}>
												{data.user.unread_withdraw_notifications_count}
											</Text>
										</View>
									);
								} else {
									return <Iconfont name={'right'} size={16} />;
								}
							}}
						</Query>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.item}
					onPress={() => {
						navigation.navigate('评论');
					}}
				>
					<View style={{ backgroundColor: Colors.weixin, padding: 12, borderRadius: 30 }}>
						<Iconfont name={'notification'} size={23} color={Colors.white} />
					</View>
					<View style={styles.itemRight}>
						<Text style={{ fontSize: 15, color: Colors.black }}>评论</Text>
						<Query query={userUnreadQuery} variables={{ id: user.id }} fetchPolicy="network-only">
							{({ data, error }) => {
								if (error) return null;
								if (!(data && data.user)) return null;
								if (data.user.unread_comment_notifications_count) {
									return (
										<View style={styles.redDot}>
											<Text style={{ fontSize: 10, color: Colors.white }}>
												{data.user.unread_comment_notifications_count}
											</Text>
										</View>
									);
								} else {
									return <Iconfont name={'right'} size={16} />;
								}
							}}
						</Query>
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
	},
	itemRight: {
		marginLeft: 10,
		borderBottomWidth: 0.5,
		borderBottomColor: Colors.lightBorder,
		paddingVertical: 25,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	item: {
		flexDirection: 'row',
		paddingHorizontal: 15,
		alignItems: 'center'
	},
	redDot: {
		height: 16,
		borderRadius: 8,
		paddingHorizontal: 5,
		backgroundColor: Colors.themeRed,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default connect(store => {
	return { user: store.users.user };
})(HomeScreen);
