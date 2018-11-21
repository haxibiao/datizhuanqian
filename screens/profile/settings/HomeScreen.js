import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Dimensions } from "react-native";

import Screen from "../../Screen";
import { Colors, Methods, Config } from "../../../constants";
import { Iconfont } from "../../../utils/Fonts";

import { Header } from "../../../components/Header";
import { Avatar, DivisionLine } from "../../../components/Universal";
import SettingItem from "./SettingItem";

import { connect } from "react-redux";
import actions from "../../../store/actions";
import { Storage } from "../../../store/localStorage";

const { width, height } = Dimensions.get("window");

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.handlePromotModalVisible = this.handlePromotModalVisible.bind(this);
		this.state = {
			promotModalVisible: false,
			fontModalVisible: false,
			checkedWordSize: 1,
			dialog: "",
			storageSize: "15MB"
		};
	}

	render() {
		let { promotModalVisible, fontModalVisible, dialog, storageSize, wordSize, checkedWordSize } = this.state;
		const { navigation, users, client } = this.props;
		const { login, user } = users;
		return (
			<Screen customStyle={{ borderBottomColor: "transparent" }}>
				<View style={styles.container}>
					<DivisionLine height={10} />
					<ScrollView style={styles.container} bounces={false} removeClippedSubviews={true}>
						{login ? (
							<TouchableOpacity
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
									height: 80,
									paddingHorizontal: 15
								}}
								onPress={() => navigation.navigate("修改个人资料")}
							>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center"
									}}
								>
									<Avatar
										uri={user.avatar}
										size={52}
										borderStyle={{ borderWidth: 1, borderColor: "#ffffff" }}
									/>
									<View style={{ height: 34, justifyContent: "space-between", marginLeft: 15 }}>
										<Text style={{ color: Colors.black, fontSize: 15 }}>{user.name}</Text>
										<Text style={{ fontSize: 12, color: Colors.grey, fontWeight: "300" }}>
											LV.{user.level} {"  "}
											{user.exp}/2000
										</Text>
									</View>
								</View>
								<Iconfont name={"right"} />
							</TouchableOpacity>
						) : null}
						<DivisionLine height={10} />
						<TouchableOpacity onPress={() => navigation.navigate("关于答题赚钱")}>
							<SettingItem itemName="关于答题赚钱" />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => navigation.navigate("分享给好友")}>
							<SettingItem itemName="分享给好友" endItem />
						</TouchableOpacity>
						<DivisionLine height={10} />
						<TouchableOpacity
							onPress={() => {
								this.clearCache();
							}}
						>
							<SettingItem rightSize={15} itemName="清除缓存" rightContent={storageSize} />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								// codePush.sync({
								// 	updateDialog: true,
								// 	installMode: codePush.InstallMode.IMMEDIATE
								// });
								Methods.toast("已是最新版本", -200);
							}}
						>
							<SettingItem
								rightSize={15}
								itemName="检查更新"
								rightContent={"v" + Config.AppVersion}
								endItem
							/>
						</TouchableOpacity>
						<DivisionLine height={10} />
						{login && (
							<TouchableOpacity
								onPress={() => {
									this.setState({ dialog: "确定退出当前账号？" });
									this.handlePromotModalVisible();
								}}
								style={styles.loginOut}
							>
								<Text
									style={{
										fontSize: 17,
										color: Colors.theme
									}}
								>
									退出登录
								</Text>
							</TouchableOpacity>
						)}
						<DivisionLine height={15} />
					</ScrollView>
				</View>
			</Screen>
		);
	}

	handlePromotModalVisible() {
		this.setState(prevState => ({
			promotModalVisible: !prevState.promotModalVisible
		}));
	}

	navigateMiddlewear(routeName) {
		let { navigation, users } = this.props;
		if (users.login) {
			navigation.navigate(routeName);
		} else {
			navigation.navigate("登录注册", { login: true });
		}
	}

	clearCache = () => {
		this.setState({ storageSize: "0MB" });
		Methods.toast("清楚缓存成功", -200);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	settingItemContent: {
		fontSize: 17,
		color: Colors.tintFont
	},
	settingItemName: {
		fontSize: 17,
		color: Colors.primaryFont,
		paddingRight: 10,
		paddingBottom: 5
	},
	loginOut: {
		paddingHorizontal: 15,
		paddingVertical: 15,
		alignItems: "center"
	},
	fontSetting: {
		paddingVertical: 15,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	wordSize: {
		fontSize: 17,
		color: Colors.primaryFont
	},
	wordSizeModalFooter: {
		marginTop: 20,
		marginHorizontal: -20,
		borderTopWidth: 1,
		borderTopColor: Colors.lightBorder,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	fontOperation: {
		paddingVertical: 15,
		paddingHorizontal: 20
	}
});

export default connect(store => {
	return { users: store.users };
})(HomeScreen);
