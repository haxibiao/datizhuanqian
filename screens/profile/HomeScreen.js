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
						<TopUserInfo user={user} navigation={navigation} login={login} />
						<DivisionLine height={10} />
						<TouchableOpacity style={styles.rowItem}>
							<View style={styles.itemLeft}>
								<Iconfont />
								<Text>分享邀请</Text>
							</View>
							<Iconfont name={"right"} />
						</TouchableOpacity>
						<TouchableOpacity style={styles.rowItem}>
							<View style={styles.itemLeft}>
								<Iconfont />
								<Text>提现日志</Text>
							</View>
							<Iconfont name={"right"} />
						</TouchableOpacity>
						<DivisionLine height={10} />
						<TouchableOpacity style={styles.rowItem}>
							<View style={styles.itemLeft}>
								<Iconfont />
								<Text>常见问题</Text>
							</View>
							<Iconfont name={"right"} />
						</TouchableOpacity>
						<TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate("意见反馈")}>
							<View style={styles.itemLeft}>
								<Iconfont />
								<Text>意见反馈</Text>
							</View>
							<Iconfont name={"right"} />
						</TouchableOpacity>
						<DivisionLine height={10} />
						<TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate("设置")}>
							<View style={styles.itemLeft}>
								<Iconfont />
								<Text>设置</Text>
							</View>
							<Iconfont name={"right"} />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => navigation.navigate("登录")}>
							<Text>我的</Text>
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
		flexDirection: "row"
	}
});

export default connect(store => {
	return { user: store.user.personal, login: store.user.login };
})(HomeScreen);
