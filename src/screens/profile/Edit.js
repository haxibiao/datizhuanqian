/*
 * @flow
 * created by wyk made in 2019-03-21 15:24:20
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Switch } from 'react-native';
import {
	PageContainer,
	TouchFeedback,
	Iconfont,
	Row,
	PopOverlay,
	CustomTextInput,
	Avatar,
	ImagePickerViewer,
	ItemSeparator
} from '../../components';
import actions from '../../store/actions';
import { Theme, PxFit, SCREEN_WIDTH, Api, Tools } from '../../utils';
import { connect } from 'react-redux';
import { Query, compose, withApollo, graphql, Mutation } from 'react-apollo';
import {
	updateUserAvatarMutation,
	updateUserNameMutation,
	setUserInfoMutation,
	UserQuery
} from '../../assets/graphql/user.graphql';

import ImagePicker from 'react-native-image-crop-picker';

class index extends Component {
	constructor(props) {
		super(props);
		let user = props.navigation.getParam('user', {});
		this.user = user;
		this.name = user.name;
		this.introduction = user.introduction;
		this.state = {
			submitting: false,
			avatar: user.avatar,
			gender: user.gender
		};
	}

	changeAvatar = () => {
		ImagePicker.openPicker({
			width: 400,
			height: 400,
			cropping: true,
			includeBase64: true
		})
			.then(async image => {
				this.setState({ avatar: `data:${image.mime};base64,${image.data}` });
			})
			.catch(error => {});
	};

	changeName = value => {
		this.name = value;
	};

	changeIntroduction = value => {
		this.introduction = value;
	};

	updateAvatar = () => {
		return this.props.updateUserAvatarMutation({
			variables: {
				avatar: this.state.avatar
			}
		});
	};

	updateName = () => {
		return this.props.updateUserNameMutation({
			variables: {
				name: this.name
			}
		});
	};

	updateInfo = () => {
		return this.props.setUserInfoMutation({
			variables: {
				data: {
					gender: this.state.gender,
					introduction: this.introduction
				}
			}
		});
	};

	promisesGenerator = () => {
		let promises = [];
		let { avatar, gender } = this.state;
		let { avatar: old_avatar, gender: old_gender, name: old_name, introduction: old_introduction } = this.user;
		if (avatar !== old_avatar) {
			promises.push(this.updateAvatar());
		}
		if (this.name !== old_name) {
			promises.push(this.updateName());
		}
		if (gender !== old_gender || this.introduction !== old_introduction) {
			promises.push(this.updateInfo());
		}
		return promises;
	};

	saveChange = () => {
		let promises = this.promisesGenerator();
		if (promises.length < 1) {
			Toast.show({ content: '您还没有修改任何信息哦' });
			return;
		}
		this.setState({ submitting: true });
		Promise.all(promises)
			.then(posts => {
				this.setState({ submitting: false });
				let avatar = Tools.syncGetter('data.updateUserAvatar.avatar', posts[0]);
				if (avatar) {
					console.log('avatar', avatar);
					this.props.dispatch(actions.updateAvatar(avatar + '?t=' + Date.now()));
				}
				this.props.navigation.goBack();
				Toast.show({ content: '修改成功' });
			})
			.catch(err => {
				this.setState({ submitting: false });
				let str = err.toString().replace(/Error: GraphQL error: /, '');
				Toast.show({ content: '修改失败' });
			});
	};

	render() {
		let { submitting, avatar, gender } = this.state;
		return (
			<PageContainer
				submitting={submitting}
				title="编辑资料"
				white
				rightView={
					<TouchFeedback style={styles.saveButton} onPress={this.saveChange}>
						<Text style={styles.saveText}>保存修改</Text>
					</TouchFeedback>
				}
			>
				<View style={styles.container}>
					<View style={styles.avatarItem}>
						<TouchableOpacity onPress={this.changeAvatar}>
							<Avatar source={avatar} size={PxFit(76)} />
						</TouchableOpacity>
						<Text style={styles.avatarTip}>点击上传头像</Text>
					</View>
					<ItemSeparator />
					<View style={[styles.fieldGroup, { marginTop: PxFit(30) }]}>
						<Text style={styles.field}>昵称:</Text>
						<View style={styles.inputWrap}>
							<CustomTextInput
								placeholderTextColor={Theme.subTextColor}
								autoCorrect={false}
								placeholder="8个字以内"
								defaultValue={this.name}
								maxLength={8}
								style={styles.inputStyle}
								onChangeText={this.changeName}
							/>
						</View>
					</View>
					<View style={styles.fieldGroup}>
						<Text style={styles.field}>签名:</Text>
						<View style={styles.inputWrap}>
							<CustomTextInput
								placeholderTextColor={Theme.subTextColor}
								autoCorrect={false}
								placeholder="20字以内"
								defaultValue={this.introduction}
								maxLength={20}
								style={styles.inputStyle}
								onChangeText={this.changeIntroduction}
							/>
						</View>
					</View>
					<Row style={styles.fieldGroup}>
						<Text style={styles.field}>性别:</Text>
						<Row style={{ marginLeft: PxFit(30) }}>
							<TouchFeedback
								onPress={() =>
									this.setState({
										gender: 1
									})
								}
								style={styles.genderGroup}
							>
								<Image
									source={
										gender === 1
											? require('../../assets/images/radio_fill.png')
											: require('../../assets/images/radio.png')
									}
									style={styles.genderItem}
								/>
								<Text
									style={{
										fontSize: PxFit(15),
										color: gender === 1 ? Theme.defaultTextColor : Theme.subTextColor
									}}
								>
									女
								</Text>
							</TouchFeedback>
							<TouchFeedback
								onPress={() =>
									this.setState({
										gender: 0
									})
								}
								style={styles.genderGroup}
							>
								<Image
									source={
										gender === 0
											? require('../../assets/images/radio_fill.png')
											: require('../../assets/images/radio.png')
									}
									style={styles.genderItem}
								/>
								<Text
									style={{
										fontSize: PxFit(15),
										color: gender === 0 ? Theme.defaultTextColor : Theme.subTextColor
									}}
								>
									男
								</Text>
							</TouchFeedback>
						</Row>
					</Row>
				</View>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	saveButton: {
		flex: 1,
		justifyContent: 'center'
	},
	saveText: { fontSize: PxFit(15), textAlign: 'center', color: Theme.secondaryColor },
	avatarItem: {
		marginTop: PxFit(50),
		alignItems: 'center'
	},
	avatarTip: {
		marginVertical: PxFit(15),
		fontSize: PxFit(13),
		color: Theme.subTextColor
	},
	fieldGroup: {
		marginBottom: PxFit(30),
		paddingHorizontal: Theme.itemSpace
	},
	field: {
		fontSize: PxFit(14),
		color: '#666'
	},
	inputWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor
	},
	inputStyle: {
		flex: 1,
		fontSize: PxFit(15),
		color: Theme.defaultTextColor,
		paddingVertical: PxFit(10),
		marginTop: PxFit(6)
	},
	genderGroup: {
		flexDirection: 'row',
		alignItems: 'center',
		width: PxFit(100)
	},
	genderItem: { width: PxFit(20), height: PxFit(20), marginRight: PxFit(8) }
});

export default compose(
	withApollo,
	graphql(updateUserAvatarMutation, { name: 'updateUserAvatarMutation' }),
	graphql(updateUserNameMutation, { name: 'updateUserNameMutation' }),
	graphql(setUserInfoMutation, { name: 'setUserInfoMutation' }),
	connect(store => ({ owner: store.users.user }))
)(index);
