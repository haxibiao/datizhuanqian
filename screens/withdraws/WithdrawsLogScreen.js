import React, { Component } from "react";
import { StyleSheet, View, Image, FlatList, Text, Dimensions, TouchableOpacity } from "react-native";

import { DivisionLine, TabTop, BlankContent, Loading } from "../../components/Universal";
import Screen from "../Screen";
import { Colors } from "../../constants";

import { connect } from "react-redux";
import actions from "../../store/actions";

import { TransactionsQuery, WithdrawsQuery } from "../../graphql/withdraws.graphql";
import { UserWithdrawQuery } from "../../graphql/user.graphql";
import { Query } from "react-apollo";

const { width, height } = Dimensions.get("window");

class WithdrawsLogScreen extends Component {
	render() {
		const { log, navigation } = this.props;
		const { user } = navigation.state.params;
		return (
			<Screen>
				<Query query={UserWithdrawQuery} variables={{ id: user.id }}>
					{({ data, error, loading, fetch, fetchMore }) => {
						if (error) return null;
						if (!(data && data.user)) return null;
						console.log("data,", data.user);
						return (
							<View style={styles.top}>
								<DivisionLine height={10} />
								<View style={styles.topLeft}>
									<Text style={{ fontSize: 16 }}>剩余智慧点</Text>
									<Text style={{ fontSize: 16, fontWeight: "600" }}>{data.user.gold}</Text>
								</View>
								<View style={styles.topRight}>
									<Text style={{ fontSize: 16 }}>累计成功提现</Text>
									<Text style={{ fontSize: 16, fontWeight: "600" }}>
										￥{data.user.transaction_sum_amount}
									</Text>
								</View>
							</View>
						);
					}}
				</Query>
				<DivisionLine height={10} />
				<Query query={WithdrawsQuery} fetchPolicy="network-only">
					{({ data, error, loading, fetch, fetchMore }) => {
						if (error) return null;
						if (loading) return <Loading />;
						if (!(data && data.withdraws)) return null;
						if (data.withdraws.length < 1)
							return <BlankContent text={"暂无提现记录哦,快去赚取智慧点吧~"} fontSize={14} />;
						return (
							<FlatList
								data={data.withdraws}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item, index }) => {
									return (
										<TouchableOpacity
											style={styles.item}
											disabled={!item.remark}
											onPress={() => {
												navigation.navigate("提现详情", {
													withdraws: item
												});
											}}
										>
											<View
												style={{
													width: ((width - 30) * 4) / 9
												}}
											>
												<Text style={{ fontSize: 15 }}>{item.created_at}</Text>
											</View>
											<View
												style={{
													width: (width - 30) / 9
												}}
											>
												<Text style={{ fontSize: 15 }}>￥{item.amount.toFixed(0)}</Text>
											</View>
											<View style={{ alignItems: "flex-end", width: ((width - 30) * 4) / 9 }}>
												{item.status == -1 && (
													<Text
														style={{
															color: Colors.red,
															fontSize: 15,
															textAlign: "right"
														}}
													>
														提现失败(查看详情)
													</Text>
												)}
												{item.status == 1 && (
													<Text
														style={{
															color: Colors.weixin,
															fontSize: 15,
															textAlign: "right"
														}}
													>
														提现成功
													</Text>
												)}
												{item.status == 0 && (
													<Text
														style={{
															color: Colors.theme,
															fontSize: 15,
															textAlign: "right"
														}}
													>
														待处理
													</Text>
												)}
											</View>
										</TouchableOpacity>
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
