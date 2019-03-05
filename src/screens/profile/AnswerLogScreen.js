/*
 * @flow
 * created by wyk made in 2019-02-15 10:14:12
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	Platform,
	View,
	FlatList,
	Image,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	RefreshControl
} from 'react-native';
import {
	DivisionLine,
	Header,
	Screen,
	Iconfont,
	LoadingError,
	Loading,
	BlankContent,
	LoadingMore,
	ContentEnd
} from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { answerHistoriesQuery } from '../../graphql/user.graphql';
import { compose, Query, Mutation, graphql } from 'react-apollo';

class AnswerItem extends Component {
	static defaultProps = {
		answer: {}
	};

	render() {
		let {
			answer: { question, correct_count },
			navigation
		} = this.props;
		let { category, image, description } = question;
		console.log('image', image);
		return (
			<TouchableWithoutFeedback onPress={() => navigation.navigate('题目详情', { question })}>
				<View style={styles.answerItem}>
					<View style={styles.content}>
						<View style={{ flex: 1 }}>
							<Text style={styles.subjectText} numberOfLines={3}>
								{description}
							</Text>
						</View>
						<TouchableOpacity
							style={{ alignItems: 'flex-end', marginTop: 20, paddingBottom: 10 }}
							onPress={() => navigation.navigate('题目纠错', { question })}
						>
							<Text style={{ fontSize: 13, color: Colors.skyBlue }}>题目纠错</Text>
						</TouchableOpacity>
					</View>
					<View>
						<View style={styles.answer}>
							<Text
								style={[styles.answerText, { color: correct_count > 0 ? Colors.skyBlue : Colors.red }]}
							>
								{correct_count > 0 ? '您答对了' : '您答错了'}
							</Text>
							<Iconfont
								name={correct_count > 0 ? 'correct' : 'close'}
								size={20}
								color={correct_count > 0 ? Colors.skyBlue : Colors.red}
							/>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

class AnswerLogScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true
		};
	}

	render() {
		let { navigation } = this.props;
		return (
			<Screen header>
				<Header
					customStyle={{
						backgroundColor: Colors.theme,
						borderBottomWidth: 0,
						borderBottomColor: 'transparent'
					}}
				/>
				<View style={styles.container}>
					<Query query={answerHistoriesQuery} fetchPolicy="network-only">
						{({ data, loading, error, refetch, fetchMore }) => {
							if (error) return <LoadingError reload={() => refetch()} />;
							if (loading) return <Loading />;
							if (
								!(
									data &&
									data.user &&
									data.user.answerHistories &&
									data.user.answerHistories.length > 0
								)
							) {
								return <BlankContent />;
							}
							return (
								<FlatList
									data={data.user.answerHistories}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index }) => (
										<AnswerItem answer={item} navigation={navigation} />
									)}
									ItemSeparatorComponent={() => <DivisionLine />}
									refreshControl={
										<RefreshControl
											refreshing={loading}
											onRefresh={refetch}
											colors={[Colors.theme]}
										/>
									}
									onEndReachedThreshold={0.3}
									onEndReached={() => {
										if (data.user.answerHistories) {
											fetchMore({
												variables: {
													offset: data.user.answerHistories.length
												},
												updateQuery: (prev, { fetchMoreResult }) => {
													if (
														!(
															fetchMoreResult &&
															fetchMoreResult.user &&
															fetchMoreResult.user.answerHistories &&
															fetchMoreResult.user.answerHistories.length > 0
														)
													) {
														this.setState({
															fetchingMore: false
														});
														return prev;
													}
													return Object.assign({}, prev, {
														user: Object.assign({}, prev.user, {
															answerHistories: [
																...prev.user.answerHistories,
																...fetchMoreResult.user.answerHistories
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
										return this.state.fetchingMore ? <LoadingMore /> : <ContentEnd />;
									}}
								/>
							);
						}}
					</Query>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	answerItem: {
		padding: 15,
		backgroundColor: '#fff'
	},
	categoryLabel: {
		alignSelf: 'auto',
		paddingHorizontal: 4,
		paddingVertical: 2,
		borderWidth: 0.5,
		borderRadius: 3,
		fontSize: 14,
		color: Colors.theme,
		borderColor: Colors.theme
	},
	content: {
		borderBottomWidth: 0.5,
		marginBottom: 10,
		borderColor: '#f0f0f0'
	},
	subjectText: {
		fontSize: 16,
		lineHeight: 20,
		color: Colors.primaryFont
	},
	image: {
		width: 60,
		height: 60,
		borderRadius: 5,
		resizeMode: 'cover'
	},
	answer: {
		marginTop: 5,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	answerText: {
		fontSize: 13,
		color: Colors.primaryFont
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		login: store.users.login
	};
})(AnswerLogScreen);
