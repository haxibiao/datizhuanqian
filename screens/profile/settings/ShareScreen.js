import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Image } from "react-native";

import Screen from "../../Screen";
import { Colors, Config, Divice } from "../../../constants";

const { width, height } = Dimensions.get("window");

class ShareScreen extends Component {
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
					<Image
						source={{ uri: "https://datizhuanqian.com/picture/qrcode.png" }}
						style={{ width: width / 3, height: width / 3 }}
					/>
					<Text style={{ color: Colors.black, fontSize: 15, marginTop: 10 }}>扫描下载答题赚钱APP</Text>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
		justifyContent: "center",
		alignItems: "center"
	}
});

export default ShareScreen;
