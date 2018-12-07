import React, { Component } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, Dimensions } from "react-native";

import { Colors } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

const { width, height } = Dimensions.get("window");

class Question extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { question, option, navigation, isMethod, value, changeValue, showColor } = this.props;
		return (
			<View>
				<Text style={styles.title}>{question.description}</Text>
				{question.image && (
					<Image
						source={{
							uri: question.image.path
						}}
						style={{
							width: width - 60,
							height: (question.image.height / question.image.width) * (width - 60),
							marginTop: 10,
							borderRadius: 5
						}}
					/>
				)}
				<View style={styles.options}>
					{option.Selection.map((option, index) => {
						return (
							<TouchableOpacity
								disabled={isMethod}
								key={index}
								style={[
									styles.option,
									{
										borderColor: value == option.Value ? showColor : Colors.tintGray
									}
								]}
								onPress={() => changeValue(option.Value)}
							>
								<Text>{option.Text}</Text>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	title: {
		color: Colors.primaryFont,
		fontSize: 16,
		lineHeight: 22
	},
	options: {
		paddingTop: 30,
		paddingHorizontal: 10
	},
	option: {
		marginTop: 10,
		borderWidth: 1,
		borderRadius: 5,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 12
	}
});

export default Question;
