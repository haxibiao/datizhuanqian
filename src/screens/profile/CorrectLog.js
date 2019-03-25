/*
 * @flow
 * created by wyk made in 2019-03-22 16:28:19
 */
'use strict';

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
	Animated
} from 'react-native';
import {
	PageContainer,
	Iconfont,
	TouchFeedback,
	StatusView,
	Placeholder,
	CustomRefreshControl,
	ItemSeparator,
	ListFooter,
	Row
} from '../../components';
import { Theme, PxFit, Config, SCREEN_WIDTH } from '../../utils';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { curationsQuery } from '../../assets/graphql/user.graphql';
import { toggleFavoriteMutation } from '../../assets/graphql/question.graphql';
import { compose, Query, Mutation, graphql } from 'react-apollo';
import Video from 'react-native-video';

class CorrectLog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			finished: false
		};
	}

	cancelFavorite = async (id, callback) => {
		try {
			console.log('cancelFavorite', id);
			callback && callback();
			await this.props.cancelFavorite({ variables: { data: { favorable_id: id } } });
			Toast.show({ content: '取消收藏成功' });
		} catch (err) {
			let str = err.toString().replace(/Error: GraphQL error: /, '');
			Toast.show({ content: '取消收藏失败' });
		}
	};

	render() {
		let { navigation } = this.props;

		return (
			<PageContainer title="纠错记录">
				<Query query={curationsQuery} fetchPolicy="network-only">
					{({ data, loading, error, refetch, fetchMore }) => {
						if (error) return <StatusView.ErrorView reload={() => refetch()} />;
						if (!(data && data.curations && data.curations.length > 0)) {
							return <StatusView.LoadingSpinner />;
						}
						return (
							<FlatList
								contentContainerStyle={styles.container}
								data={data.curations}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item, index }) => (
									<CorrectionItem correctionItem={item} navigation={navigation} />
								)}
								refreshControl={<CustomRefreshControl onRefresh={refetch} />}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									if (data.curations) {
										fetchMore({
											variables: {
												offset: data.curations.length
											},
											updateQuery: (prev, { fetchMoreResult }) => {
												if (
													!(
														fetchMoreResult &&
														fetchMoreResult.curations &&
														fetchMoreResult.curations.length > 0
													)
												) {
													this.setState({
														finished: true
													});
													return prev;
												}
												return Object.assign({}, prev, {
													questions: [...prev.curations, ...fetchMoreResult.curations]
												});
											}
										});
									}
								}}
								ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
							/>
						);
					}}
				</Query>
			</PageContainer>
		);
	}
}

class CorrectionItem extends Component {
	render() {
		const { navigation, correctionItem } = this.props;
		const { created_at, status, type, remark, content, question } = correctionItem;
		return (
			<TouchableOpacity
				style={styles.correctionItem}
				onPress={() => {
					navigation.navigate('QuestionDetail', { question });
				}}
			>
				<Text style={styles.content}>题干:{question.description}</Text>
				{content && (
					<View style={{ paddingVertical: PxFit(15) }}>
						<Text style={{ fontSize: PxFit(13), color: Theme.black }}>{content}</Text>
					</View>
				)}

				<View style={styles.footer}>
					<View style={styles.left}>
						{status == 1 && <Text style={{ color: Theme.primaryColor, fontSize: PxFit(12) }}>已采纳</Text>}
						{status == 0 && <Text style={{ color: Theme.subTextColor, fontSize: PxFit(12) }}>审核中</Text>}
						{status == -1 && <Text style={{ color: Theme.errorColor, fontSize: PxFit(12) }}>未采纳</Text>}
						{remark && <Text style={{ fontSize: PxFit(12), color: Theme.errorColor }}>·{remark}</Text>}
						{type == 1 && !remark && <Text style={styles.greyText}>·题干有误</Text>}
						{type == 2 && !remark && <Text style={styles.greyText}>·答案有误</Text>}
						{type == 3 && !remark && <Text style={styles.greyText}>·图片缺少或不清晰</Text>}
						{type == 4 && !remark && <Text style={styles.greyText}>·其他</Text>}
					</View>
					<Text style={styles.greyText}>{created_at}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: PxFit(Theme.itemSpace),
		backgroundColor: '#f9f9f9'
	},
	correctionItem: {
		justifyContent: 'center',
		borderRadius: PxFit(5),
		padding: PxFit(Theme.itemSpace),
		marginBottom: PxFit(Theme.itemSpace),
		backgroundColor: '#fff'
	},
	content: {
		fontSize: PxFit(15),
		lineHeight: PxFit(18),
		color: Theme.primaryFont
	},
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	left: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	greyText: {
		color: Theme.subTextColor,
		fontSize: PxFit(12)
	}
});

export default compose(
	connect(store => ({ user: store.users.user, login: store.users.login })),
	graphql(toggleFavoriteMutation, {
		name: 'cancelFavorite'
	})
)(CorrectLog);
