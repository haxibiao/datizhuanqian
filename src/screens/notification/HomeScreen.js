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
	DivisionLine,
	RedDot
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
			fetchingMore: true,
			logo: require('../../../assets/images/logo.png')
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
					<Avatar isLocal={this.state.logo} size={48} />
					<View style={styles.itemRight}>
						<Text style={styles.name}>系统通知</Text>
						<Query query={userUnreadQuery} variables={{ id: user.id }}>
							{({ data, error }) => {
								if (error) return null;
								if (!(data && data.user)) return null;
								if (
									data.user.unread_notifications_count - data.user.unread_comment_notifications_count
								) {
									return (
										<RedDot
											count={
												data.user.unread_notifications_count -
												data.user.unread_comment_notifications_count
											}
										/>
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
						navigation.navigate('评论通知');
					}}
				>
					<View style={styles.icon}>
						<Iconfont name={'notification'} size={23} color={Colors.white} />
					</View>
					<View style={styles.itemRight}>
						<Text style={styles.name}>评论</Text>
						<Query query={userUnreadQuery} variables={{ id: user.id }}>
							{({ data, error }) => {
								if (error) return null;
								if (!(data && data.user)) return null;
								if (data.user.unread_comment_notifications_count) {
									return <RedDot count={data.user.unread_comment_notifications_count} />;
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
	name: {
		fontSize: 16,
		color: Colors.black
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
	icon: {
		backgroundColor: Colors.weixin,
		padding: 12,
		borderRadius: 30
	}
});

export default connect(store => {
	return { user: store.users.user };
})(HomeScreen);
