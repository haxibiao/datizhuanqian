import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { Avatar, LoadingError, BlankContent, UserProfileCache, ProfileNotLogin } from '../../../components';
import { Colors, Config } from '../../../constants';

import { connect } from 'react-redux';
import actions from '../../../store/actions';

import { UserQuery } from '../../../graphql/user.graphql';
import { Query, withApollo } from 'react-apollo';

class UserTopInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		const { navigation } = this.props;

		this.didFocusSubscription = navigation.addListener('didFocus', payload => {
			let { users, client, dispatch, login, userInfo } = this.props;
			if (login) {
				client
					.query({
						query: UserQuery,
						variables: { id: userInfo.id }
					})
					.then(({ data }) => {
						this.props.dispatch(actions.userCache(data.user));
					})
					.catch(error => {});
			}
		});
	}

	render() {
		let { login, userInfo, navigation, userCache } = this.props;
		const { exp, level, levelExp } = this.state;

		return (
			<View>
				{login ? (
					<Query query={UserQuery} variables={{ id: userInfo.id }}>
						{({ data, loading, error, refetch }) => {
							if (error)
								return (
									<UserProfileCache
										navigation={navigation}
										refetch={() => {
											refetch();
										}}
									/>
								);
							if (!(data && data.user)) return <ProfileNotLogin navigation={navigation} />;
							let user = data.user;
							let avatar = user.avatar + '?t=' + Date.now();

							return (
								<TouchableOpacity
									style={styles.userInfoContainer}
									onPress={() => navigation.navigate('编辑个人资料', { user: user })}
									activeOpacity={1}
								>
									<View style={styles.userInfo}>
										<View style={{ flexDirection: 'row', marginLeft: 30 }}>
											<View style={{}}>
												<Avatar
													uri={avatar}
													size={68}
													borderStyle={{
														borderWidth: 1,
														borderColor: Colors.white
													}}
												/>
											</View>
											<View style={{ marginLeft: 20 }}>
												<View style={styles.headerInfo}>
													<Text style={styles.userName}>{user.name}</Text>
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
											<View style={styles.ticket}>
												<Text style={{ color: Colors.orange }}>
													精力点: {user.ticket ? user.ticket : '0'}
												</Text>
											</View>
											<Text style={{ paddingLeft: 20, color: Colors.orange }}>
												智慧点: {user.gold ? user.gold : '0'}
											</Text>
										</View>
									</View>
								</TouchableOpacity>
							);
						}}
					</Query>
				) : (
					<ProfileNotLogin navigation={navigation} />
				)}
			</View>
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
	defaultAvatar: {
		width: 68,
		height: 68,
		borderRadius: 34,
		backgroundColor: Colors.tintGray,
		justifyContent: 'center',
		alignItems: 'center'
	},
	userInfo: {
		marginTop: 65
	},
	headerInfo: {
		marginTop: 10,
		height: 50,
		justifyContent: 'space-between'
	},
	userName: {
		fontSize: 18,
		fontWeight: '500',
		color: Colors.darkFont
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
	return { userInfo: store.users.user, login: store.users.login };
})(withApollo(UserTopInfo));
