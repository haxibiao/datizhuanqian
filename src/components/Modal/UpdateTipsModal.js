import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions } from 'react-native';
import BasicModal from './BasicModal';

import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

class UpdateTipsModal extends Component {
	render() {
		const { visible, handleVisible, confirm, title = '提示', tips, openUrl } = this.props;
		return (
			<BasicModal
				visible={visible}
				customStyle={{
					width: width - 100,
					borderRadius: 10,
					backgroundColor: Colors.white,
					padding: 0
				}}
				handleVisible={() => {}}
			>
				<View style={{ alignItems: 'center' }}>
					<View style={{ height: 80, justifyContent: 'center' }}>
						<Text style={styles.modalRemindContent}>{tips}</Text>
						<Text style={{ fontSize: 12, color: Colors.grey, paddingTop: 10 }}>
							如遇无法安装，请先卸载老版本
						</Text>
					</View>

					<View style={styles.modalFooter}>
						<TouchableOpacity style={styles.operation} onPress={openUrl}>
							<Text style={[styles.operationText, { color: Colors.theme }]}>立即更新</Text>
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
		fontWeight: '500',
		color: Colors.primaryFont
	},
	modalRemindContent: {
		fontSize: 16,
		color: Colors.black,
		paddingHorizontal: 15,
		textAlign: 'center',
		lineHeight: 20
	},
	modalFooter: {
		borderTopWidth: 1,
		borderTopColor: Colors.tintGray,
		flexDirection: 'row'
	},
	operation: {
		paddingVertical: 15,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	operationText: {
		fontSize: 15,
		fontWeight: '400',
		color: Colors.primaryFont
	}
});

export default UpdateTipsModal;
