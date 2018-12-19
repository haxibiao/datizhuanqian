import React, { Component } from "react";
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions, Animated, Image } from "react-native";
import BasicModal from "./BasicModal";
import { Iconfont } from "../../utils/Fonts";
import { Colors, Divice } from "../../constants";
import { Button } from "../Control";

const { width, height } = Dimensions.get("window");

class PropDetailsModal extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { visible, handleVisible, prop } = this.props;

		return (
			<BasicModal
				visible={visible}
				handleVisible={handleVisible}
				customStyle={styles.custom}
				header={
					<View style={styles.header}>
						<Image
							source={{
								uri:
									"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1545019358036&di=a658ef0ff0e65adf97cdce2712f288f6&imgtype=0&src=http%3A%2F%2Fp0.so.qhimgs1.com%2Ft0119ab6c82fbe06810.jpg"
							}}
							style={styles.img}
						/>
						<Text style={styles.name}>{prop.name}</Text>
					</View>
				}
			>
				<View style={{ marginTop: -20 }}>
					<Text>{prop.description}</Text>
				</View>
				<View style={{ paddingBottom: 15 }}>
					<View style={styles.bottom}>
						<Button name={"取消"} style={styles.cancel} fontSize={14} handler={handleVisible} />
						<Button name={"购买"} style={styles.buy} fontSize={14} />
					</View>
				</View>
			</BasicModal>
		);
	}
}

const styles = StyleSheet.create({
	custom: {
		width: (width * 2) / 3,
		height: (width * 4) / 7,
		borderRadius: 5,
		alignItems: "center",
		justifyContent: "space-between",
		padding: 0
	},
	header: {
		backgroundColor: Colors.theme,
		width: (width * 2) / 3,
		height: 80,
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		alignItems: "center"
	},
	img: {
		width: 72,
		height: 72,
		borderRadius: 8,
		marginTop: -36
	},
	name: {
		paddingTop: 15,
		fontSize: 16
	},
	bottom: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	cancel: {
		borderRadius: 5,
		height: 32,
		paddingHorizontal: 25,
		marginHorizontal: 10
	},
	buy: {
		borderRadius: 5,
		height: 32,
		paddingHorizontal: 25,
		marginHorizontal: 10
	}
});

export default PropDetailsModal;
