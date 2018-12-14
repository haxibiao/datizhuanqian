import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from "react-native";
import { Header } from "../../components/Header";
import { Button } from "../../components/Control";
import { DivisionLine, ErrorBoundary } from "../../components/Universal";
import { Colors, Config, Divice, Methods } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

import Screen from "../Screen";

import { ReceiveTaskMutation, CompleteTaskMutation, TasksQuery } from "../../graphql/task.graphql";
import { Mutation } from "react-apollo";

class TaskItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let { title, navigation, reword, status, handler, task_id, type } = this.props;
		return (
			<View style={styles.container}>
				<View>
					<Text style={{ color: "#3c3c3c", fontSize: 15 }}>{title}</Text>
					<Text style={{ color: Colors.tintFont, fontSize: 13, paddingTop: 10, fontWeight: "200" }}>
						奖励 <Text style={{ color: Colors.theme }}>{reword}</Text>
					</Text>
				</View>
				{status == 2 && (
					<Button
						name={"已完成"}
						outline
						style={{
							borderRadius: 45,
							// paddingHorizontal: 15,
							height: 32,
							width: 84,
							borderWidth: 1,
							borderColor: Colors.grey
						}}
						theme={Colors.tintFont}
						textColor={Colors.tintFont}
						fontSize={13}
					/>
				)}
				{status == 1 && (
					<Mutation mutation={CompleteTaskMutation}>
						{completeTask => {
							return (
								<Button
									name={"领取奖励"}
									outline
									style={{
										borderRadius: 45,
										// paddingHorizontal: 15,
										height: 32,
										width: 84,
										borderWidth: 1,
										borderColor: Colors.theme
									}}
									textColor={Colors.theme}
									fontSize={13}
									handler={async () => {
										let result = {};
										try {
											result = await completeTask({
												variables: {
													task_id: task_id
												},
												refetchQueries: () => [
													{
														query: TasksQuery,
														variables: { type: type }
													}
												]
											});
										} catch (error) {
											result.errors = error;
										}
										if (result && result.errors) {
											Methods.toast("领取失败,请检查你的网络哦~", -80);
										} else {
											if (result.data.completeTask == 1) {
												Methods.toast("领取成功", -80);
											} else {
												Methods.toast("已经领取奖励了哦~", -80);
											}
										}
									}}
								/>
							);
						}}
					</Mutation>
				)}
				{status == 0 && (
					<Button
						name={"做任务"}
						outline
						style={{
							borderRadius: 45,
							// paddingHorizontal: 15,
							height: 32,
							width: 84,
							borderWidth: 1,
							borderColor: Colors.theme
						}}
						textColor={Colors.theme}
						fontSize={13}
						handler={handler}
					/>
				)}
				{status == -1 && (
					<Mutation mutation={ReceiveTaskMutation}>
						{receiveTask => {
							return (
								<Button
									name={"领取"}
									outline
									style={{
										borderRadius: 45,
										// paddingHorizontal: 15,
										height: 32,
										width: 84,
										borderWidth: 1,
										borderColor: Colors.theme
									}}
									textColor={Colors.theme}
									fontSize={13}
									handler={async () => {
										let result = {};
										try {
											result = await receiveTask({
												variables: {
													task_id: task_id
												},
												refetchQueries: () => [
													{
														query: TasksQuery,
														variables: { type: type }
													}
												]
											});
										} catch (error) {
											result.errors = error;
										}
										if (result && result.errors) {
											Methods.toast("领取失败,请检查你的网络哦~", -80);
										} else {
											if (result.data.receiveTask == 1) {
												Methods.toast("领取成功", -80);
											} else {
												Methods.toast("已经领取该任务了哦~", -80);
											}
										}
									}}
								/>
							);
						}}
					</Mutation>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 15,
		paddingVertical: 15,
		borderTopWidth: 1,
		borderTopColor: Colors.lightBorder,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: 72
	}
});

export default TaskItem;
