import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import { Colors, Config, Divice } from '../../constants';
import { Avatar, DivisionLine, Iconfont } from '../../components';

import { Storage, ItemKeys } from '../../store/localStorage';

class UserSeetingPageCache extends Component {
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
		let { navigation, login } = this.props;
		let { userCache } = this.state;
		if (!userCache) return null;
		return (
			<View>
				<TouchableOpacity
					style={styles.container}
					onPress={() => navigation.navigate('编辑个人资料', { user: userCache })}
				>
					<View style={styles.left}>
						<Avatar
							uri={userCache.avatar}
							size={52}
							borderStyle={{ borderWidth: 1, borderColor: '#ffffff' }}
						/>
						<View style={styles.content}>
							<Text style={{ color: Colors.black, fontSize: 15 }}>{userCache && userCache.name}</Text>
							<Text style={styles.user}>
								LV.{userCache.level && userCache.level.level} {'  '}
								{userCache.level.name} {'  '}
								{userCache.exp}/{userCache.next_level_exp}
							</Text>
						</View>
					</View>
					<Iconfont name={'right'} />
				</TouchableOpacity>
				<DivisionLine height={10} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 80,
		paddingHorizontal: 15
	},
	left: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	content: {
		height: 34,
		justifyContent: 'space-between',
		marginLeft: 15
	},
	user: {
		fontSize: 12,
		color: Colors.grey,
		fontWeight: '300',
		paddingTop: 3
	}
});
export default UserSeetingPageCache;
