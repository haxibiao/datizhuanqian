import React, { Component } from "react";
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback } from "react-native";
import { Iconfont } from "../../utils/Fonts";
import { Colors, Config } from "../../constants";
import Avatar from "../../components/Universal/Avatar";

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
						<View style={{}}>
							{login ? (
								<Avatar
									uri={user.avatar}
									size={68}
									borderStyle={{ borderWidth: 1, borderColor: "#ffffff" }}
								/>
							) : (
								<View style={styles.defaultAvatar}>
									<Iconfont name={"my"} size={44} color={Colors.lightFontColor} />
								</View>
							)}
						</View>
						<View>
							{login ? (
								<View
									style={{
										paddingTop: 20
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
						<View style={{ flexDirection: "row", justifyContent: "center", paddingVertical: 20 }}>
							<View style={{ paddingRight: 20, borderRightWidth: 1, borderRightColor: "#CD6839" }}>
								<Text style={{ color: "#CD6839" }}>精力点: 226</Text>
							</View>
							<Text style={{ paddingLeft: 20, color: "#CD6839" }}>智慧点: 162</Text>
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
		alignItems: "center",
		marginTop: 65
	},
	userName: {
		fontSize: 16,
		fontWeight: "400",
		color: Colors.darkFont
	}
});

export default UserTopInfo;
