import React, { Component } from "react";
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions } from "react-native";
import BasicModal from "./BasicModal";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";

const { width, height } = Dimensions.get("window");

class SignOutModal extends Component {
	render() {
		const { visible, handleVisible, confirm, title = "提示" } = this.props;
		return (
			<BasicModal
				visible={visible}
				handleVisible={handleVisible}
				// header={<Text style={styles.modalHeader}>{title}</Text>}
				customStyle={{
					width: width - 100,
					borderRadius: 10,
					backgroundColor: Colors.white,
					padding: 0
				}}
			>
				<View style={{ alignItems: "center" }}>
					<View style={{ height: 80, justifyContent: "center" }}>
						<Text style={styles.modalRemindContent}>确认退出当前账号</Text>
					</View>
					<View style={styles.modalFooter}>
						<TouchableOpacity style={styles.operation} onPress={handleVisible}>
							<Text style={styles.operationText}>取消</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.operation, { borderLeftWidth: 1, borderLeftColor: Colors.tintGray }]}
							onPress={confirm}
						>
							<Text style={[styles.operationText, { color: Colors.theme }]}>确定</Text>
						</TouchableOpacity>
					</View>
				</View>
			</BasicModal>
		);
	}
}

const styles = StyleSheet.create({
	modalHeader: {
		fontSize: 20,
		fontWeight: "500",
		color: Colors.primaryFont
	},
	modalRemindContent: {
		fontSize: 16,
		color: Colors.black
	},
	modalFooter: {
		borderTopWidth: 1,
		borderTopColor: Colors.tintGray,
		flexDirection: "row"
	},
	operation: {
		paddingVertical: 15,
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	operationText: {
		fontSize: 15,
		fontWeight: "400",
		color: Colors.primaryFont
	}
});

export default SignOutModal;
