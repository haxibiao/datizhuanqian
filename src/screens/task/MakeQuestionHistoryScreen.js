/*
* @flow
* created by wyk made in 2019-02-13 10:33:52
*/
import React, { Component } from 'react';
import { StyleSheet, Platform,View, FlatList, Image, Text, TouchableOpacity,TouchableWithoutFeedback,RefreshControl } from 'react-native';
import { DivisionLine, Header, Screen,Iconfont,LoadingError,Loading,BlankContent,LoadingMore,ContentEnd } from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { mySubmitQuestionHistoryQuery } from '../../graphql/task.graphql';
import { compose, Query, Mutation, graphql } from 'react-apollo';

class QuestionItem  extends Component {
	static defaultProps = {
	  question: {}
	}

	render() {
		let { question,navigation }  = this.props;
		let {category,image,description,created_at,count} = question;
		console.log('image',image);
		return (
			<TouchableWithoutFeedback onPress={()=>navigation.navigate('题目详情',{question})}>
				<View style={styles.questionItem}>
					<View style={{flexDirection: 'row' }}>
						<Text style={styles.categoryLabel}>{category.name}</Text>
					</View>
					<View style={{flexDirection: 'row',alignItems: 'center',marginVertical: 10}}>
						<View style={{ flex: 1}}>
							<Text style={styles.subjectText} numberOfLines={3}>{description}</Text>
						</View>
						{
							image&&<Image source={{uri:image.path}} style={styles.image} />
						}
					</View>
					<View style={styles.meta}><Text style={styles.metaText}>{created_at}</Text><Text style={styles.metaText}>{'  共'+count+'人答过'}</Text></View>			
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

class MakeQuestionHistoryScreen extends Component {
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
									renderItem={({item,index})=><QuestionItem question={item} navigation={navigation}/>}
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
													return {
														user:{
															...prev.user.questions,
															...fetchMoreResult.user.questions
														}
													}
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
	questionItem:{
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
		marginLeft: 12
	},
	meta:{
		flexDirection: 'row', 
		justifyContent: 'space-between', 
		alignItems: 'center' 
	},
	metaText:{
		fontSize: 13,
		color:'#A0A0A0'
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		login: store.users.login
	};
})(MakeQuestionHistoryScreen);