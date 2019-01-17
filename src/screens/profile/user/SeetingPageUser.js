import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import { Colors, Config, Divice } from '../../../constants';
import { Iconfont } from '../../../utils/Fonts';
import { Avatar, DivisionLine } from '../../../components';

import { connect } from 'react-redux';
import actions from '../../../store/actions';
import { Storage, ItemKeys } from '../../../store/localStorage';

import { UserQuery } from '../../../graphql/user.graphql';
import { Query, ApolloClient, withApollo } from 'react-apollo';

import UserSettingCache from './UserSettingCache';

class SeetingPageUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userCache: ''
		};
	}

	render() {
		let { navigation, id } = this.props;
		return (
			<Query query={UserQuery} variables={{ id: id }}>
				{({ data, loading, error }) => {
					if (error) return <UserSettingCache navigation={navigation} />;
					if (!(data && data.user)) return null;
					let user = data.user;
					let avatar = user.avatar + '?t=' + Date.now();
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
								onPress={() => navigation.navigate('编辑个人资料', { user: user })}
							>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center'
									}}
								>
									<Avatar
										uri={avatar}
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
										<Text style={{ color: Colors.black, fontSize: 15 }}>{user.name}</Text>
										<Text
											style={{
												fontSize: 12,
												color: Colors.grey,
												fontWeight: '300',
												paddingTop: 3
											}}
										>
											LV.{user.level ? user.level.level : '1'} {'  '}
											{user.level.name} {'  '}
											{user.exp}/{user.next_level_exp}
										</Text>
									</View>
								</View>
								<Iconfont name={'right'} />
							</TouchableOpacity>
							<DivisionLine height={10} />
						</View>
					);
				}}
			</Query>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	}
});

export default SeetingPageUser;
