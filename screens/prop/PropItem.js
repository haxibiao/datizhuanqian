import React, { Component } from "react";
import { StyleSheet, View, StatusBar, Image, Text, TouchableOpacity } from "react-native";
import { PropDetailsModal } from "../../components/Modal";
import { Button } from "../../components/Control";
import { DivisionLine, ErrorBoundary, ContentEnd } from "../../components/Universal";

import { Colors, Config, Divice } from "../../constants";

class Screen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isShow: false
		};
	}

	render() {
		let { item } = this.props;

		return (
			<View>
				<View style={styles.item}>
					<View style={styles.itemLeft}>
						<Image source={{ uri: item.logo }} style={styles.img} />
						<View style={styles.content}>
							<Text style={styles.name}>{item.name}</Text>
							<Text style={{ color: Colors.theme }}>{item.description}</Text>
						</View>
					</View>
					<Button
						name={"立即购买"}
						style={styles.buy}
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
				<PropDetailsModal
					visible={this.state.isShow}
					handleVisible={this.handleCorrectModal.bind(this)}
					prop={item}
				/>
			</View>
		);
	}
	handleCorrectModal() {
		this.setState(prevState => ({
			isShow: !prevState.isShow
		}));
	}
}

const styles = StyleSheet.create({
	item: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		// marginHorizontal: 15,
		paddingHorizontal: 15,
		paddingVertical: 15,
		backgroundColor: Colors.white
	},
	itemLeft: {
		flexDirection: "row",
		alignItems: "center"
	},
	name: {
		fontSize: 16,
		lineHeight: 22
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
	},
	buy: {
		borderRadius: 5,
		height: 32,
		paddingHorizontal: 15
	}
});

export default Screen;
