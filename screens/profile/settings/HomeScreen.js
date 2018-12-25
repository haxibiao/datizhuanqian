import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Dimensions, Linking } from "react-native";

import Screen from "../../Screen";
import { Colors, Methods, Config } from "../../../constants";
import { Iconfont } from "../../../utils/Fonts";

import { Header } from "../../../components/Header";
import { Avatar, DivisionLine } from "../../../components/Universal";
import { SignOutModal, CheckUpdateModal } from "../../../components/Modal";
import SettingItem from "./SettingItem";
import { NavigationActions } from "react-navigation";

import { UserQuery } from "../../../graphql/user.graphql";
import { Query, ApolloClient, withApollo } from "react-apollo";

import { connect } from "react-redux";
import actions from "../../../store/actions";
import { Storage } from "../../../store/localStorage";

const { width, height } = Dimensions.get("window");

const navigateAction = NavigationActions.navigate({
	routeName: "主页",
	params: { resetStore: () => this.props.client.resetStore() },
	action: NavigationActions.navigate({ routeName: "我的" })
});

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.handleSignOutVisible = this.handleSignOutVisible.bind(this);
		this.handlePromotModalVisible = this.handlePromotModalVisible.bind(this);
		this.state = {
			signOutModalVisible: false,
			promotModalVisible: false,
			fontModalVisible: false,
			checkedWordSize: 1,
			storageSize: "1MB"
		};
	}

	render() {
		let {
			promotModalVisible,
			signOutModalVisible,
			fontModalVisible,
			storageSize,
			wordSize,
			checkedWordSize
		} = this.state;
		const { navigation, users, client } = this.props;
		const { login } = users;
		console.log("login", login);
		const { id } = users.user;
		return (
			<Screen customStyle={{ borderBottomColor: "transparent" }}>
				<View style={styles.container}>
					<DivisionLine height={10} />
					<ScrollView style={styles.container} bounces={false} removeClippedSubviews={true}>
						{login ? (
							<Query query={UserQuery} variables={{ id: id }}>
								{({ data, loading, error }) => {
									if (error) return null;
									if (!(data && data.user)) return null;
									let user = data.user;
									let avatar = user.avatar + "?t=" + Date.now();
									return (
										<View>
											<TouchableOpacity
												style={{
													flexDirection: "row",
													alignItems: "center",
													justifyContent: "space-between",
													height: 80,
													paddingHorizontal: 15
												}}
												onPress={() => navigation.navigate("编辑个人资料")}
											>
												<View
													style={{
														flexDirection: "row",
														alignItems: "center"
													}}
												>
													<Avatar
														uri={avatar}
														size={52}
														borderStyle={{ borderWidth: 1, borderColor: "#ffffff" }}
													/>
													<View
														style={{
															height: 34,
															justifyContent: "space-between",
															marginLeft: 15
														}}
													>
														<Text style={{ color: Colors.black, fontSize: 15 }}>
															{user.name}
														</Text>
														<Text
															style={{
																fontSize: 12,
																color: Colors.grey,
																fontWeight: "300",
																paddingTop: 3
															}}
														>
															LV.{user.level ? user.level.level : "1"} {"  "}
															{user.level.name} {"  "}
															{user.exp}/{user.next_level_exp}
														</Text>
													</View>
												</View>
												<Iconfont name={"right"} />
											</TouchableOpacity>
											<DivisionLine height={10} />
										</View>
									);
								}}
							</Query>
						) : null}

						<TouchableOpacity onPress={() => navigation.navigate("关于答题赚钱")}>
							<SettingItem itemName="关于答题赚钱" />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => navigation.navigate("等级说明")}>
							<SettingItem itemName="等级说明" />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => navigation.navigate("用户协议")}>
							<SettingItem itemName="用户协议"/>
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

								let localVersion = Config.localVersion.split("");
								localVersion.splice(3, 1);
								let local = parseFloat(localVersion.join(""));

								let Version = "1.1.0";
								let onlineVersion = Version.split("");
								onlineVersion.splice(3, 1);
								let online = parseFloat(onlineVersion.join(""));

								if (local < online) {
									this.handlePromotModalVisible();
								} else {
									Methods.toast("已是最新版本", -200);
								}
							}}
						>
							{
								//初步先用简单的判断版本号大小  外链到官网的下载地址，手动下载更新
								//TODO:后期需要整合原生模块,在APP内部下载自动安装。
							}

							<SettingItem rightSize={15} itemName="检查更新" rightContent={Config.AppVersion} endItem />
						</TouchableOpacity>
						<DivisionLine height={10} />
						{login && (
							<View>
								<TouchableOpacity
									onPress={() => {
										this.handleSignOutVisible();
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
								<DivisionLine height={15} />
							</View>
						)}
					</ScrollView>
				</View>
				<SignOutModal
					visible={signOutModalVisible}
					handleVisible={this.handleSignOutVisible}
					confirm={() => {
						this.props.dispatch(actions.signOut());
						this.props.navigation.dispatch(navigateAction);
						this.handleSignOutVisible();
					}}
				/>
				<CheckUpdateModal
					visible={promotModalVisible}
					cancel={this.handlePromotModalVisible}
					confirm={() => {
						this.handlePromotModalVisible();
						this.openUrl("https://datizhuanqian.com/storage/apks/datizhuanqian.apk");
					}}
					tips={"发现新版本"}
				/>
			</Screen>
		);
	}

	handleSignOutVisible() {
		this.setState(prevState => ({
			signOutModalVisible: !prevState.signOutModalVisible
		}));
	}
	handlePromotModalVisible() {
		this.setState(prevState => ({
			promotModalVisible: !prevState.promotModalVisible
		}));
	}

	openUrl(url) {
		console.log("uri", url);
		Linking.openURL(url);
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
