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
import { updateUserNameMutation } from "../../../graphql/user.graphql";
import { Mutation } from "react-apollo";

class EditProfileScreen extends Component {
	constructor(props) {
		super(props);
		this.toggleModalVisible = this.toggleModalVisible.bind(this);
		this.state = {
			modalVisible: false,
			nickname: ""
		};
	}

	render() {
		let { navigation } = this.props;
		let { user } = this.props.users;
		const { modalVisible, nickname } = this.state;
		console.log("nickname", nickname);
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
							<Avatar
								uri={user.avatar ? user.avatar : "http://cos.qunyige.com/storage/avatar/13.jpg"}
								size={42}
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.toggleModalVisible}>
							<SettingItem itemName="设置昵称" rightSize={15} rightContent={user.name} />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => navigation.navigate("我的账户")}>
							<SettingItem
								itemName="我的账户"
								rightSize={15}
								rightContent={user.pay_account ? user.real_name + user.pay_account : "绑定支付宝"}
							/>
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
											}
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
