import React, { Component } from "react";
import { StyleSheet, View, Image, FlatList, Text } from "react-native";

import { DivisionLine, TabTop } from "../../components/Universal";
import Screen from "../Screen";
import { Colors } from "../../constants";

import { connect } from "react-redux";
import actions from "../../store/actions";

import { TransactionsQuery } from "../../graphql/withdraws.graphql";
import { Query } from "react-apollo";

class WithdrawsLogScreen extends Component {
	render() {
		const { log, navigation } = this.props;
		const { user } = navigation.state.params;
		return (
			<Screen>
				<DivisionLine height={10} />
				<View style={styles.top}>
					<View style={styles.topLeft}>
						<Text style={{ fontSize: 16 }}>剩余智慧点</Text>
						<Text style={{ fontSize: 16, fontWeight: "600" }}>{user.gold}</Text>
					</View>
					<View style={styles.topRight}>
						<Text style={{ fontSize: 16 }}>累计提现</Text>
						<Text style={{ fontSize: 16, fontWeight: "600" }}>￥326</Text>
					</View>
				</View>
				<DivisionLine height={10} />
				<Query query={TransactionsQuery}>
					{({ data, error, loading, fetch, fetchMore }) => {
						if (error) return null;
						if (!(data && data.transactions)) return null;
						return (
							<FlatList
								data={data.transactions}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item, index }) => {
									return (
										<View style={styles.item}>
											<Text style={{ fontSize: 15 }}>{item.created_at}</Text>
											<Text style={{ fontSize: 15 }}>￥{item.amount}</Text>
											{item.status == -1 && (
												<Text
													style={{
														color: Colors.red,
														fontSize: 15
													}}
												>
													提现失败
												</Text>
											)}
											{item.status == 1 && (
												<Text
													style={{
														color: Colors.weixin,
														fontSize: 15
													}}
												>
													提现成功
												</Text>
											)}
											{item.status == 0 && (
												<Text
													style={{
														color: Colors.them,
														fontSize: 15
													}}
												>
													待处理
												</Text>
											)}
										</View>
									);
								}}
							/>
						);
					}}
				</Query>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	top: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 20
	},
	topLeft: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-between",
		height: 50,
		borderRightWidth: 1,
		borderRightColor: "#969696"
	},
	topRight: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-between",
		height: 50
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 15,
		borderTopColor: Colors.lightBorder,
		borderTopWidth: 1,
		paddingHorizontal: 15
	}
});

export default connect(store => {
	return {
		log: store.users.log
	};
})(WithdrawsLogScreen);
