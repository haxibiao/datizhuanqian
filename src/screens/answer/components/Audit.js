/*
 * @flow
 * created by wyk made in 2019-04-09 10:47:03
 */
/*
 * @flow
 * created by wyk made in 2019-04-09 10:47:03
 */
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Animated, Image } from 'react-native';
import { TouchFeedback, Iconfont, Row } from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH, Tools } from '../../../utils';

class Audit extends Component<Props> {
	render() {
		let { status, onSubmitOpinion } = this.props;
		switch (status) {
			case -1:
				source = require('../../../assets/images/audit_reject.png');
				break;
			case 0:
				source = require('../../../assets/images/auditing.png');
				break;
			case 1:
				source = require('../../../assets/images/audited.png');
				break;
		}
		let disabled = status !== 0;
		return (
			<View style={styles.footerBar}>
				<View style={[styles.opinionItem, styles.opinionItemLeft]}>
					<TouchFeedback
						style={[styles.opinionItemButton, disabled && { opacity: 0.7 }]}
						disabled={disabled}
						onPress={() => onSubmitOpinion(-1)}
					>
						<Text style={[styles.opinionText, { color: Theme.errorColor, marginRight: PxFit(4) }]}>
							反对
						</Text>
						<Image source={require('../../../assets/images/oppose.png')} style={styles.opinionImage} />
					</TouchFeedback>
				</View>
				<Image source={source} style={styles.statusImage} />
				<View style={[styles.opinionItem, styles.opinionItemRight]}>
					<TouchFeedback
						style={[styles.opinionItemButton, disabled && { opacity: 0.7 }]}
						disabled={disabled}
						onPress={() => onSubmitOpinion(1)}
					>
						<Image source={require('../../../assets/images/approve.png')} style={styles.opinionImage} />
						<Text style={[styles.opinionText, { marginLeft: PxFit(4) }]}>赞成</Text>
					</TouchFeedback>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	footerBar: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	opinionItem: {
		position: 'absolute',
		height: PxFit(34),
		borderRadius: PxFit(17)
	},
	opinionItemLeft: {
		left: PxFit(-17),
		paddingLeft: PxFit(22),
		paddingRight: PxFit(9),
		backgroundColor: '#f0f0f0'
	},
	opinionItemButton: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	opinionItemRight: {
		right: PxFit(-17),
		paddingRight: PxFit(22),
		paddingLeft: PxFit(9),
		backgroundColor: Theme.correctColor
	},
	opinionText: {
		fontSize: PxFit(14),
		color: '#fff',
		fontWeight: '500',
		letterSpacing: PxFit(4)
	},
	opinionImage: {
		width: PxFit(24),
		height: PxFit(24)
	},
	statusImage: { width: SCREEN_WIDTH / 3, height: SCREEN_WIDTH / 3 }
});

export default Audit;
