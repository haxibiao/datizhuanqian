import React, { Component } from "react";
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback } from "react-native";
import { Iconfont } from "../../utils/Fonts";
import { Colors, Config } from "../../constants";
// import Avatar from "../../components/Pure/Avatar";

class UserTopInfo extends Component {
	render() {
		let { user, login } = this.props;
		return (
			<TouchableWithoutFeedback
				onPress={() => {
					let { navigation, login, user } = this.props;
					login ? navigation.navigate("个人信息") : navigation.navigate("登录注册", { login: true });
				}}
			>
				<View style={styles.userInfoContainer}>
					<View style={styles.userInfo}>
						<View style={{ flex: 1 }}>
							<View style={styles.userInfo}>
								{login ? (
									<View
										style={{
											height: 50,
											flex: 1,
											justifyContent: "space-between"
										}}
									>
										<Text style={styles.userName}>{user.name}</Text>
									</View>
								) : (
									<Text style={[styles.userName, { paddingLeft: 50 }]}>
										立即加入
										{Config.AppDisplayName}~
									</Text>
								)}
							</View>
						</View>
						<View style={{}}>
							{login ? (
								<Avatar uri={user.avatar} size={68} />
							) : (
								<View style={styles.defaultAvatar}>
									<Iconfont name={"my"} size={44} color={Colors.lightFontColor} />
								</View>
							)}
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	userInfoContainer: {
		height: 90,
		backgroundColor: Colors.skinColor,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
		borderBottomColor: Colors.lightBorderColor,
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
		flexDirection: "row",
		alignItems: "center"
	},
	userName: {
		fontSize: 18,
		fontWeight: "300",
		color: Colors.darkFontColor
	}
});

export default UserTopInfo;
