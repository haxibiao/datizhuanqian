import React, { Component } from "react";
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions, Animated, Image } from "react-native";
import BasicModal from "./BasicModal";
import { Iconfont } from "../../utils/Fonts";
import { Colors, Divice } from "../../constants";
import { Button } from "../Control";

const { width, height } = Dimensions.get("window");

class CorrectModal extends Component {
	render() {
		const { visible, handleVisible, title, nextQuestion, gold } = this.props;
		console.log("nextQuestion", nextQuestion);
		return (
			<BasicModal
				visible={visible}
				handleVisible={handleVisible}
				customStyle={{
					width: 260,
					height: 300,
					borderRadius: 5,
					alignItems: "center",
					justifyContent: "space-between"
				}}
				header={
					<Text style={title ? styles.true : styles.false}>
						{title ? "恭喜你回答正确" : "很遗憾,回答错误"}
					</Text>
				}
			>
				<Image
					source={title ? require("../../assets/images/right.png") : require("../../assets/images/error.png")}
					style={{ height: 100, width: 100 }}
				/>
				{title && (
					<View style={styles.content}>
						<Iconfont name={"zhuanshi"} size={18} color={Colors.theme} />
						<Text style={styles.text}>智慧点+{gold}</Text>
					</View>
				)}
				<Button
					name={"下一题"}
					disabled={false}
					handler={nextQuestion}
					style={{ height: 34, paddingHorizontal: 42 }}
					theme={Colors.blue}
					fontSize={14}
				/>
			</BasicModal>
		);
	}
}

const styles = StyleSheet.create({
	true: {
		fontSize: 20,
		paddingTop: 15,
		color: Colors.theme
	},
	false: {
		fontSize: 20,
		paddingTop: 15,
		color: Colors.grey
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	text: {
		fontSize: 13,
		color: Colors.theme
	}
});

export default CorrectModal;
