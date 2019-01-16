"use strict";

import React, { Component } from "react";
import { withNavigation } from "react-navigation";

import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Colors, Divice } from "../../constants";
import { Iconfont } from "../../utils/Fonts";
import CustomTabBar from "./CustomTabBar";

class TabBarHeader extends Component {
	render() {
		let { navigation, width = containerWidth, tabUnderlineWidth } = this.props;
		return (
			<View style={styles.header}>
				<TouchableOpacity activeOpacity={1} style={styles.goBack} onPress={() => navigation.goBack()}>
					<Iconfont name={"left"} size={19} color={Colors.primaryFont} />
				</TouchableOpacity>
				<CustomTabBar
					tabUnderlineWidth={50}
					{...this.props}
					containerWidth={width}
					style={{ height: 40, width, borderWidth: 0 }}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		paddingTop: Divice.STATUSBAR_HEIGHT,
		height: Divice.STATUSBAR_HEIGHT + 40,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.skin
	},
	goBack: {
		position: "absolute",
		flexDirection: "row",
		alignItems: "center",
		width: 40,
		height: 40,
		bottom: 0,
		left: 15
	}
});

export default withNavigation(TabBarHeader);
