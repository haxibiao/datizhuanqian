import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions } from 'react-native';
import BasicModal from './BasicModal';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

class CheckUpdateModal extends Component {
	render() {
		const {
			visible,
			handleVisible,
			confirm,
			title = '提示',
			tips,
			openUrl,
			cancel,
			version,
			description
		} = this.props;
		return (
			<BasicModal
				visible={visible}
				handleVisible={cancel}
				// header={<Text style={styles.modalHeader}>{title}</Text>}
				customStyle={{
					width: width - 60,
					borderRadius: 15,
					backgroundColor: Colors.white,
					padding: 0
				}}
			>
				<View>
					<View style={{ justifyContent: 'center', paddingTop: 25 }}>
						<Text style={styles.modalRemindContent}>{tips}</Text>
						<Text style={{ color: Colors.grey, fontSize: 13, textAlign: 'center', paddingTop: 3 }}>
							版本号：V{version}
						</Text>
					</View>
					<View style={{ paddingBottom: 20, paddingHorizontal: 20 }}>
						<Text style={{ fontSize: 14, color: Colors.primaryFont, paddingTop: 10, lineHeight: 22 }}>
							更新提示：
						</Text>
						<Text style={{ fontSize: 14, color: Colors.primaryFont, lineHeight: 22 }}>{description}</Text>
					</View>

					<View style={styles.modalFooter}>
						<TouchableOpacity style={styles.operation} onPress={cancel}>
							<Text style={styles.operationText}>以后再说</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.operation, { borderLeftColor: Colors.lightBorder, borderLeftWidth: 0.5 }]}
							onPress={confirm}
						>
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
		fontSize: 18,
		color: Colors.black,
		paddingHorizontal: 15,
		textAlign: 'center',
		lineHeight: 20,
		fontWeight: '500'
	},
	modalFooter: {
		borderTopWidth: 0.5,
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
		color: Colors.grey
	}
});

export default CheckUpdateModal;
