import React, { Component } from "react";
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions } from "react-native";
import BasicModal from "./BasicModal";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
const { width, height } = Dimensions.get("window");

class ModifyNameModal extends Component {
	render() {
		const { modalName, visible, value, handleVisible, changeVaule, submit, placeholder } = this.props;
		return (
			<BasicModal
				visible={visible}
				handleVisible={handleVisible}
				header={<Text style={styles.modalHeader}>{modalName}</Text>}
				customStyle={{
					width: width - 100,
					borderRadius: 5
				}}
			>
				<View style={{ marginTop: 10 }}>
					<TextInput
						words={false}
						underlineColorAndroid="transparent"
						selectionColor={Colors.themeColor}
						style={styles.textInput}
						autoFocus={true}
						placeholder={placeholder}
						placeholderText={Colors.tintFontColor}
						onChangeText={changeVaule}
						defaultValue={value + ""}
						maxLength={8}
					/>
					<View style={styles.modalFooter}>
						<Text style={styles.modalFooterText} onPress={handleVisible}>
							取消
						</Text>
						<Text
							style={[styles.modalFooterText, { marginLeft: 20, color: Colors.theme }]}
							onPress={submit}
						>
							保存
						</Text>
					</View>
				</View>
			</BasicModal>
		);
	}
}

const styles = StyleSheet.create({
	modalHeader: {
		color: Colors.theme
	},
	textInput: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.theme,
		fontSize: 15,
		color: Colors.primaryFont,
		padding: 0,
		paddingBottom: 5
	},
	modalFooter: {
		marginTop: 20,
		flexDirection: "row-reverse"
	},
	modalFooterText: {
		fontSize: 14,
		fontWeight: "400",
		color: Colors.primaryFont,
		padding: 10
	}
});

export default ModifyNameModal;
