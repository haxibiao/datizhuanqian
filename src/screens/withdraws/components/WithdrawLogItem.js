/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 14:01:51
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import { Theme, PxFit } from '../../../utils';

class WithdrawsLogItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, item } = this.props;
		return (
			<TouchableOpacity
				style={styles.item}
				activeOpacity={0.7}
				onPress={() => {
					item.status == 0
						? null
						: navigation.navigate('withdrawLogDetails', {
								withdraw_id: item.id
						  });
				}}
			>
				<View>
					{this._showStatus(item.status)}
					<Text style={{ fontSize: PxFit(15), color: Theme.grey, paddingTop: PxFit(10) }}>
						{item.created_at}
					</Text>
				</View>
				<View>
					<Text style={{ fontSize: PxFit(26), color: item.status == 1 ? Theme.weixin : Theme.black }}>
						￥{item.amount.toFixed(0)}.00
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
	_showStatus = status => {
		switch (status) {
			case -1:
				return <Text style={{ fontSize: PxFit(18), color: Theme.secondaryColor }}>提现失败</Text>;
				break;
			case 1:
				return <Text style={{ fontSize: PxFit(18), color: Theme.weixin }}>提现成功</Text>;
				break;
			case 0:
				return <Text style={{ fontSize: PxFit(18), color: Theme.primaryColor }}>待处理</Text>;
				break;
		}
	};
}

const styles = StyleSheet.create({
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: PxFit(15),
		borderBottomColor: Theme.lightBorder,
		borderBottomWidth: PxFit(1),
		paddingHorizontal: PxFit(15)
	}
});

export default WithdrawsLogItem;
