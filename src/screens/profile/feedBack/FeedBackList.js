import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image, RefreshControl } from 'react-native';
import { DivisionLine, ErrorBoundary, ContentEnd, Avatar, Header, Screen, Iconfont } from '../../../components';
import { Colors, Config, Divice } from '../../../constants';

import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import { feedbacksQuery } from '../../../graphql/user.graphql';

class FeedBackList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			onPress: 'LATEST',
			filter: this.props.user.id
		};
	}
	render() {
		let { user, navigation, login } = this.props;
		let { onPress, filter } = this.state;
		return (
			<Screen header tabLabel="今日">
				<DivisionLine height={5} />
				<Query query={feedbacksQuery} variables={{ user_id: filter }}>
					{({ data, loading, error, refetch, fetchMore }) => {
						if (error) return null;
						if (!(data && data.feedbacks !== [])) return null;
						return (
							<View>
								<View style={styles.header}>
									<TouchableOpacity
										style={[
											styles.tab,
											{ borderBottomColor: filter == null ? Colors.white : Colors.theme }
										]}
										onPress={() => {
											this.setState({
												filter: user.id
											});
											refetch();
										}}
									>
										<Text>我的反馈</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											{ borderBottomColor: filter == null ? Colors.theme : Colors.white },
											styles.tab
										]}
										onPress={() => {
											this.setState({
												filter: null
											});
											refetch();
										}}
									>
										<Text>反馈列表</Text>
									</TouchableOpacity>
								</View>

								<FlatList
									data={data.feedbacks}
									keyExtractor={(item, index) => index.toString()}
									renderItem={this._feedbackItem}
									ListFooterComponent={() => <ContentEnd />}
									refreshControl={
										<RefreshControl
											refreshing={loading}
											onRefresh={refetch}
											colors={[Colors.theme]}
										/>
									}
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
						<Avatar uri={item.user.avatar} size={36} />
						<View style={styles.user}>
							<Text style={{ color: Colors.black }}>{item.user.name}</Text>
							<Text style={styles.time}>发布于{item.time_ago}</Text>
						</View>
					</View>
					<TouchableOpacity>
						<Iconfont name={'more-horizontal'} size={15} color={Colors.grey} />
					</TouchableOpacity>
				</View>
				<View style={{ marginHorizontal: 15, paddingBottom: 15 }}>
					<Text style={styles.body}>{item.content}</Text>
					<View style={styles.images}>
						{item.images.map((image, index) => {
							return (
								<Image
									source={{ uri: image.path }}
									style={{
										width: (Divice.width - 40) / 3,
										height: (Divice.width - 40) / 3
									}}
									key={index}
								/>
							);
						})}
					</View>
				</View>
				<DivisionLine height={5} />
			</TouchableOpacity>
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
	feedbackItem: {},
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
	time: {
		fontSize: 12,
		color: Colors.grey,
		paddingTop: 5
	},
	body: {
		fontSize: 15,
		lineHeight: 18,
		color: Colors.primaryFont
	},
	images: {
		flexDirection: 'row',
		marginTop: 10,
		justifyContent: 'space-between'
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(FeedBackList);
