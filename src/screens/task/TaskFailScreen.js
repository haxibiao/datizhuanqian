import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';

import { TabTop, BlankContent, Header, Screen, DivisionLine, Iconfont } from '../../components';
import { Colors, Config, Divice } from '../../constants';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { UserTaskQuery } from '../../graphql/task.graphql';
import { Query, Mutation } from 'react-apollo';

class TaskFailScreen extends Component {
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
							<Text style={{ fontSize: 15, color: Colors.black }}>继续提交</Text>
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
								<View style={{ height: 150 }}>
									<View style={styles.header}>
										<View style={styles.headerLeft} />
										<Text style={{ color: Colors.themeRed, fontSize: 18 }}>失败原因</Text>
									</View>
									<View style={{ marginLeft: 25, marginTop: 20 }}>
										<Text style={{ fontSize: 16, color: Colors.black }}>
											{data.userTask[0].remark}
										</Text>
									</View>
								</View>
								<View style={{}}>
									<View style={styles.header}>
										<View style={styles.headerLeft} />
										<Text style={styles.headerContent}>提交内容</Text>
									</View>
									<View style={{ marginHorizontal: 25 }}>
										<Text style={{ fontSize: 16, color: Colors.black }}>
											{data.userTask[0].reply_content}
										</Text>
										<View style={{ marginTop: 10 }}>
											{screenshots.map((image, index) => {
												return (
													<Image
														key={index}
														source={{
															uri: image.url
														}}
														style={{ width: Divice.width - 50, height: Divice.width - 50 }}
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
		paddingTop: 20,
		paddingBottom: 10
	},
	headerLeft: {
		height: 22,
		width: 10,
		backgroundColor: Colors.theme,
		marginRight: 15
	},
	headerContent: {
		color: Colors.primaryFont,
		fontSize: 18
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(TaskFailScreen);
