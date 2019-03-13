import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { Avatar, LoadingError, BlankContent, UserProfileCache, ProfileNotLogin } from '../../../components';
import { Colors, Config } from '../../../constants';

import { connect } from 'react-redux';
import actions from '../../../store/actions';

import { UserQuery } from '../../../graphql/user.graphql';
import { Query, withApollo, compose, graphql } from 'react-apollo';

class UserTopInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.data && nextProps.data.user) {
			nextProps.dispatch(actions.userCache(nextProps.data.user));

			nextProps.navigation.addListener('didFocus', payload => {
				nextProps.data.refetch();
			});
		}
		//props更新时存入用户信息
	}

	componentDidMount() {}

	render() {
		const {
			data,
			navigation,
			data: { loading, error, user, refetch }
		} = this.props;

		if (error) return <UserProfileCache navigation={navigation} />;
		if (loading) return <ProfileNotLogin navigation={navigation} />;
		if (!(data && data.user)) return <ProfileNotLogin navigation={navigation} />;

		let avatar = user.avatar + '?t=' + Date.now();

		return (
			<TouchableOpacity
				style={styles.userInfoContainer}
				onPress={() => navigation.navigate('编辑个人资料', { user: user })}
				activeOpacity={1}
			>
				<View style={styles.userInfo}>
					<View style={{ flexDirection: 'row', marginLeft: 30, alignItems: 'center' }}>
						<Avatar
							uri={avatar}
							size={68}
							borderStyle={{
								borderWidth: 1,
								borderColor: Colors.white
							}}
						/>
						<View style={{ marginLeft: 20, flex: 1 }}>
							<View style={styles.headerInfo}>
								<Text style={styles.userName}>{user.name}</Text>
								<Text style={styles.userIntroduction} numberOfLines={1}>
									{user.introduction}
								</Text>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center'
									}}
								>
									<Text style={styles.level}>LV.{user.level.level}</Text>
									<View style={styles.backProgress} />
									<View
										style={[
											styles.progress,
											{
												width: (user.exp * 150) / user.next_level_exp
											}
										]}
									/>
								</View>
							</View>
						</View>
					</View>

					<View style={styles.footer}>
						<TouchableOpacity
							style={styles.ticket}
							onPress={() => {
								navigation.navigate('关注粉丝', { initialPage: 0 });
							}}
						>
							<Text style={{ color: Colors.orange }}>关注: {user.follow_users_count}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								navigation.navigate('关注粉丝', { initialPage: 1 });
							}}
						>
							<Text style={{ paddingLeft: 20, color: Colors.orange }}>粉丝: {user.followers_count}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	userInfoContainer: {
		backgroundColor: Colors.theme,
		paddingHorizontal: 15,
		borderBottomColor: Colors.lightBorder,
		borderBottomWidth: 1
	},

	userInfo: {
		marginTop: 65
	},
	headerInfo: {
		justifyContent: 'space-between'
	},
	userName: {
		fontSize: 18,
		fontWeight: '500',
		color: Colors.darkFont
	},
	userIntroduction: {
		fontSize: 14,
		color: Colors.primaryFont,
		marginVertical: 5
	},
	level: {
		color: Colors.white,
		fontSize: 12
	},
	backProgress: {
		height: 10,
		width: 150,
		backgroundColor: '#ffffff',
		borderRadius: 5,
		marginLeft: 10
		// borderWidth: 1,
		// borderColor: "#FE9900"
	},
	progress: {
		height: 10,
		backgroundColor: Colors.orange,
		borderRadius: 5,
		marginLeft: 10,
		marginLeft: -150
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		paddingVertical: 20
	},
	ticket: {
		paddingHorizontal: 20,
		borderRightWidth: 1,
		borderRightColor: '#CD6839'
	}
});

export default connect(store => {
	return { userInfo: store.users.user };
})(
	compose(
		graphql(UserQuery, {
			options: props => ({ variables: { id: props.userInfo.id } })
		})
	)(withApollo(UserTopInfo))
);
