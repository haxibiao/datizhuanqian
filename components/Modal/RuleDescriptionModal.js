import React, { Component } from "react";
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions, Animated, Image } from "react-native";
import BasicModal from "./BasicModal";
import { Iconfont } from "../../utils/Fonts";
import { Colors, Divice } from "../../constants";
import { Button } from "../Control";

const { width, height } = Dimensions.get("window");

class NoTicketTipsModal extends Component {
	render() {
		const { visible, handleVisible, nextQuestion, gold } = this.props;
		return (
			<BasicModal
				visible={visible}
				handleVisible={handleVisible}
				customStyle={{
					width: width - 80,
					height: width + 10,
					borderRadius: 5,
					alignItems: "center"
				}}
				header={<Text style={{ color: Colors.black, fontSize: 18 }}>规则说明</Text>}
			/>
		);
	}
}

const styles = StyleSheet.create({
	true: {
		fontSize: 20,
		paddingTop: 15,
		color: Colors.theme
	}
});

export default NoTicketTipsModal;
