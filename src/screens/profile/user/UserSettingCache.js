import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import { Colors, Config, Divice } from '../../../constants';
import { Iconfont } from '../../../utils/Fonts';
import { Avatar, DivisionLine } from '../../../components/Universal';

import { connect } from 'react-redux';
import actions from '../../../store/actions';
import { Storage, ItemKeys } from '../../../store/localStorage';

class UserSeetingCache extends Component {
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
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						height: 80,
						paddingHorizontal: 15
					}}
					onPress={() => navigation.navigate('编辑个人资料', { user: userCache })}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<Avatar
							uri={userCache.avatar}
							size={52}
							borderStyle={{ borderWidth: 1, borderColor: '#ffffff' }}
						/>
						<View
							style={{
								height: 34,
								justifyContent: 'space-between',
								marginLeft: 15
							}}
						>
							<Text style={{ color: Colors.black, fontSize: 15 }}>{userCache && userCache.name}</Text>
							<Text
								style={{
									fontSize: 12,
									color: Colors.grey,
									fontWeight: '300',
									paddingTop: 3
								}}
							>
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
		flex: 1,
		backgroundColor: Colors.white
	}
});

export default UserSeetingCache;
