import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import { Colors } from '../../constants';

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
						: navigation.navigate('提现详情', {
								withdraw_id: item.id
						  });
				}}
			>
				<View>
					{item.status == -1 && <Text style={{ fontSize: 18, color: Colors.themeRed }}>提现失败</Text>}
					{item.status == 1 && <Text style={{ fontSize: 18, color: Colors.weixin }}>提现成功</Text>}
					{item.status == 0 && <Text style={{ fontSize: 18, color: Colors.theme }}>待处理</Text>}
					<Text style={{ fontSize: 15, color: Colors.grey, paddingTop: 10 }}>{item.created_at}</Text>
				</View>
				<View>
					<Text style={{ fontSize: 26, color: item.status == 1 ? Colors.weixin : Colors.black }}>
						￥{item.amount.toFixed(0)}.00
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 15,
		borderBottomColor: Colors.lightBorder,
		borderBottomWidth: 1,
		paddingHorizontal: 15
	}
});

export default WithdrawsLogItem;
