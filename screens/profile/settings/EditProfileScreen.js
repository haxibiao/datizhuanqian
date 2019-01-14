import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Toast from 'react-native-root-toast';

import Screen from '../../Screen';
import SettingItem from './SettingItem';

import { Header } from '../../../components/Header';
import { DivisionLine, Avatar } from '../../../components/Universal';
import { ModifyNameModal } from '../../../components/Modal';
import { Iconfont } from '../../../utils/Fonts';

import Colors from '../../../constants/Colors';
import Config from '../../../constants/Config';

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
			nickname: '',
			avatar: ''
		};
	}

	_changeAvatar() {
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
	toggleModalVisible() {
		this.setState(prevState => ({
			modalVisible: !prevState.modalVisible
		}));
	}

	render() {
		let { navigation } = this.props;
		let { user, noTicketTips } = this.props;
		const { modalVisible, nickname, avatar } = this.state;
		return (
			<Screen customStyle={{ borderBottomColor: 'transparent' }}>
				<View style={styles.container}>
					<ScrollView style={styles.container} bounces={false} removeClippedSubviews={true}>
						<DivisionLine height={10} />
						<TouchableOpacity
							style={{
								marginHorizontal: 15,
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								height: 80,
								borderBottomWidth: 1,
								borderBottomColor: Colors.lightBorder
							}}
							onPress={this._changeAvatar.bind(this)}
						>
							<Text>头像</Text>
							<Avatar uri={user.avatar ? user.avatar : avatar} size={42} />
						</TouchableOpacity>

						<TouchableOpacity onPress={this.toggleModalVisible}>
							<SettingItem itemName="设置昵称" rightSize={15} rightContent={user.name} />
						</TouchableOpacity>
						<TouchableOpacity>
							<SettingItem itemName="账号信息" rightSize={15} rightContent={user.account} />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => navigation.navigate('我的账户')}
							// disabled={user.pay_account ? true : false}
						>
							<SettingItem
								itemName="支付宝账号"
								rightSize={15}
								rightContent={
									user.pay_account ? user.pay_account + '(' + user.real_name + ')' : '绑定支付宝'
								}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => {
								navigation.navigate('重置密码');
							}}
						>
							<SettingItem itemName="重置密码" rightSize={15} />
						</TouchableOpacity>
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
									changeVaule={val => {
										this.setState({
											nickname: val
										});
									}}
									submit={() => {
										if (nickname.length < 1) {
											this.toggleModalVisible();
											return;
										}
										this.toggleModalVisible();
										updateUserName({
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
										this.props.dispatch(actions.updateName(nickname));
									}}
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
	compose(graphql(updateUserAvatarMutation, { name: 'updateUserAvatarMutation' }))(EditProfileScreen)
);
