import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Avatar from '../Universal/Avatar';
import { Colors, Config, Divice } from '../../constants';

import { Storage, ItemKeys } from '../../store/localStorage';

class UserCache extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userCache: ''
		};
	}

	async componentWillMount() {
		this.setState({
			userCache: await Storage.getItem(ItemKeys.userCache)
		});
	}

	render() {
		const { navigation, refetch } = this.props;
		let { userCache } = this.state;
		if (!userCache) return null;
		return (
			<TouchableOpacity
				style={styles.userInfoContainer}
				onPress={() => navigation.navigate('编辑个人资料', { user: userCache })}
				activeOpacity={1}
			>
				<View style={styles.userInfo}>
					<View style={{ flexDirection: 'row', marginLeft: 30 }}>
						<View>
							<Avatar
								uri={userCache.avatar}
								size={68}
								borderStyle={{
									borderWidth: 1,
									borderColor: Colors.white
								}}
							/>
						</View>
						<View style={{ marginLeft: 20 }}>
							<View style={styles.headerInfo}>
								<Text style={styles.userName}>{userCache.name}</Text>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center'
									}}
								>
									<Text style={styles.level}>LV.{userCache.level && userCache.level.level}</Text>
									<View style={styles.progress} />
									<View
										style={{
											height: 10,
											width: (userCache.exp * 150) / userCache.next_level_exp,
											backgroundColor: Colors.orange,
											borderRadius: 5,
											marginLeft: 10,
											marginLeft: -150
										}}
									/>
								</View>
							</View>
						</View>
					</View>
					<View style={styles.footer}>
						<View style={styles.ticket}>
							<Text style={{ color: Colors.orange }}>精力点: {userCache.ticket}</Text>
						</View>
						<Text style={{ paddingLeft: 20, color: Colors.orange }}>智慧点: {userCache.gold}</Text>
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
	progress: {
		height: 10,
		width: 150,
		backgroundColor: '#ffffff',
		borderRadius: 5,
		marginLeft: 10
		// borderWidth: 1,
		// borderColor: "#FE9900"
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

export default UserCache;
