import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, Dimensions, Slider } from "react-native";

import { Header } from "../../components/Header";
import { TabTop, Banner, Avatar, DivisionLine } from "../../components/Universal";
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

				{/*<View style={styles.content}>
						<View style={styles.titleInfo}>
							<Iconfont name={"tixian"} size={20} color={Colors.theme} />
							<Text style={styles.title}>智慧点提现</Text>
						</View>
						<View style={styles.bottomInfo}>
							<Text style={{ fontSize: 22, paddingBottom: 15 }}>￥{withdraws.amount}.00</Text>
							<Text style={styles.infoItem}>回执信息：{withdraws.remark}</Text>
							<TouchableOpacity
								onPress={() => {
									navigation.navigate("我的账户", { user: user });
								}}
							>
								<Text style={{ color: Colors.red, fontSize: 15 }}>修改</Text>
							</TouchableOpacity>
							<Text style={styles.infoItem}>提现方式：支付宝({user.pay_account})</Text>
							<Text style={styles.infoItem}>提现时间：{withdraws.created_at}</Text>
						</View>
					</View>*/}

				<View style={{ backgroundColor: Colors.white }}>
					<View style={{ paddingHorizontal: 15 }}>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
								marginTop: 15
							}}
						>
							<Avatar size={38} uri={user.avatar} />
							<Text style={{ paddingLeft: 10, fontSize: 18, color: Colors.black }}>{user.name}</Text>
						</View>
						<View style={{ alignItems: "center", marginVertical: 20 }}>
							<Text style={{ fontSize: 36, paddingBottom: 15, color: Colors.black }}>
								{withdraws.amount}.00
							</Text>
							{withdraws.status == -1 ? (
								<Text style={{ fontSize: 16, color: Colors.red }}>交易失败</Text>
							) : (
								<Text style={{ fontSize: 16, color: Colors.weixin }}>交易成功</Text>
							)}
						</View>
						<View style={{ paddingBottom: 20, flexDirection: "row", justifyContent: "space-between" }}>
							<Text style={{ fontSize: 15, color: Colors.grey }}>提现单号</Text>
							<Text style={{ fontSize: 15, color: Colors.black }}>{withdraws.biz_no}</Text>
						</View>
						<View style={{ paddingBottom: 20, flexDirection: "row", justifyContent: "space-between" }}>
							<Text style={{ fontSize: 15, color: Colors.grey }}>转账备注</Text>
							<Text style={{ fontSize: 15, color: Colors.black }}>智慧点提现</Text>
						</View>
						<View style={{ paddingBottom: 15, flexDirection: "row", justifyContent: "space-between" }}>
							<Text style={{ fontSize: 15, color: Colors.grey }}>收款账户</Text>
							<Text style={{ fontSize: 15, color: Colors.black }}>
								{user.pay_account + "(" + user.real_name + ")"}
							</Text>
						</View>
						<View
							style={{
								paddingBottom: 20,
								paddingTop: 15,
								flexDirection: "row",
								justifyContent: "space-between",
								borderTopWidth: 1,
								borderTopColor: Colors.lightBorder
							}}
						>
							<Text style={{ fontSize: 15, color: Colors.grey }}>
								{withdraws.status == -1 ? "提现时间" : "到账时间"}
							</Text>
							<Text style={{ fontSize: 15, color: Colors.black }}>
								{withdraws.status == -1 ? withdraws.created_at : withdraws.updated_at}
							</Text>
						</View>
						<View
							style={{
								paddingBottom: 15,
								flexDirection: "row",
								justifyContent: "space-between"
							}}
						>
							<Text style={{ fontSize: 15, color: Colors.grey }}>支付宝订单号</Text>
							<Text
								style={{
									fontSize: 15,
									color: Colors.black,
									width: (width * 5) / 9,
									textAlign: "right"
								}}
							>
								{withdraws.trade_no}
							</Text>
						</View>
					</View>
					<DivisionLine height={10} />
					<View style={{ paddingHorizontal: 15 }}>
						<View
							style={{
								paddingVertical: 15,
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center"
							}}
						>
							<Text style={{ fontSize: 16, color: Colors.grey }}>回执信息</Text>
							<Text style={{ fontSize: 16, color: Colors.black }}>{withdraws.remark}</Text>
						</View>

						{//需要提供字段用来判断修改支付宝账号
						withdraws.remark && (
							<TouchableOpacity
								style={{
									paddingVertical: 15,
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									borderTopWidth: 1,
									borderTopColor: Colors.lightBorder
								}}
								onPress={() => {
									navigation.navigate("我的账户", { user: user });
								}}
							>
								<Text style={{ fontSize: 16, color: Colors.grey }}>修改支付账号</Text>
								<Iconfont name={"right"} size={16} />
							</TouchableOpacity>
						)}
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
