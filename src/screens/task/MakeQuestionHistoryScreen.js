/*
 * @flow
 * created by wyk made in 2019-02-13 10:33:52
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
import { mySubmitQuestionHistoryQuery } from '../../graphql/task.graphql';
import { compose, Query, Mutation, graphql } from 'react-apollo';

class QuestionItem extends Component {
	static defaultProps = {
		question: {}
	};

	submitStatus(submit) {
		console.log('submit', submit);
		switch (submit) {
			case '-2':
				this.Submit = { text: '被驳回', color: Colors.red };
				break;
			case '1':
				this.Submit = { text: '已入库', color: Colors.skyBlue };
				break;
			default:
				this.Submit = { text: '审核中', color: Colors.grey };
		}
	}

	render() {
		let { question, navigation } = this.props;
		let { category, image, description, created_at, count, submit } = question;
		this.submitStatus(submit);
		return (
			<TouchableWithoutFeedback onPress={() => navigation.navigate('题目详情', { question })}>
				<View style={styles.questionItem}>
					<View style={styles.questionStatus}>
						<Text style={{ fontSize: 14, color: this.Submit.color }}>{this.Submit.text}</Text>
						<Text style={styles.categoryText}>#{category.name}</Text>
					</View>
					<View style={{ paddingHorizontal: 15 }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
							<View style={{ flex: 1 }}>
								<Text style={styles.subjectText} numberOfLines={3}>
									{description}
								</Text>
							</View>
							{image && <Image source={{ uri: image.path }} style={styles.image} />}
						</View>
						<View style={styles.meta}>
							<Text style={styles.metaText}>{created_at}</Text>
							<Text style={styles.metaText}>{'  共' + count + '人答过'}</Text>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

class MakeQuestionHistoryScreen extends Component {
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
					<Query query={mySubmitQuestionHistoryQuery} fetchPolicy="network-only">
						{({ data, loading, error, refetch, fetchMore }) => {
							if (error) return <LoadingError reload={() => refetch()} />;
							if (loading) return <Loading />;
							if (!(data && data.user && data.user.questions && data.user.questions.length > 0)) {
								return <BlankContent />;
							}
							return (
								<FlatList
									data={data.user.questions}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index }) => (
										<QuestionItem question={item} navigation={navigation} />
									)}
									refreshControl={
										<RefreshControl
											refreshing={loading}
											onRefresh={refetch}
											colors={[Colors.theme]}
										/>
									}
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
															fetchMoreResult.user &&
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
										return (
											<View style={{ marginTop: -10 }}>
												{this.state.fetchingMore ? <LoadingMore /> : <ContentEnd />}
											</View>
										);
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
		backgroundColor: '#f7f7f7'
	},
	questionItem: {
		backgroundColor: '#fff',
		marginBottom: 10
	},
	questionStatus: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderBottomWidth: 0.5,
		borderBottomColor: '#f0f0f0'
	},
	categoryText: {
		fontSize: 14,
		color: Colors.theme,
		borderColor: Colors.theme
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
		resizeMode: 'cover',
		marginLeft: 12
	},
	meta: {
		marginBottom: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	metaText: {
		fontSize: 13,
		color: '#A0A0A0'
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		login: store.users.login
	};
})(MakeQuestionHistoryScreen);
