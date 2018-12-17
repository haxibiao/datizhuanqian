import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image } from "react-native";
import { Header } from "../../components/Header";
import { Button } from "../../components/Control";
import { PropDetailsModal } from "../../components/Modal";
import { DivisionLine, ErrorBoundary, ContentEnd } from "../../components/Universal";
import { Colors, Config, Divice } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

import { connect } from "react-redux";

import Screen from "../Screen";

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isShow: false
		};
	}
	handleCorrectModal() {
		this.setState(prevState => ({
			isShow: !prevState.isShow
		}));
	}
	render() {
		let { isShow } = this.state;
		console.log("isShow", isShow);
		let { user, navigation, login, prop } = this.props;
		return (
			<Screen header>
				<Header
					leftComponent={<Text />}
					customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }}
				/>
				<FlatList
					data={prop}
					keyExtractor={(item, index) => index.toString()}
					renderItem={this._propItem}
					ListFooterComponent={() => <ContentEnd />}
				/>
				<PropDetailsModal visible={isShow} handleVisible={this.handleCorrectModal.bind(this)} />
			</Screen>
		);
	}
	_propItem = ({ item, index }) => {
		let { navigation } = this.props;
		return (
			<View>
				<View style={styles.item}>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Image source={{ uri: item.logo }} style={styles.img} />
						<View style={styles.content}>
							<Text style={{ fontSize: 16, fontWeight: "500", lineHeight: 22 }}>{item.name}</Text>
							<Text>{item.description}</Text>
						</View>
					</View>
					<Button
						name={"查看详情"}
						style={{
							borderRadius: 5,
							height: 32,
							paddingHorizontal: 15
						}}
						// theme={Colors.theme}
						fontSize={14}
						handler={() => {
							this.setState({
								isShow: true
							});
						}}
					/>
				</View>
				<DivisionLine height={8} />
			</View>
		);
	};
	handleCorrectModal() {
		this.setState(prevState => ({
			isShow: !prevState.isShow
		}));
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	item: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		// marginHorizontal: 15,
		paddingHorizontal: 15,
		paddingVertical: 15,
		backgroundColor: Colors.white
	},
	img: {
		width: 68,
		height: 68,
		borderRadius: 5
	},
	content: {
		height: 58,
		marginLeft: 15,
		justifyContent: "space-between"
	}
});

export default connect(store => {
	return { prop: store.users.prop };
})(HomeScreen);
