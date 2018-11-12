import React, { Component } from "react";
import { StyleSheet, View, StatusBar } from "react-native";

import { Divice } from "../constants";
import { Header } from "../components/Header";

class Screen extends Component {
	render() {
		let { customStyle = {}, lightBar, header = false, leftComponent = false } = this.props;
		return (
			<View
				style={[
					{
						flex: 1,
						backgroundColor: "#ffffff"
					},
					customStyle
				]}
			>
				<StatusBar
					translucent={true}
					backgroundColor={"transparent"}
					barStyle={lightBar ? "light-content" : "dark-content"}
				/>
				{header ? header : <Header leftComponent={leftComponent} customStyle={customStyle} />}
				{this.props.children}
			</View>
		);
	}
}

const styles = StyleSheet.create({});

export default Screen;
