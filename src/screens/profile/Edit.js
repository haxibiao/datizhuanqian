'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Animated, Keyboard } from 'react-native';
import {
	PageContainer,
	TouchFeedback,
	Iconfont,
	Row,
	CustomTextInput,
	Avatar,
	ItemSeparator,
	WheelPicker
} from 'components';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, Api, Tools, ISIOS } from 'utils';
import { Query, compose, withApollo, graphql, Mutation, GQL } from 'apollo';
import { app, observer } from 'store';
import ImagePicker from 'react-native-image-crop-picker';

@observer
class index extends Component {
	constructor(props) {
		super(props);
		let user = props.navigation.getParam('user', {});
		console.log('edit user', user);
		this.user = user;
		this.name = user.name;
		this.introduction = user.profile.introduction;
		this.state = {
			submitting: false,
			avatar: user.avatar,
			gender: user.gender,
			age: user.profile.age,
			birthday: user.profile.birthday || ''
		};
	}

	componentDidMount() {
		if (!this.showListener) {
			let name = ISIOS ? 'keyboardWillShow' : 'keyboardDidShow';
			this.showListener = Keyboard.addListener(name, e => this.onKeyboardShow(e));
		}
		if (!this.hideListener) {
			let name = ISIOS ? 'keyboardWillHide' : 'keyboardDidHide';
			this.hideListener = Keyboard.addListener(name, () => this.onKeyboardHide());
		}
	}

	componentWillUnmount() {
		this.showListener.remove();
		this.hideListener.remove();
	}

	onKeyboardShow = event => {
		this.showTimer && clearTimeout(this.showTimer);
		this.showTimer = setTimeout(() => {
			this._ScrollView &&
				this._ScrollView.scrollTo({
					x: 0,
					y: event.endCoordinates.height,
					animated: true
				});
		}, 100);
	};

	onKeyboardHide = event => {
		this.hideTimer && clearTimeout(this.hideTimer);
		this.hideTimer = setTimeout(() => {
			this._ScrollView &&
				this._ScrollView.scrollTo({
					x: 0,
					y: 0,
					animated: true
				});
		}, 100);
	};

	showDatePicker = () => {
		let Picker = new WheelPicker({
			onPickerConfirm: this.onDatePickerConfirm
		});
		Picker._showDatePicker(this.parseBirthday());
	};

	onDatePickerConfirm = (value, index) => {
		console.log('onDatePickerConfirm', value.join(''));
		this.setState({
			age: this.calcAge(value[0]),
			birthday: value.join('')
		});
	};

	calcAge(value) {
		if (value && typeof parseInt(value) === 'number') {
			return new Date().getFullYear() - parseInt(value);
		}
	}

	parseBirthday() {
		let { birthday } = this.state;

		if (birthday !== undefined) {
			return birthday.replace(/[年月日]/gi, '-').split('-');
		}
	}

	changeAvatar = () => {
		ImagePicker.openPicker({
			width: 400,
			height: 400,
			cropping: true,
			includeBase64: true
		})
			.then(async image => {
				this.setState({
					avatar: `data:${image.mime};base64,${image.data}`
				});
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
					introduction: this.introduction,
					birthday: this.state.birthday,
					age: this.state.age
				}
			}
		});
	};

	promisesGenerator = () => {
		let promises = [];
		let { avatar, gender, birthday, age } = this.state;
		if (avatar !== this.user.avatar) {
			promises.push(this.updateAvatar());
		}
		if (this.name !== this.user.name) {
			promises.push(this.updateName());
		}
		if (
			gender !== this.user.gender ||
			this.introduction !== this.user.profile.introduction ||
			birthday !== this.user.profile.birthday
		) {
			promises.push(this.updateInfo());
		}
		return promises;
	};

	saveChange = () => {
		let promises = this.promisesGenerator();
		if (promises.length < 1) {
			Toast.show({
				content: '您还没有修改任何信息哦'
			});
			return;
		}
		this.setState({
			submitting: true
		});
		Promise.all(promises)
			.then(posts => {
				this.setState({
					submitting: false
				});
				let avatar = Tools.syncGetter('data.updateUserAvatar.avatar', posts[0]);
				if (avatar) {
					app.changeAvatar(avatar + '?t=' + Date.now());
				}
				this.props.navigation.goBack();
				Toast.show({
					content: '修改成功'
				});
			})
			.catch(err => {
				this.setState({
					submitting: false
				});
				let str = err.toString().replace(/Error: GraphQL error: /, '');
				console.log('strstrstr', str);
				Toast.show({
					content: '修改失败'
				});
			});
	};

	render() {
		let { submitting, avatar, gender, age } = this.state;
		return (
			<PageContainer
				submitting={submitting}
				title="编辑资料"
				white
				rightView={
					<TouchFeedback style={styles.saveButton} onPress={this.saveChange}>
						<Text style={styles.saveText}> 保存修改 </Text>
					</TouchFeedback>
				}
			>
				<ScrollView ref={ref => (this._ScrollView = ref)} style={styles.container}>
					<View style={styles.avatarItem}>
						<TouchFeedback onPress={this.changeAvatar}>
							<Avatar source={avatar} size={PxFit(76)} />
						</TouchFeedback>
						<Text style={styles.avatarTip}> 点击上传头像 </Text>
					</View>
					<ItemSeparator />
					<View
						style={[
							styles.fieldGroup,
							{
								marginTop: PxFit(30)
							}
						]}
					>
						<Text style={styles.field}> 昵称: </Text>
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
						<Text style={styles.field}> 签名: </Text>
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
						<Text style={styles.field}> 性别: </Text>
						<Row
							style={{
								marginLeft: PxFit(30)
							}}
						>
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
					<Row style={styles.fieldGroup}>
						<Text style={styles.field}> 年龄: </Text>
						<TouchFeedback onPress={this.showDatePicker} style={styles.ageItem}>
							<Text
								style={{
									flex: 1,
									fontSize: PxFit(15),
									color: age ? Theme.defaultTextColor : Theme.subTextColor
								}}
							>
								{age || '请选择日期'}
							</Text>
							<Iconfont name="right" color={Theme.subTextColor} size={PxFit(16)} />
						</TouchFeedback>
					</Row>
					{/*	<Row style={styles.item}>
						<Text style={styles.field}>手机号 </Text>
						<TouchFeedback style={styles.accountItem}>
							<Text style={styles.accontText}>未设置</Text>
							<Iconfont name="right" color={Theme.subTextColor} size={PxFit(16)} />
						</TouchFeedback>
					</Row>
					<Row style={styles.item}>
						<Text style={styles.field}>支付宝 </Text>
						<TouchFeedback style={styles.accountItem}>
							<Text style={styles.accontText}>未绑定</Text>
							<Iconfont name="right" color={Theme.subTextColor} size={PxFit(16)} />
						</TouchFeedback>
					</Row>
					<Row style={styles.item}>
						<Text style={styles.field}>微信 </Text>
						<TouchFeedback style={styles.accountItem}>
							<Text style={styles.accontText}>未绑定</Text>
							<Iconfont name="right" color={Theme.subTextColor} size={PxFit(16)} />
						</TouchFeedback>
					</Row>
					<Row style={styles.item}>
						<Text style={styles.field}>密码 </Text>
						<TouchFeedback style={styles.accountItem}>
							<Text style={styles.accontText}>未设置</Text>
							<Iconfont name="right" color={Theme.subTextColor} size={PxFit(16)} />
						</TouchFeedback>
					</Row>*/}
				</ScrollView>
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
	saveText: {
		fontSize: PxFit(15),
		textAlign: 'center',
		color: Theme.secondaryColor
	},
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
	item: {
		marginBottom: PxFit(30),
		paddingHorizontal: Theme.itemSpace,
		justifyContent: 'space-between'
	},
	accountItem: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	accontText: {
		fontSize: PxFit(13),
		color: Theme.theme
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
		marginTop: PxFit(10),
		paddingBottom: PxFit(10)
	},
	genderGroup: {
		flexDirection: 'row',
		alignItems: 'center',
		width: PxFit(100)
	},
	genderItem: {
		width: PxFit(20),
		height: PxFit(20),
		marginRight: PxFit(8)
	},
	ageItem: {
		flex: 1,
		marginLeft: PxFit(30),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});

export default compose(
	withApollo,
	graphql(GQL.updateUserAvatarMutation, {
		name: 'updateUserAvatarMutation'
	}),
	graphql(GQL.updateUserNameMutation, {
		name: 'updateUserNameMutation'
	}),
	graphql(GQL.setUserInfoMutation, {
		name: 'setUserInfoMutation'
	})
)(index);
