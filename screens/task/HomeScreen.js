import React, { Component } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Text, Dimensions } from "react-native";

import { Button } from "../../components/Control";
import { Header } from "../../components/Header";
import { TabTop, Banner, BlankContent } from "../../components/Universal";
import Screen from "../Screen";
import { Colors, Config, Divice } from "../../constants";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { BoxShadow } from "react-native-shadow";

import TaskItem from "./TaskItem";
import NotLogin from "../withdraws/NotLogin";

const { width, height } = Dimensions.get("window");

const shadowOpt = {
	width: width - 30,
	height: 150,
	color: "#E8E8E8",
	border: 10,
	radius: 10,
	opacity: 0.5,
	x: 0,
	y: 0,
	style: {
		marginHorizontal: 15,
		marginVertical: 15
	}
};

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			counts: props.user,
			login: true
		};
	}
	render() {
		const { counts, login } = this.state;
		return (
			<Screen header>
				<Header
					leftComponent={<Text />}
					customStyle={{
						backgroundColor: Colors.theme,
						borderBottomWidth: 0
					}}
				/>
				<View style={styles.container}>
					<TabTop user={counts} />
					{/*<Banner />*/}
					{login ? (
						<View>
							<BoxShadow
								setting={Object.assign({}, shadowOpt, {
									height: 46 + 72 * 3
								})}
							>
								<View
									style={{
										backgroundColor: Colors.white,
										borderRadius: 10,
										height: 46 + 72 * 3,
										shadowOffset: { width: 5, height: 5 },
										shadowColor: "#E8E8E8",
										shadowOpacity: 0.8,
										shadowRadius: 10
									}}
								>
									<View
										style={{
											marginHorizontal: 15,
											paddingVertical: 15
										}}
									>
										<Text style={{ fontSize: 16, color: Colors.black }}>成长任务</Text>
									</View>
									<TaskItem title={"上传头像"} reword={"+10智慧点"} />
									<TaskItem title={"修改昵称"} reword={"+5智慧点"} />
									<TaskItem title={"完善账户信息"} reword={"+20智慧点"} />
								</View>
							</BoxShadow>

							<BoxShadow
								setting={Object.assign({}, shadowOpt, {
									height: 46 + 72 * 4
								})}
							>
								<View
									style={{
										backgroundColor: Colors.white,
										borderRadius: 10,
										height: 46 + 72 * 4,
										shadowOffset: { width: 5, height: 5 },
										shadowColor: "#E8E8E8",
										shadowOpacity: 0.8,
										shadowRadius: 10
									}}
								>
									<View
										style={{
											marginHorizontal: 15,
											paddingVertical: 15
										}}
									>
										<Text style={{ fontSize: 16, color: Colors.black }}>每日任务</Text>
									</View>
									<TaskItem title={"参与10道答题"} reword={"+20精力点"} status={1} />
									<TaskItem title={"完成5道题目纠错"} reword={"+20精力点"} />
									<TaskItem title={"分享朋友圈"} reword={"+10精力点"} />
									<TaskItem title={"邀请新用户"} reword={"+15精力点"} />
								</View>
							</BoxShadow>
						</View>
					) : (
						<BlankContent text={"暂时还没有任务哦~"} fontSize={14} />
					)}
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFEFC"
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(HomeScreen);
