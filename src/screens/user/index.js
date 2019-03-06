/*
 * @Author: Gaoxuan
 * @Date:   2019-03-04 11:12:55
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

import { Colors, Divice } from '../../constants';
import { Screen, LoadingMore, ContentEnd, BlankContent } from '../../components';

import { UserInfoQuery } from '../../graphql/user.graphql';
import { Query } from 'react-apollo';

import QuestionItem from './components/QuestionItem';
import HeaderUser from './components/HeaderUser';

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
							<HeaderUser user={data.user} />

							{data.user.questions.length > 0 ? (
								<FlatList
									data={data.user.questions}
									style={{ flex: 1 }}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index }) => (
										<QuestionItem navigation={navigation} question={item} />
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
						</Screen>
					);
				}}
			</Query>
		);
	}
}

const styles = StyleSheet.create({});

export default Default;
