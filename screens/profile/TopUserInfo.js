import React, { Component } from "react";
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback } from "react-native";
import { Iconfont } from "../../utils/Fonts";
import { Colors, Config } from "../../constants";
import { Avatar } from "../../components/Universal";

class UserTopInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			level: 3,
			levelExp: 2000,
			exp: 1368
		};
	}
	render() {
		let { user, login } = this.props;
		const { exp, level, levelExp } = this.state;
		return (
			<TouchableWithoutFeedback
				onPress={() => {
					let { navigation, login, user } = this.props;
					login ? navigation.navigate("个人信息") : navigation.navigate("登录注册", { login: true });
				}}
			>
				<View style={styles.userInfoContainer}>
					<View style={styles.userInfo}>
						<View style={{ flexDirection: "row", marginLeft: 30 }}>
							<View style={{}}>
								{login ? (
									<Avatar
										uri={user.avatar ? user.avatar : "http://cos.qunyige.com/storage/avatar/13.jpg"}
										size={68}
										borderStyle={{
											borderWidth: 1,
											borderColor: Colors.white
										}}
									/>
								) : (
									<View style={styles.defaultAvatar}>
										<Iconfont name={"my"} size={44} color={Colors.lightFontColor} />
									</View>
								)}
							</View>
							<View style={{ marginLeft: 20 }}>
								{login ? (
									<View style={styles.headerInfo}>
										<Text style={styles.userName}>{user.name}</Text>
										<View
											style={{
												flexDirection: "row",
												alignItems: "center"
											}}
										>
											<Text style={styles.rank}>LV.{user.level.level}</Text>
											<View style={styles.progress} />
											<View
												style={{
													height: 10,
													width: (user.level.exp * 150) / levelExp,
													backgroundColor: Colors.orange,
													borderRadius: 5,
													marginLeft: 10,
													marginLeft: -150
												}}
											/>
										</View>
									</View>
								) : (
									<Text style={[styles.userName, { paddingLeft: 50 }]}>
										立即加入
										{Config.AppDisplayName}~
									</Text>
								)}
							</View>
						</View>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "center",
								paddingVertical: 20
							}}
						>
							<View
								style={{
									paddingRight: 20,
									borderRightWidth: 1,
									borderRightColor: "#CD6839"
								}}
							>
								<Text style={{ color: Colors.orange }}>精力点: {user.ticket ? user.ticket : "0"}</Text>
							</View>
							<Text style={{ paddingLeft: 20, color: Colors.orange }}>
								智慧点: {user.gold ? user.gold : "0"}
							</Text>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	userInfoContainer: {
		backgroundColor: Colors.theme,
		paddingHorizontal: 15,
		borderBottomColor: Colors.lightBorder,
		borderBottomWidth: 1
	},
	defaultAvatar: {
		width: 68,
		height: 68,
		borderRadius: 34,
		backgroundColor: Colors.tintGray,
		justifyContent: "center",
		alignItems: "center"
	},
	userInfo: {
		marginTop: 65
	},
	headerInfo: {
		marginTop: 10,
		height: 50,
		justifyContent: "space-between"
	},
	userName: {
		fontSize: 18,
		fontWeight: "500",
		color: Colors.darkFont
	},
	rank: {
		color: Colors.white,
		fontSize: 12
	},
	progress: {
		height: 10,
		width: 150,
		backgroundColor: "#ffffff",
		borderRadius: 5,
		marginLeft: 10
		// borderWidth: 1,
		// borderColor: "#FE9900"
	}
});

export default UserTopInfo;
