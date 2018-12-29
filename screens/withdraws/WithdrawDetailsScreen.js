import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, Dimensions, Slider } from "react-native";

import { Header } from "../../components/Header";
import { TabTop, Banner } from "../../components/Universal";
import Screen from "../Screen";
import { Colors, Config, Divice } from "../../constants";
import { Iconfont } from "../../utils/Fonts";
import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");

class WithdrawDetailsScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, user } = this.props;
		const { withdraws } = navigation.state.params;
		console.log("user", user);
		return (
			<View style={styles.container}>
				<Header />
				<View style={styles.content}>
					<View style={styles.titleInfo}>
						<Iconfont name={"tixian"} size={20} color={Colors.theme} />
						<Text style={styles.title}>智慧点提现</Text>
					</View>
					<View style={styles.bottomInfo}>
						<Text style={{ fontSize: 22, paddingBottom: 15 }}>￥{withdraws.amount}.00</Text>
						<Text style={styles.infoItem}>回执信息:{withdraws.remark}</Text>
						<Text style={styles.infoItem}>提现方式:支付宝({user.pay_account})</Text>
						<Text style={styles.infoItem}>提现时间:{withdraws.created_at}</Text>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightBorder
	},
	content: {
		marginTop: 20,
		marginBottom: 10,
		marginHorizontal: 15,
		backgroundColor: Colors.white
	},
	titleInfo: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 15,
		marginHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: Colors.tintGray
	},
	title: {
		paddingLeft: 15,
		fontSize: 17
	},
	bottomInfo: {
		paddingVertical: 15,
		marginHorizontal: 15
	},
	infoItem: {
		fontSize: 15,
		color: Colors.grey,
		paddingVertical: 5
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(WithdrawDetailsScreen);
