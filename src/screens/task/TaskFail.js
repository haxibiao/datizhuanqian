/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 13:26:06
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';

import { TabTop, BlankContent, Header, Screen, DivisionLine, Iconfont } from '../../components';
import { Theme, SCREEN_WIDTH, PxFit } from '../../utils';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { UserTaskQuery } from '../../assets/graphql/task.graphql';
import { Query, Mutation } from 'react-apollo';

class TaskFail extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { navigation, user } = this.props;
		const { task_id } = navigation.state.params;
		return (
			<ScrollView style={styles.container}>
				<DivisionLine height={5} />
				<Header
					headerRight={
						<TouchableOpacity
							onPress={() => {
								navigation.navigate('提交任务', {
									again: true,
									task_id: task_id
								});
							}}
						>
							<Text style={{ fontSize: PxFit(15), color: Theme.black }}>继续提交</Text>
						</TouchableOpacity>
					}
				/>
				<Query query={UserTaskQuery} variables={{ id: 10 }}>
					{({ data, error, loading }) => {
						if (error) return null;
						if (loading) return null;
						if (!(data && data.userTask)) return null;
						let screenshots = JSON.parse(data.userTask[0].screenshots);
						return (
							<View>
								<View style={{ height: PxFit(150) }}>
									<View style={styles.header}>
										<View style={styles.headerLeft} />
										<Text style={{ color: Theme.themeRed, fontSize: PxFit(18) }}>失败原因</Text>
									</View>
									<View style={{ marginLeft: PxFit(25), marginTop: PxFit(20) }}>
										<Text style={{ fontSize: PxFit(16), color: Theme.black }}>
											{data.userTask[0].remark ? data.userTask[0].remark : '请阅读任务详情'}
										</Text>
									</View>
								</View>
								<View style={{}}>
									<View style={styles.header}>
										<View style={styles.headerLeft} />
										<Text style={styles.headerContent}>提交内容</Text>
									</View>
									<View style={{ marginHorizontal: PxFit(25) }}>
										<Text style={{ fontSize: PxFit(16), color: Theme.black }}>
											{data.userTask[0].reply_content}
										</Text>
										<View style={{ marginTop: PxFit(10) }}>
											{screenshots.map((image, index) => {
												return (
													<Image
														key={index}
														source={{
															uri: image.url
														}}
														style={{
															width: SCREEN_WIDTH - PxFit(50),
															height: SCREEN_WIDTH - PxFit(50)
														}}
													/>
												);
											})}
										</View>
									</View>
								</View>
							</View>
						);
					}}
				</Query>
			</ScrollView>
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
		paddingTop: PxFit(20),
		paddingBottom: PxFit(10)
	},
	headerLeft: {
		height: PxFit(22),
		width: PxFit(10),
		backgroundColor: Theme.theme,
		marginRight: PxFit(15)
	},
	headerContent: {
		color: Theme.primaryFont,
		fontSize: PxFit(18)
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(TaskFail);
