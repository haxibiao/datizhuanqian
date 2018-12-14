import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, Dimensions, Slider } from "react-native";

import { Header } from "../../components/Header";
import { TabTop, Banner } from "../../components/Universal";
import Screen from "../Screen";
import { Colors, Config, Divice } from "../../constants";

const { width, height } = Dimensions.get("window");

class NotLogin extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<View style={styles.container}>
				<View>
					<View style={styles.row}>
						<View style={styles.rowLeft}>
							<Text style={{ fontSize: 16, color: Colors.black }}>剩余智慧点</Text>
						</View>
						<View style={styles.center}>
							<Text style={{ fontSize: 16, color: Colors.black }}>0</Text>
						</View>
					</View>
					<View style={{ alignItems: "center" }}>
						<Slider style={{ width: 320 }} minimumValue={0} maximumValue={0} step={1} />
					</View>
					<View style={styles.row}>
						<View style={styles.rowLeft}>
							<Text style={{ fontSize: 16, color: Colors.black }}>兑换智慧点</Text>
							<Text style={{ fontSize: 11, color: Colors.grey }}>大于600可提现</Text>
						</View>
						<View style={styles.center}>
							<Text style={{ fontSize: 16, color: Colors.black }}>请登录查看智慧点</Text>
						</View>
					</View>
				</View>
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						paddingHorizontal: 15
						// marginTop: (height - 222) / 2
					}}
				>
					<Image
						source={require("../../assets/images/alipay.jpg")}
						style={{ width: width / 3, height: width / 3 }}
					/>
					<Text style={{ color: Colors.grey, fontSize: 13, fontWeight: "300" }}>还没有登录账号哦</Text>
					<Text
						style={{
							color: Colors.grey,
							fontSize: 13,
							fontWeight: "300",
							paddingTop: 10
						}}
					>
						登录后绑定支付宝账户即可进行提现
					</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFEFC"
	},
	row: {
		flexDirection: "row",
		justifyContent: "center",
		height: 60,
		marginVertical: 18
	},
	rowLeft: {
		flex: 1,
		borderRightColor: Colors.tintGray,
		borderRightWidth: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	}
});

export default NotLogin;
