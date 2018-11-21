import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Image } from "react-native";

import Screen from "../../Screen";
import { Colors, Config, Divice } from "../../../constants";

import { connect } from "react-redux";
import actions from "../../../store/actions";
const { width, height } = Dimensions.get("window");

class AboutScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			counts: props.user
		};
	}
	render() {
		const { counts } = this.state;
		return (
			<Screen>
				<View style={styles.container}>
					<View style={{ alignItems: "center", marginTop: 15 }}>
						<Image
							source={require("../../../assets/images/logo.png")}
							style={{ width: width / 4, height: width / 4 }}
						/>
						<Text style={{ color: Colors.black, fontSize: 15, margin: 20 }}>答题赚钱 V1.0.0</Text>
					</View>
					<View style={{ marginTop: 30 }}>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 15, color: Colors.black }}>联系我们</Text>
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 15 }}>QQ交流群: 4337413</Text>

							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 10 }}>
								商务合作: lixueqing@haxibiao.com
							</Text>
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 10 }}>客服QQ: 597455096</Text>
						</View>
					</View>
				</View>
				<View style={{ backgroundColor: Colors.tintGray, paddingVertical: 15, alignItems: "center" }}>
					<Text>哈希表网络科技(深圳)有限公司</Text>
					<Text>www.datizhuanqian.com</Text>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(AboutScreen);
