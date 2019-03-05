/*
 * @Author: Gaoxuan
 * @Date:   2019-03-04 11:12:55
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

import { Colors } from '../../constants';
import { Screen, Avatar, DivisionLine, Button, LoadingMore, ContentEnd, BlankContent } from '../../components';

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
								<Button
									name={'关 注'}
									outline
									style={styles.button}
									textColor={Colors.white}
									fontSize={15}
									handler={() => {}}
								/>
							</View>
							<View style={styles.headerUser}>
								<View style={styles.row}>
									<Avatar
										uri={data.user.avatar}
										size={68}
										borderStyle={{
											borderWidth: 2,
											borderColor: Colors.white
										}}
									/>
									<Text style={styles.levelText}>
										<Text style={{ fontSize: 12 }}>LV.</Text>
										{data.user.level.level}
									</Text>
								</View>
								<Text style={styles.nameText}>{data.user.name}</Text>
								<Text style={styles.countText}>答题共99999次/出题被答88888次</Text>
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
													paddingVertical: 10,
													paddingHorizontal: 15,
													borderBottomWidth: 0.5,
													borderBottomColor: Colors.lightBorder
												}}
											>
												<Text style={{ fontSize: 15, color: Colors.black }}>
													{item.description}
												</Text>
												<View
													style={{
														flexDirection: 'row',
														justifyContent: 'space-between',
														paddingTop: 10
													}}
												>
													<Text style={{ color: Colors.theme }}>#{item.category.name}</Text>
													<Text style={{ color: Colors.grey }}>共{item.count}人答过</Text>
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
		height: 80,
		justifyContent: 'flex-end',
		alignItems: 'flex-end'
	},
	button: {
		borderRadius: 5,
		paddingVertical: 3,
		paddingHorizontal: 15,
		borderWidth: 1,
		marginRight: 10,
		marginBottom: 5,
		borderColor: Colors.white
	},
	headerUser: {
		marginTop: -48,
		marginLeft: 30,
		paddingBottom: 15
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	levelText: {
		color: Colors.white,
		paddingHorizontal: 10,
		fontWeight: '600'
	},
	nameText: {
		fontSize: 16,
		fontWeight: '200',
		paddingVertical: 10,
		color: Colors.primaryFont
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
