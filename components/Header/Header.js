import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import { withNavigation } from "react-navigation";

import { Colors, Divice } from "../../constants";
import { Iconfont } from "../../utils/Fonts";
// import HeaderLeft from "./HeaderLeft";

class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let {
			routeName,
			leftComponent,
			centerComponent,
			rightComponent,
			navigation,
			hidden = false,
			lightBar = false,
			customStyle = {},
			backHandler,
			onLayout = event => null
		} = this.props;
		return (
			<View style={[styles.header, lightBar && styles.lightHeader, customStyle]} onLayout={onLayout}>
				{leftComponent ? (
					leftComponent
				) : (
					<TouchableOpacity
						activeOpacity={1}
						style={[styles.side, { width: 40, left: 15 }]}
						onPress={() => {
							if (backHandler) {
								backHandler();
							} else {
								navigation.goBack();
							}
						}}
					>
						<Iconfont name={"left"} size={19} color={lightBar ? "#fff" : Colors.primaryFontColor} />
					</TouchableOpacity>
				)}
				{centerComponent ? (
					centerComponent
				) : (
					<View style={styles.title}>
						<Text style={[styles.routeName, lightBar && { color: "#fff" }]}>
							{routeName ? routeName : navigation.state.routeName}
						</Text>
					</View>
				)}
				{rightComponent && <View style={[styles.side, { right: 15 }]}>{rightComponent}</View>}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		paddingTop: Divice.STATUSBAR_HEIGHT + 13,
		paddingBottom: 15,
		paddingHorizontal: 13,
		height: Divice.STATUSBAR_HEIGHT + 46,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor,
		backgroundColor: Colors.white
	},
	lightHeader: {
		backgroundColor: "transparent",
		borderBottomColor: "transparent"
	},
	side: {
		position: "absolute",
		flexDirection: "row",
		alignItems: "center",
		height: 40,
		bottom: 1
	},
	title: {
		flex: 1,
		marginHorizontal: 40,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	routeName: {
		fontSize: 17,
		fontWeight: "300",
		color: Colors.primaryFontColor
	}
});

export default withNavigation(Header);
