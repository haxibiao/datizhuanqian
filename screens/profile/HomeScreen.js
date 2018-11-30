import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from "react-native";
import { Header } from "../../components/Header";
import { DivisionLine } from "../../components/Universal";
import { Colors, Config, Divice } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

import Screen from "../Screen";
import TopUserInfo from "./TopUserInfo";

import { connect } from "react-redux";
import actions from "../../store/actions";

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let { user, navigation, login } = this.props;
		return (
			<Screen header>
				<View style={styles.container}>
					{/*<Header leftComponent={<Text />} customStyle={{ backgroundColor: Colors.theme }} />*/}
					<ScrollView bounces={false}>
						<TopUserInfo navigation={navigation} login={login} />
						<DivisionLine height={10} />
						<TouchableOpacity style={styles.rowItem}>
							<View style={styles.itemLeft}>
								<Iconfont name={"invitation"} size={19} />
								<Text style={{ paddingLeft: 10, fontSize: 15, color: Colors.black, fontSize: 15 }}>
									分享邀请
								</Text>
							</View>
							<Iconfont name={"right"} />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.rowItem}
							onPress={() =>
								login
									? navigation.navigate("提现日志", {
											user: user
									  })
									: navigation.navigate("登录注册")
							}
						>
							<View style={styles.itemLeft}>
								<Iconfont name={"book"} size={18} />
								<Text style={{ paddingLeft: 10, fontSize: 15, color: Colors.black }}>提现日志</Text>
							</View>
							<Iconfont name={"right"} />
						</TouchableOpacity>
						<DivisionLine height={10} />
						<TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate("常见问题")}>
							<View style={styles.itemLeft}>
								<Iconfont name={"question"} size={18} />
								<Text style={{ paddingLeft: 10, fontSize: 15, color: Colors.black }}>常见问题</Text>
							</View>
							<Iconfont name={"right"} />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.rowItem}
							onPress={() => (login ? navigation.navigate("意见反馈") : navigation.navigate("登录注册"))}
						>
							<View style={styles.itemLeft}>
								<Iconfont name={"feedback2"} size={18} />
								<Text style={{ paddingLeft: 10, fontSize: 15, color: Colors.black }}>意见反馈</Text>
							</View>
							<Iconfont name={"right"} />
						</TouchableOpacity>
						<DivisionLine height={10} />
						<TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate("设置")}>
							<View style={styles.itemLeft}>
								<Iconfont name={"setting1"} size={18} />
								<Text style={{ paddingLeft: 10, fontSize: 15, color: Colors.black }}>设置</Text>
							</View>
							<Iconfont name={"right"} />
						</TouchableOpacity>
					</ScrollView>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	rowItem: {
		height: 58,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder
	},
	itemLeft: {
		flexDirection: "row",
		alignItems: "center"
	}
});

export default connect(store => {
	return { user: store.users.user, login: store.users.login };
})(HomeScreen);
