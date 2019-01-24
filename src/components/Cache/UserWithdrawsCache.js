import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Divice } from '../../constants';
import { Methods } from '../../helpers';

import DivisionLine from '../Universal/DivisionLine';
import WithdrawsTips from '../Universal/WithdrawsTips';
import Button from '../Control/Button';
import { Storage, ItemKeys } from '../../store/localStorage';

class UserWithdrawsCache extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userCache: ''
		};
	}

	async componentWillMount() {
		this.setState({
			userCache: await Storage.getItem(ItemKeys.userCache)
		});
		console.log('userCache', await Storage.getItem(ItemKeys.userCache));
	}

	render() {
		const { navigation, refetch, login, luckyMoney } = this.props;

		let { userCache } = this.state;
		if (!userCache) return null;
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={{ width: Divice.width / 2 }}>
						<Text style={styles.gold}>{userCache.gold}</Text>
						<Text style={styles.type}>智慧点</Text>
					</View>
					<View style={{ width: Divice.width / 2 }}>
						<Text style={styles.gold}>
							{userCache.wallet && userCache.wallet.available_balance
								? `${userCache.wallet.available_balance}.00`
								: '0.00'}
						</Text>
						<Text style={styles.type}>余额（元）</Text>
					</View>
				</View>

				<DivisionLine height={10} />
				<View style={styles.main}>
					<View style={styles.center}>
						{luckyMoney.map((luckyMoney, index) => {
							return (
								<TouchableOpacity
									style={styles.item}
									onPress={() => {
										Methods.toast('请连接网络', -80);
									}}
									key={index}
								>
									<Text style={styles.content}>
										提现<Text style={{ color: Colors.themeRed }}>{luckyMoney.value}元</Text>
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
					{userCache.pay_account && (
						<View style={styles.footer}>
							<Text style={styles.tips}>当前汇率：600智慧点=1元</Text>
							<Button
								name={'查看提现日志'}
								style={{
									height: 38,
									borderRadius: 19,
									width: Divice.width - 80
								}}
								handler={() =>
									navigation.navigate('提现日志', {
										user: userCache
									})
								}
								theme={Colors.theme}
								fontSize={14}
							/>
						</View>
					)}
				</View>
				{userCache.pay_account ? null : <WithdrawsTips navigation={navigation} />}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFEFC'
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: 20,
		paddingBottom: 30
	},
	gold: {
		color: Colors.themeRed,
		fontSize: 44,
		paddingBottom: 2,
		textAlign: 'center'
	},
	type: {
		color: Colors.grey,
		fontSize: 13,
		textAlign: 'center'
	},
	main: {
		justifyContent: 'space-between',
		flex: 1
	},
	center: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: 15,
		justifyContent: 'space-between'
	},
	item: {
		paddingVertical: 25,
		width: (Divice.width - 44) / 2,
		borderColor: '#E0E0E0',
		borderWidth: 0.5,
		alignItems: 'center',
		marginTop: 20,
		borderRadius: 5
	},
	content: {
		fontSize: 16,
		color: Colors.black
	},
	footer: {
		alignItems: 'center',
		paddingBottom: 30
	},
	tips: {
		fontSize: 15,
		color: '#363636',
		paddingVertical: 10,
		lineHeight: 18
	}
});

export default UserWithdrawsCache;
