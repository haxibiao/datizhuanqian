import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from "react-native";
import { Header } from "../../components/Header";
import { Button } from "../../components/Control";
import { DivisionLine, ErrorBoundary } from "../../components/Universal";
import { Colors, Config, Divice } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

import Screen from "../Screen";

class TaskItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let { title, navigation, reword, status } = this.props;
		return (
			<View style={styles.container}>
				<View>
					<Text style={{ color: "#3c3c3c", fontSize: 15 }}>{title}</Text>
					<Text style={{ color: Colors.tintFont, fontSize: 13, paddingTop: 10, fontWeight: "200" }}>
						奖励 <Text style={{ color: Colors.theme }}>{reword}</Text>
					</Text>
				</View>
				{status ? (
					<Button
						name={"已完成"}
						outline
						style={{
							borderRadius: 45,
							paddingHorizontal: 15,
							height: 32,
							borderWidth: 1,
							borderColor: Colors.grey
						}}
						theme={Colors.tintFont}
						textColor={Colors.tintFont}
						fontSize={13}
					/>
				) : (
					<Button
						name={"做任务"}
						outline
						style={{
							borderRadius: 45,
							paddingHorizontal: 15,
							height: 32,
							borderWidth: 1,
							borderColor: Colors.theme
						}}
						textColor={Colors.theme}
						fontSize={13}
					/>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 15,
		paddingVertical: 15,
		borderTopWidth: 1,
		borderTopColor: Colors.lightBorder,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: 72
	}
});

export default TaskItem;
