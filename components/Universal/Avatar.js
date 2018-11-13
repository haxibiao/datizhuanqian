import React, { Component } from "react";
import { StyleSheet, View, Image } from "react-native";

class Avatar extends Component {
	render() {
		const {
			uri,
			size = 44,
			type = "user",
			borderStyle = { borderWidth: 0.5, borderColor: "#f0f0f0" }
		} = this.props;
		return (
			<Image
				style={[
					{
						width: size,
						height: size,
						borderRadius: type === "user" ? size / 2 : size / 10,
						resizeMode: "cover"
					},
					borderStyle
				]}
				source={{ uri: uri }}
			/>
		);
	}
}

const styles = StyleSheet.create({});

export default Avatar;
