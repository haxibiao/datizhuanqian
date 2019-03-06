/*
 * @Author: Gaoxuan
 * @Date:   2019-03-04 11:12:55
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

import { Colors, Divice } from '../../constants';
import {
	Screen,
	Avatar,
	DivisionLine,
	Button,
	LoadingMore,
	ContentEnd,
	BlankContent,
	Iconfont
} from '../../components';

import { UserInfoQuery } from '../../graphql/user.graphql';
import { Query } from 'react-apollo';

class Default extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true
		};
	}
	render() {
		const { navigation } = this.props;
		const { user_id } = navigation.state.params;
		let { fetchingMore } = this.state;
		return (
			<Query query={UserInfoQuery} variables={{ id: user_id }}>
				{({ data, loading, error, refetch, fetchMore }) => {
					if (error) return null;
					if (loading) return null;
					if (!(data && data.user)) return null;
					return (
						<Screen
							customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }}
							routeName={'  '}
							iconColor={Colors.white}
						>
							<View style={styles.header}>
								<View style={styles.headerUser}>
									<View style={styles.row}>
										<Avatar
											uri={data.user.avatar}
											size={64}
											borderStyle={{
												borderWidth: 2,
												borderColor: Colors.white
											}}
										/>
										<View style={{ marginLeft: 15 }}>
											<View style={{ flexDirection: 'row', alignItems: 'center' }}>
												<Text style={styles.nameText} numberOfLines={1}>
													{data.user.name}
												</Text>
												<Iconfont
													name={data.user.gender ? 'woman' : 'man'}
													style={{ marginBottom: 3 }}
													size={16}
													color={data.user.gender ? '#FF6EB4' : Colors.blue}
												/>
											</View>
											<Text style={styles.levelText}>
												等级 Lv.{data.user.level.level} | 粉丝 233
											</Text>
										</View>
									</View>
									<Button
										name={'关 注'}
										outline
										style={styles.button}
										textColor={Colors.white}
										fontSize={15}
										handler={() => {}}
									/>
								</View>
								<Text style={{ paddingVertical: 20, paddingLeft: 20 }}>知识就是财富，知识就是金钱</Text>
							</View>

							<DivisionLine height={10} />
							<View style={{ flex: 1 }}>
								<View style={styles.footer}>
									<Text style={styles.footerTitle}>他的出题</Text>
								</View>
								{data.user.questions.length > 0 ? (
									<FlatList
										data={data.user.questions}
										// style={{ flex: 1 }}
										keyExtractor={(item, index) => index.toString()}
										renderItem={({ item, index }) => (
											<View
												style={{
													paddingVertical: 12,
													paddingHorizontal: 15,
													borderBottomWidth: 0.5,
													borderBottomColor: Colors.lightBorder
												}}
											>
												<Text style={{ fontSize: 14, color: Colors.black }}>
													{item.description}
												</Text>
												<View
													style={{
														flexDirection: 'row',
														justifyContent: 'space-between',
														paddingTop: 16
													}}
												>
													<Text style={{ color: Colors.theme, fontSize: 13 }}>
														#{item.category.name}
													</Text>
													<Text style={{ color: Colors.grey, fontSize: 13 }}>
														{item.count}人答过
													</Text>
												</View>
											</View>
										)}
										onEndReachedThreshold={0.3}
										onEndReached={() => {
											if (data.user.questions) {
												fetchMore({
													variables: {
														offset: data.user.questions.length
													},
													updateQuery: (prev, { fetchMoreResult }) => {
														if (
															!(
																fetchMoreResult &&
																fetchMoreResult.user.questions &&
																fetchMoreResult.user.questions.length > 0
															)
														) {
															this.setState({
																fetchingMore: false
															});
															return prev;
														}
														return Object.assign({}, prev, {
															user: Object.assign({}, prev.user, {
																questions: [
																	...prev.user.questions,
																	...fetchMoreResult.user.questions
																]
															})
														});
													}
												});
											} else {
												this.setState({
													fetchingMore: false
												});
											}
										}}
										ListFooterComponent={() => {
											return this.state.fetchingMore ? (
												<LoadingMore />
											) : (
												<ContentEnd content={'没有更多题目了~'} />
											);
										}}
									/>
								) : (
									<BlankContent text={'Ta还没有出过题哦，快去叫他出题吧'} fontSize={14} />
								)}
							</View>
						</Screen>
					);
				}}
			</Query>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: Colors.theme,
		paddingHorizontal: 35
	},
	button: {
		borderRadius: 5,
		borderWidth: 1,
		height: 26,
		width: 68,
		borderColor: Colors.white
	},
	headerUser: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: 5
	},
	row: {
		width: (Divice.width * 4) / 11 - 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	levelText: {
		color: Colors.white,
		// fontWeight: '500',
		fontSize: 12
	},
	nameText: {
		fontSize: 15,
		fontWeight: '200',
		paddingBottom: 5,
		paddingRight: 3,
		color: Colors.orange
	},
	count: {
		color: Colors.grey,
		fontWeight: '200',
		paddingBottom: 10
	},
	footer: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder,
		paddingHorizontal: 15,
		paddingVertical: 12
	},
	footerTitle: {
		color: Colors.primaryFont,
		fontSize: 16,
		fontWeight: '500'
	}
});

export default Default;
