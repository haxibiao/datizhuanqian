import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Image } from "react-native";

import Screen from "../../Screen";
import { Colors, Config, Divice } from "../../../constants";

const { width, height } = Dimensions.get("window");

class LevelDescriptionScreen extends Component {
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
					<View style={{ paddingVertical: 15 }}>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 15, color: Colors.black }}>Q：头衔是什么？有什么作用？</Text>
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 15, lineHeight: 15 }}>
								A：用户的头衔是用户身份的象征，头衔会根据用户的等级进行变更。等级系统是用户积极答题活跃度的反馈，当用户的等级上升，精力点上限也会随之上升，并且升级还会有很多道具等其他的小奖励哦。
							</Text>
						</View>
					</View>
					<View style={{ paddingVertical: 15 }}>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 15, color: Colors.black }}>Q：如何升级？</Text>
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 15, lineHeight: 15 }}>
								A：如果你想要升级，就必须达到对应的经验值。经验值就是你答对题目的数量，答对一道题经验值+1。所以想要快快升级，就要提高自己答题的正确率哦。
							</Text>
						</View>
					</View>
					<View style={{ alignItems: "center", marginTop: 10, paddingHorizontal: 20 }}>
						<View style={{ flexDirection: "row" }}>
							<Text style={styles.text}>等级</Text>
							<Text style={styles.text}>头衔</Text>
							<Text style={styles.text}>经验值</Text>
							<Text style={styles.text}>精力点上限</Text>
						</View>
						<View style={{ flexDirection: "row" }}>
							<Text style={styles.text}>8</Text>
							<Text style={styles.text}>仁者无敌</Text>
							<Text style={styles.text}>10000</Text>
							<Text style={styles.text}>600</Text>
						</View>
						<View style={{ flexDirection: "row" }}>
							<Text style={styles.text}>7</Text>
							<Text style={styles.text}>仁人名师</Text>
							<Text style={styles.text}>5000</Text>
							<Text style={styles.text}>440</Text>
						</View>
						<View style={{ flexDirection: "row" }}>
							<Text style={styles.text}>6</Text>
							<Text style={styles.text}>为师有道</Text>
							<Text style={styles.text}>2000</Text>
							<Text style={styles.text}>360</Text>
						</View>
						<View style={{ flexDirection: "row" }}>
							<Text style={styles.text}>5</Text>
							<Text style={styles.text}>学长师友</Text>
							<Text style={styles.text}>1000</Text>
							<Text style={styles.text}>300</Text>
						</View>
						<View style={{ flexDirection: "row" }}>
							<Text style={styles.text}>4</Text>
							<Text style={styles.text}>有学而志</Text>
							<Text style={styles.text}>500</Text>
							<Text style={styles.text}>250</Text>
						</View>
						<View style={{ flexDirection: "row" }}>
							<Text style={styles.text}>3</Text>
							<Text style={styles.text}>游学四方</Text>
							<Text style={styles.text}>200</Text>
							<Text style={styles.text}>220</Text>
						</View>
						<View style={{ flexDirection: "row" }}>
							<Text style={styles.text}>2</Text>
							<Text style={styles.text}>小有所成</Text>
							<Text style={styles.text}>50</Text>
							<Text style={styles.text}>200</Text>
						</View>
						<View style={{ flexDirection: "row" }}>
							<Text style={styles.text}>1</Text>
							<Text style={styles.text}>初来乍到</Text>
							<Text style={styles.text}>0</Text>
							<Text style={styles.text}>180</Text>
						</View>
					</View>
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
	text: {
		borderWidth: 1,
		borderColor: Colors.lightBorder,
		width: (width - 40) / 4,
		textAlign: "center",
		paddingVertical: 10,
		fontSize: 13
	}
});

export default LevelDescriptionScreen;
