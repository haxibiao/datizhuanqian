import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image, RefreshControl } from 'react-native';
import {
	DivisionLine,
	ErrorBoundary,
	ContentEnd,
	LoadingMore,
	BlankContent,
	Loading,
	LoadingError,
	Avatar,
	Header,
	Screen,
	Iconfont
} from '../../../components';
import { Colors, Config, Divice } from '../../../constants';
import { Methods } from '../../../helpers';

import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import { feedbacksQuery } from '../../../graphql/user.graphql';

class FeedBackList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			onPress: 'LATEST',
			fetchingMore: true,
			filter: this.props.user.id
		};
	}
	render() {
		let { user, navigation, login } = this.props;
		let { onPress, filter } = this.state;
		return (
			<Screen header tabLabel="反馈记录">
				<DivisionLine height={5} />
				<View style={styles.header}>
					<TouchableOpacity
						style={[styles.tab, { borderBottomColor: filter == null ? Colors.white : Colors.theme }]}
						onPress={() => {
							this.setState({
								filter: user.id
							});
							// refetch();
						}}
					>
						<Text>我的反馈</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[{ borderBottomColor: filter == null ? Colors.theme : Colors.white }, styles.tab]}
						onPress={() => {
							this.setState({
								filter: null
							});
							// refetch();
						}}
					>
						<Text>反馈列表</Text>
					</TouchableOpacity>
				</View>

				<Query query={feedbacksQuery} variables={{ user_id: filter }} fetchPolicy="network-only">
					{({ data, loading, error, refetch, fetchMore }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (loading) return <Loading />;
						if (!(data && data.feedbacks.length > 0))
							return <BlankContent text={'暂无反馈'} fontSize={14} />;
						return (
							<View>
								<FlatList
									data={data.feedbacks}
									keyExtractor={(item, index) => index.toString()}
									renderItem={this._feedbackItem}
									refreshControl={
										<RefreshControl
											refreshing={loading}
											onRefresh={refetch}
											colors={[Colors.theme]}
										/>
									}
									onEndReachedThreshold={0.3}
									onEndReached={() => {
										if (data.feedbacks) {
											fetchMore({
												variables: {
													offset: data.feedbacks.length
												},
												updateQuery: (prev, { fetchMoreResult }) => {
													console.log('update', fetchMoreResult);
													if (!(fetchMoreResult && fetchMoreResult.feedbacks.length > 0)) {
														this.setState({
															fetchingMore: false
														});
														return prev;
													}
													return Object.assign({}, prev, {
														feedbacks: [...prev.feedbacks, ...fetchMoreResult.feedbacks]
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
											<ContentEnd content={'没有更多反馈了~'} />
										);
									}}
								/>
							</View>
						);
					}}
				</Query>
			</Screen>
		);
	}

	_feedbackItem = ({ item, index }) => {
		let { navigation } = this.props;
		return (
			<TouchableOpacity
				style={styles.feedbackItem}
				onPress={() => {
					navigation.navigate('反馈详情', { feedback_id: item.id });
				}}
			>
				<View style={styles.top}>
					<View style={styles.topLeft}>
						<Avatar uri={item.user.avatar} size={28} />
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<View style={{ justifyContent: 'center' }}>
								<Text
									style={{
										color: item.user.is_admin ? Colors.themeRed : Colors.black,
										paddingLeft: 10
									}}
								>
									{item.user.name}
								</Text>
							</View>
							{item.user.is_admin ? (
								<Image
									source={require('../../../../assets/images/admin.png')}
									style={{ height: 13, width: 13, marginLeft: 5 }}
								/>
							) : (
								<View
									style={{
										backgroundColor: Colors.theme,
										paddingHorizontal: 2,
										marginLeft: 5,
										marginTop: 1,
										borderRadius: 1
									}}
								>
									<Text style={{ fontSize: 8, color: Colors.white }}>Lv.{item.user.level.level}</Text>
								</View>
							)}
						</View>
					</View>
				</View>
				<View style={{ marginLeft: 15, marginRight: 15, paddingBottom: 10 }}>
					<Text style={styles.body}>{item.content}</Text>
					{this.renderImage(item.images.slice(0, 3))}
				</View>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginHorizontal: 15,
						paddingBottom: 10
					}}
				>
					<View>
						<Text style={styles.text}>{item.time_ago}</Text>
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
							<Iconfont name={'hot'} size={15} color={Colors.theme} style={{ marginHorizontal: 5 }} />
							<Text style={styles.text}>{item.hot}</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Iconfont
								name={'notification'}
								style={{ marginHorizontal: 5 }}
								color={Colors.theme}
								size={12}
							/>
							<Text style={styles.text}>{item.publish_comments_count}</Text>
						</View>
					</View>
				</View>
				<DivisionLine height={5} />
			</TouchableOpacity>
		);
	};

	renderImage = images => {
		let images_length = images.length;
		let sizeArr = Methods.imgsLayoutSize(images_length, images);
		return (
			<View style={styles.images}>
				{images.map((image, index) => {
					return <Image source={{ uri: image.path }} style={sizeArr[index]} key={index} />;
				})}
			</View>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	header: {
		flexDirection: 'row',
		paddingHorizontal: 10,
		borderBottomColor: Colors.lightBorder,
		borderBottomWidth: 1
	},
	tab: {
		borderBottomWidth: 2,
		marginRight: 30,
		paddingVertical: 10
	},
	itemItem: {},
	top: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10,
		paddingTop: 15,
		marginHorizontal: 15
	},
	topLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	user: {
		paddingLeft: 10,
		justifyContent: 'center'
	},
	text: {
		fontSize: 13,
		color: Colors.grey
	},
	body: {
		fontSize: 16,
		lineHeight: 18,
		color: Colors.primaryFont
	},
	images: {
		flexDirection: 'row',
		marginTop: 10
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(FeedBackList);
