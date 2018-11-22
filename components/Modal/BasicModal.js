import React, { Component } from "react";
import { StyleSheet, View, Modal, Text, Dimensions, Platform, BackHandler, StatusBar, Keyboard } from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";

const { width, height } = Dimensions.get("window");

class BasicModal extends Component {
	render() {
		const { visible, handleVisible, header, children, customStyle = {}, animationType = "fade" } = this.props;
		const mergeStyle = StyleSheet.flatten([styles.modalInner, customStyle]);
		return (
			<Modal animationType={animationType} transparent={true} visible={visible} onRequestClose={handleVisible}>
				<View
					style={[styles.modalShade, animationType == "slide" && { justifyContent: "flex-end" }]}
					onStartShouldSetResponder={evt => true}
					onResponderStart={handleVisible}
					onStartShouldSetResponderCapture={evt => false}
				>
					<StatusBar backgroundColor={visible ? "rgba(48,48,48,0.8)" : "#fff"} barStyle={"dark-content"} />
					<View style={mergeStyle} onStartShouldSetResponder={evt => true}>
						{header ? <View style={styles.modalHeader}>{header}</View> : null}
						{children}
					</View>
				</View>
				{Platform.OS == "ios" && <KeyboardSpacer />}
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	modalShade: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(48,48,48,0.8)"
	},
	modalInner: {
		width: width - 40,
		padding: 20,
		borderRadius: 3,
		backgroundColor: "#f8f8f8"
	},
	modalHeader: {
		paddingBottom: 20
	}
});

export default BasicModal;
