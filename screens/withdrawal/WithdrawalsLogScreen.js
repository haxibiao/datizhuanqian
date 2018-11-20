import React, { Component } from "react";
import { StyleSheet, View, Image, FlatList, Text } from "react-native";

import { DivisionLine, TabTop } from "../../components/Universal";
import Screen from "../Screen";
import { Colors } from "../../constants";

import { connect } from "react-redux";
import actions from "../../store/actions";

class WithdrawalsLogScreen extends Component {
	render() {
		const { log } = this.props;
		return (
			<Screen>
				<DivisionLine height={10} />
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						paddingVertical: 20
					}}
				>
					<View
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "space-between",
							height: 50,
							borderRightWidth: 1,
							borderRightColor: "#969696"
						}}
					>
						<Text style={{ fontSize: 16 }}>剩余智慧点</Text>
						<Text style={{ fontSize: 16, fontWeight: "600" }}>1326</Text>
					</View>
					<View style={{ flex: 1, alignItems: "center", justifyContent: "space-between", height: 50 }}>
						<Text style={{ fontSize: 16 }}>累计提现</Text>
						<Text style={{ fontSize: 16, fontWeight: "600" }}>￥326</Text>
					</View>
				</View>
				<DivisionLine height={10} />
				<FlatList
					data={log}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item, index }) => {
						return (
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
									paddingVertical: 15,
									borderTopColor: Colors.lightBorder,
									borderTopWidth: 1,
									paddingHorizontal: 15
								}}
							>
								<Text style={{ fontSize: 15 }}>{item.time_ago}</Text>
								<Text style={{ fontSize: 15 }}>￥{item.money}</Text>
								<Text style={{ color: item.status ? Colors.weixin : "#f00", fontSize: 15 }}>
									{item.status ? "已到账" : "处理中"}
								</Text>
							</View>
						);
					}}
					// ListHeaderComponent={() => {
					// 	return (
					// 		<View
					// 			style={{
					// 				flexDirection: "row",
					// 				alignItems: "center",
					// 				justifyContent: "space-between",
					// 				paddingHorizontal: 15
					// 			}}
					// 		>
					// 			<Text>序号</Text>
					// 			<Text>申请时间</Text>
					// 			<Text>提现金额</Text>
					// 			<Text>状态</Text>
					// 		</View>
					// 	);
					// }}
				/>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({});

export default connect(store => {
	return {
		log: store.user.log
	};
})(WithdrawalsLogScreen);
