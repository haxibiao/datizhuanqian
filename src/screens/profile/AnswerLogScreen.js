/*
* @flow
* created by wyk made in 2019-02-15 10:14:12
*/
import React, { Component } from 'react';
import { StyleSheet, Platform,View, FlatList, Image, Text, TouchableOpacity,TouchableWithoutFeedback,RefreshControl } from 'react-native';
import { DivisionLine, Header, Screen,Iconfont,LoadingError,Loading,BlankContent,LoadingMore,ContentEnd } from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { mySubmitQuestionHistoryQuery } from '../../graphql/task.graphql';
import { compose, Query, Mutation, graphql } from 'react-apollo';

class AnswerItem  extends Component {
	static defaultProps = {
	  answer: {}
	}

	render() {
		let { answer,navigation }  = this.props;
		let {category,image,description,correct} = answer;
		correct=Math.random(0,1)>0.5;
		console.log('image',image);
		return (
			<TouchableWithoutFeedback onPress={()=>navigation.navigate('题目详情',{question:answer})}>
				<View style={styles.answerItem}>
					<View style={styles.content}>
						<View style={{ flex: 1}}>
							<Text style={styles.subjectText} numberOfLines={3}>{description}</Text>
						</View>
						<View style={{alignItems: 'flex-end',marginTop: 20,paddingBottom: 10 }}>
							<TouchableOpacity onPress={()=>navigation.navigate('题目纠错',{question:answer})}>
								<Text style={{fontSize: 13,color:Colors.skyBlue}}>反馈</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View>
						<View><Text style={styles.answerText}>正确答案:《蜀道难》</Text></View>
						<View style={styles.answer}>
							<Text style={[styles.answerText,{color:correct?Colors.skyBlue:Colors.red}]}>您的答案:《忆江南》</Text>
							<Iconfont name={correct?'correct':'close'} size={20} color={correct?Colors.skyBlue:Colors.red}/>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

class AnswerLogScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore:true
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
								return <BlankContent />
							}
							return (
								<FlatList
									data={data.user.questions}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({item,index})=><AnswerItem answer={item} navigation={navigation}/>}
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
													if (!(fetchMoreResult && fetchMoreResult.user && fetchMoreResult.user.questions &&fetchMoreResult.user.questions.length > 0)) {
														this.setState({
															fetchingMore: false
														});
														return prev;
													}
													return Object.assign({}, prev, {
														user: Object.assign({}, prev.user, {
															questions: [...prev.user.questions, ...fetchMoreResult.user.questions]
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
											<View style={{marginTop: -10}}>
												{
													this.state.fetchingMore ? (
														<LoadingMore />
													) : (
														<ContentEnd />
													)
												}
											</View>
										)
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
	answerItem:{
		padding: 15,
		backgroundColor: '#fff',
		marginBottom: 10
	},
	categoryLabel:{
		alignSelf: 'auto',
		paddingHorizontal: 4,
		paddingVertical: 2,
		borderWidth: 0.5,
		borderRadius: 3,
		fontSize: 14,
		color: Colors.theme,
		borderColor: Colors.theme,
	},
	content:{
		borderBottomWidth: 0.5,
		marginBottom: 10,
		borderColor: '#f0f0f0'
	},
	subjectText:{
		fontSize: 16,
		lineHeight: 20,
		color: Colors.primaryFont
	},
	image:{
		width: 60,
		height: 60,
		borderRadius: 5,
		resizeMode: 'cover',
	},
	answer:{
		marginTop: 5,
		flexDirection: 'row', 
		justifyContent: 'space-between', 
		alignItems: 'center' 
	},
	answerText:{
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