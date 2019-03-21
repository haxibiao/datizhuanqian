/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 13:29:54
 */

import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, ScrollView, TouchableOpacity, Image, Text } from 'react-native';
import { Theme, SCRREN_WIDTH } from '../../utils';
import { Button, Iconfont, PageContainer } from '../../components';

import { TaskQuery } from '../../assets/graphql/task.graphql';
import { Query } from 'react-apollo';

import HTML from 'react-native-render-html';

class TaskDetailsScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imageViewerVisible: false,
			TIME_ICON: require('../../../assets/images/time.png'),
			AUDIT_ICON: require('../../../assets/images/audit.png')
		};
	}

	render() {
		const { navigation } = this.props;
		const { task_id } = navigation.state.params;
		const { TIME_ICON, AUDIT_ICON } = this.state;
		this.imgKey = 0;
		this.pictures = [];
		return (
			<PageContainer title="任务详情">
				<Query query={TaskQuery} variables={{ task_id: task_id }}>
					{({ data, error, loading, refetch }) => {
						if (error) return null;
						if (!(data && data.task)) return null;
						let task = data.task;
						return (
							<ScrollView style={{ flex: 1 }}>
								<View>
									<View style={styles.header}>
										<View style={styles.headerLeft} />
										<Text style={styles.headerContent}>{task.name}</Text>
									</View>
									<View style={styles.row}>
										<Iconfont name={'zhuanshi'} size={40} color={Theme.theme} />
										<Text style={styles.gold}>{task.gold}</Text>
									</View>
									<View style={styles.center}>
										<View style={styles.rowCenter}>
											<Image source={TIME_ICON} style={styles.icon} />
											<Text>{task.end_at} 前完成</Text>
										</View>
										<View style={styles.rowCenter}>
											<Image source={AUDIT_ICON} style={styles.icon} />
											<Text>预计审核时间72小时</Text>
										</View>
									</View>
								</View>
								<View style={styles.bottom}>
									<View style={styles.headerLeft} />
									<Text style={styles.headerContent}>任务简介</Text>
								</View>
								<View style={styles.html}>
									<HTML
										html={task.details}
										imagesMaxWidth={Divice.width - 30}
										baseFontStyle={{
											fontSize: 15,
											color: Theme.primaryFont
										}}
										renderers={{
											img: (htmlAttribs, children, passProps) => {
												this.pictures.push({
													url: htmlAttribs.src
												});
												let index = this.imgKey;
												this.imgKey++;
												let width = htmlAttribs.width
													? parseInt(htmlAttribs.width)
													: Divice.width - 30;
												let height = htmlAttribs.height
													? parseInt(htmlAttribs.height)
													: Divice.width - 30;
												let size = imageSize({ width, height });

												return (
													<TouchableOpacity
														activeOpacity={1}
														key={index}
														onPress={() => {
															this.initImage = index;
															this.setState({
																imageViewerVisible: true
															});
														}}
														style={{ alignItems: 'center' }}
													>
														<Image
															source={{ uri: htmlAttribs.src }}
															style={{
																width: size.width,
																height: size.height,
																resizeMode: 'cover'
															}}
															{...passProps}
														/>
													</TouchableOpacity>
												);
											}
										}}
									/>
								</View>
							</ScrollView>
						);
					}}
				</Query>
				{/*<ImageViewModal
					visible={this.state.imageViewerVisible}
					handleVisible={() => this.setState({ imageViewerVisible: false })}
					imageUrls={this.pictures}
					initImage={this.initImage}
				/>*/}
			</PageContainer>
		);
	}
}

function imageSize({ width, height }) {
	var size = {};
	if (width > Divice.width) {
		size.width = Divice.width - 30;
		size.height = ((Divice.width - 30) * height) / width;
	} else {
		size = { width, height };
	}
	return size;
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 20,
		paddingBottom: 10
	},
	headerLeft: {
		height: 22,
		width: 10,
		backgroundColor: Theme.theme,
		marginRight: 15
	},
	headerContent: {
		color: Theme.primaryFont,
		fontSize: 18
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 20
	},
	gold: {
		fontSize: 42,
		color: Theme.theme,
		paddingLeft: 5
	},
	center: {
		paddingBottom: 20,
		marginHorizontal: 25,
		justifyContent: 'space-between'
	},
	rowCenter: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 5
	},
	icon: {
		height: 15,
		width: 15,
		marginRight: 10
	},
	bottom: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 20
	},
	html: {
		marginHorizontal: 15,
		borderTopWidth: 1,
		borderTopColor: Theme.lightBorder
	}
});

export default TaskDetailsScreen;
