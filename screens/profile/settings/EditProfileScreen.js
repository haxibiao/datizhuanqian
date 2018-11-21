import React, { Component } from "react";
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import Toast from "react-native-root-toast";

import Screen from "../../Screen";
import SettingItem from "./SettingItem";

import { Header } from "../../../components/Header";
import { DivisionLine, Avatar } from "../../../components/Universal";
import { ModifyNameModal } from "../../../components/Modal";
import { Iconfont } from "../../../utils/Fonts";

import Colors from "../../../constants/Colors";
import Config from "../../../constants/Config";

import { connect } from "react-redux";
import actions from "../../../store/actions";

class EditProfileScreen extends Component {
	constructor(props) {
		super(props);
		this.toggleModalVisible = this.toggleModalVisible.bind(this);
		this.nickname = "";
		this.state = {
			modalVisible: false
		};
	}

	render() {
		let { navigation } = this.props;
		let { user } = this.props.users;
		const { modalVisible } = this.state;
		return (
			<Screen customStyle={{ borderBottomColor: "transparent" }}>
				<View style={styles.container}>
					<ScrollView style={styles.container} bounces={false} removeClippedSubviews={true}>
						<DivisionLine height={10} />
						<TouchableOpacity
							style={{
								paddingHorizontal: 15,
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								height: 80,
								borderBottomWidth: 1,
								borderBottomColor: Colors.lightBorder
							}}
						>
							<Text>头像</Text>
							<Avatar uri={user.avatar} size={42} />
						</TouchableOpacity>
						<TouchableOpacity onPress={this.toggleModalVisible}>
							<SettingItem itemName="设置昵称" rightSize={15} rightContent={user.name} />
						</TouchableOpacity>
						<TouchableOpacity>
							<SettingItem itemName="我的账户" rightSize={15} rightContent={user.aliplay} />
						</TouchableOpacity>
					</ScrollView>
					<ModifyNameModal
						modalName="修改昵称"
						placeholder={user.name}
						visible={modalVisible}
						value={this.nickname}
						handleVisible={this.toggleModalVisible}
						changeVaule={val => {
							this.nickname = val;
						}}
						submit={() => {
							if (this.nickname.length < 1) {
								this.toggleModalVisible();
								return;
							}
							this.toggleModalVisible();
							updateUserName({
								variables: {
									name: this.nickname
								}
							});
							this.props.dispatch(actions.updateName(this.nickname));
						}}
					/>
				</View>
			</Screen>
		);
	}
	toggleModalVisible() {
		this.setState(prevState => ({
			modalVisible: !prevState.modalVisible
		}));
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	}
});

export default connect(store => ({ users: store.users }))(EditProfileScreen);
