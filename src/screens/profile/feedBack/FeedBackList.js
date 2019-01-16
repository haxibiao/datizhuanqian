import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Dimensions, FlatList, Image } from "react-native";
import { Header } from "../../../components/Header";
import { DivisionLine, ErrorBoundary, ContentEnd, Avatar } from "../../../components/Universal";
import { Colors, Config, Divice } from "../../../constants";
import { Iconfont } from "../../../utils/Fonts";

import { connect } from "react-redux";

import Screen from "../../Screen";

const { width, height } = Dimensions.get("window");

class FeedBackList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			onPress: "LATEST"
		};
	}
	render() {
		let { user, navigation, login, feedback } = this.props;
		let { onPress } = this.state;
		console.log("feed", feedback);
		return (
			<Screen header tabLabel="今日">
				<DivisionLine height={5} />
				<View
					style={{
						flexDirection: "row",
						paddingHorizontal: 10,
						borderBottomColor: Colors.lightBorder,
						borderBottomWidth: 1
					}}
				>
					<TouchableOpacity
						style={{
							borderBottomWidth: 2,
							borderBottomColor: onPress == "LATEST" ? Colors.theme : Colors.white,
							marginRight: 30,
							paddingVertical: 10
						}}
						onPress={() => {
							this.setState({
								onPress: "LATEST"
							});
						}}
					>
						<Text>最新</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							borderBottomWidth: 2,
							borderBottomColor: onPress == "LATEST" ? Colors.white : Colors.theme,
							marginRight: 30,
							paddingVertical: 10
						}}
						onPress={() => {
							this.setState({
								onPress: "MYFEEDBACK"
							});
						}}
					>
						<Text>我的建议</Text>
					</TouchableOpacity>
				</View>
				<FlatList
					data={feedback}
					keyExtractor={(item, index) => index.toString()}
					renderItem={this._feedbackItem}
					ListFooterComponent={() => <ContentEnd />}
				/>
			</Screen>
		);
	}
	_feedbackItem = ({ item, index }) => {
		let { navigation } = this.props;
		return (
			<TouchableOpacity style={styles.feedbackItem}>
				<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
					<Avatar uri={item.user.avatar} size={34} />
					<Text style={{ paddingLeft: 10 }}>{item.user.name}</Text>
				</View>
				<View>
					<Text>{item.description}</Text>
					<View style={{ flexDirection: "row", marginTop: 10 }}>
						{item.images.map((image, index) => {
							return (
								<Image
									source={{ uri: image }}
									style={{ width: (width - 60) / 3, height: (width - 60) / 3, marginRight: 20 }}
									key={index}
								/>
							);
						})}
					</View>
				</View>
			</TouchableOpacity>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	feedbackItem: {
		marginHorizontal: 10,
		borderBottomColor: Colors.lightBorder,
		borderBottomWidth: 1,
		paddingVertical: 15
	}
});

export default connect(store => {
	return {
		feedback: store.users.feedback
	};
})(FeedBackList);
