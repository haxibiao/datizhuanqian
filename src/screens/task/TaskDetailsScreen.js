import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, ScrollView, TouchableOpacity, Image, Text } from 'react-native';
import { Colors, Config, Divice } from '../../constants';
import { DivisionLine, Button, Iconfont, Screen, Input, ImageViewModal } from '../../components';
import HTML from 'react-native-render-html';

import { TaskQuery } from '../../graphql/task.graphql';
import { Query } from 'react-apollo';

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
			<Screen>
				<Query query={TaskQuery} variables={{ task_id: task_id }}>
					{({ data, error, loading, refetch }) => {
						if (error) return null;
						if (!(data && data.task)) return null;
						let task = data.task;
						return (
							<ScrollView style={{ flex: 1 }}>
								<DivisionLine height={5} />
								<View>
									<View style={styles.header}>
										<View style={styles.headerLeft} />
										<Text style={styles.headerContent}>{task.name}</Text>
									</View>
									<View style={styles.row}>
										<Iconfont name={'zhuanshi'} size={22} color={Colors.theme} />
										<Text style={styles.gold}>
											{task.gold}
											<Text style={{ fontSize: 19 }}>智慧点</Text>
										</Text>
									</View>
									<View style={styles.center}>
										<View style={styles.rowCenter}>
											<Image source={TIME_ICON} style={styles.icon} />
											<Text>2019-01-25截止</Text>
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
											color: Colors.primaryFont
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
				<ImageViewModal
					visible={this.state.imageViewerVisible}
					handleVisible={() => this.setState({ imageViewerVisible: false })}
					imageUrls={this.pictures}
					initImage={this.initImage}
				/>
			</Screen>
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
		backgroundColor: Colors.theme,
		marginRight: 15
	},
	headerContent: {
		color: Colors.primaryFont,
		fontSize: 18
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 5,
		paddingBottom: 20,
		marginHorizontal: 20
	},
	gold: {
		fontSize: 20,
		color: Colors.theme,
		paddingLeft: 5
	},
	center: {
		flexDirection: 'row',
		paddingBottom: 20,
		marginHorizontal: 25,
		justifyContent: 'space-between'
	},
	rowCenter: {
		flexDirection: 'row',
		alignItems: 'center'
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
		borderTopColor: Colors.lightBorder
	}
});

export default TaskDetailsScreen;
