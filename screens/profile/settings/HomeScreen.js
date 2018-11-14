import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Dimensions } from "react-native";

import Screen from "../../Screen";
import Config from "../../../constants/Config";
import Colors from "../../../constants/Colors";
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
		this.handleFontModalVisible = this.handleFontModalVisible.bind(this);
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
		const { login } = users;
		return (
			<Screen customStyle={{ borderBottomColor: "transparent" }}>
				<View style={styles.container}>
					<DivisionLine height={10} />
					<ScrollView style={styles.container} bounces={false} removeClippedSubviews={true}>
						<TouchableOpacity onPress={() => this.navigateMiddlewear("账号与安全")}>
							<SettingItem itemName="账号与安全" endItem />
						</TouchableOpacity>
						<DivisionLine height={10} />
						<TouchableOpacity onPress={() => navigation.navigate("推送")}>
							<SettingItem itemName="推送" />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => navigation.navigate("常见问题")}>
							<SettingItem itemName="常见问题" endItem />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => navigation.navigate("关于答题赚钱")}>
							<SettingItem itemName="关于答题赚钱" endItem />
						</TouchableOpacity>
						<DivisionLine height={10} />
						<TouchableOpacity
							onPress={() => {
								if (storageSize.length > 0) {
									this.setState({ dialog: "确认清除缓存内容吗？" });
									this.handlePromotModalVisible();
								}
							}}
						>
							<SettingItem rightSize={15} itemName="清除缓存" rightContent={storageSize} />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								codePush.sync({
									updateDialog: true,
									installMode: codePush.InstallMode.IMMEDIATE
								});
							}}
						>
							<SettingItem itemName="版本更新" explain={"当前版本: " + Config.AppVersion} endItem />
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

	handleFontModalVisible() {
		this.setState(prevState => ({
			fontModalVisible: !prevState.fontModalVisible
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
		this.setState({ dialog: "", storageSize: "" });
		this.handlePromotModalVisible();
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
	return { users: store.user };
})(HomeScreen);
