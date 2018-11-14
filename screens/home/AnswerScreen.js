import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";

import { Colors } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

import Screen from "../Screen";

import { connect } from "react-redux";
import actions from "../../store/actions";

class AnswerScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { question } = this.props;
		return (
			<Screen>
				<View>
					<Text style={{ color: Colors.orange, fontSize: 13 }}>智慧点价值{question.title}</Text>
					<View>
						<Image />
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
	}
});

export default connect(store => {
	return {
		question: store.question.question
	};
})(AnswerScreen);
