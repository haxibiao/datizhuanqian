import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Toast from 'react-native-root-toast';

import { DivisionLine, Avatar, Header, ModifyNameModal, SettingItem, Screen } from '../../../components';

import { Colors, Config } from '../../../constants';
import { Methods } from '../../../helpers';

import { connect } from 'react-redux';
import actions from '../../../store/actions';
import { updateUserNameMutation, updateUserAvatarMutation, UserQuery } from '../../../graphql/user.graphql';
import { Mutation, compose, graphql } from 'react-apollo';

import ImagePicker from 'react-native-image-crop-picker';

class EditProfileScreen extends Component {
	constructor(props) {
		super(props);
		this.toggleModalVisible = this.toggleModalVisible.bind(this);
		this.state = {
			modalVisible: false,
			nickname: ''
		};
	}

	//修改头像
	changeAvatar() {
		let { user } = this.props;
		ImagePicker.openPicker({
			width: 400,
			height: 400,
			cropping: true,
			includeBase64: true
		})
			.then(async image => {
				let result = {};
				try {
					result = await this.props.updateUserAvatarMutation({
						variables: {
							avatar: `data:${image.mime};base64,${image.data}`
						},
						refetchQueries: updateUserAvatarMutation => [
							{
								query: UserQuery,
								variables: { id: user.id }
							}
						]
					});
				} catch (ex) {
					result.errors = ex;
				}
				if (result && result.errors) {
					Methods.toast('上传头像失败，请检查您的网络');
				} else {
					const { avatar } = result.data.updateUserAvatar;
					this.props.dispatch(actions.updateAvatar(avatar + '?t=' + Date.now()));
				}
			})
			.catch(error => {});
	}

	//修改昵称
	async changeName() {
		let result = {};
		let { nickname } = this.state;
		const { navigation, user } = this.props;
		console.log('nickname', nickname);
		if (!nickname) {
			this.toggleModalVisible();
			return;
		}

		try {
			result = await this.props.updateUserNameMutation({
				variables: {
					name: nickname
				},
				refetchQueries: updateUserName => [
					{
						query: UserQuery,
						variables: { id: user.id }
					}
				]
			});
		} catch (ex) {
			result.errors = ex;
		}
		if (result && result.errors) {
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Methods.toast(str, -180); //Toast错误信息
		} else {
			this.toggleModalVisible();
			this.props.dispatch(actions.updateName(nickname));
			Methods.toast('修改成功', -180);
		}
	}

	toggleModalVisible() {
		this.setState(prevState => ({
			modalVisible: !prevState.modalVisible
		}));
	}

	render() {
		const { navigation, user } = this.props;
		const { pay_info_change_count } = navigation.state.params.user;
		let { modalVisible, nickname } = this.state;
		return (
			<Screen customStyle={{ borderBottomColor: 'transparent' }}>
				<View style={styles.container}>
					<ScrollView style={styles.container} bounces={false} removeClippedSubviews={true}>
						<DivisionLine height={10} />
						<SettingItem
							rightComponent={<Avatar uri={user.avatar + '?t=' + Date.now()} size={42} />}
							customStyle={{ height: 80 }}
							itemName={'头像'}
							handler={this.changeAvatar.bind(this)}
						/>

						<SettingItem
							itemName="设置昵称"
							rightSize={15}
							rightContent={user.name}
							handler={this.toggleModalVisible}
						/>
						<SettingItem itemName="账号信息" rightSize={15} rightContent={user.account} />
						<SettingItem
							itemName="支付宝账号"
							rightSize={15}
							rightContent={
								user.pay_account ? user.pay_account + '(' + user.real_name + ')' : '绑定支付宝'
							}
							disabled={pay_info_change_count == -1 ? true : false}
							handler={() => navigation.navigate('我的账户')}
						/>
						<SettingItem
							itemName="重置密码"
							rightSize={15}
							handler={() => {
								navigation.navigate('重置密码');
							}}
						/>
					</ScrollView>
					<Mutation mutation={updateUserNameMutation}>
						{updateUserName => {
							return (
								<ModifyNameModal
									modalName="修改昵称"
									placeholder={user.name}
									visible={modalVisible}
									value={nickname}
									handleVisible={this.toggleModalVisible}
									changeValue={val => {
										this.setState({
											nickname: val
										});
									}}
									submit={this.changeName.bind(this)}
								/>
							);
						}}
					</Mutation>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	}
});

export default connect(store => ({ user: store.users.user }))(
	compose(
		graphql(updateUserAvatarMutation, { name: 'updateUserAvatarMutation' }),
		graphql(updateUserNameMutation, { name: 'updateUserNameMutation' })
	)(EditProfileScreen)
);
