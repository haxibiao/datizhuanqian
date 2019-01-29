import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Dimensions, FlatList, Image } from 'react-native';
import { DivisionLine, ErrorBoundary, ContentEnd, Avatar, Header, Screen } from '../../../components';
import { Colors, Config, Divice } from '../../../constants';

import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import { feedbacksQuery } from '../../../graphql/user.graphql';

class FeedBackList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			onPress: 'LATEST'
		};
	}
	render() {
		let { user, navigation, login } = this.props;
		let { onPress } = this.state;
		return (
			<Screen header tabLabel="今日">
				<DivisionLine height={5} />
				<View
					style={{
						flexDirection: 'row',
						paddingHorizontal: 10,
						borderBottomColor: Colors.lightBorder,
						borderBottomWidth: 1
					}}
				>
					<TouchableOpacity
						style={{
							borderBottomWidth: 2,
							borderBottomColor: onPress == 'LATEST' ? Colors.theme : Colors.white,
							marginRight: 30,
							paddingVertical: 10
						}}
						onPress={() => {
							this.setState({
								onPress: 'LATEST'
							});
						}}
					>
						<Text>反馈列表</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							borderBottomWidth: 2,
							borderBottomColor: onPress == 'LATEST' ? Colors.white : Colors.theme,
							marginRight: 30,
							paddingVertical: 10
						}}
						onPress={() => {
							this.setState({
								onPress: 'MYFEEDBACK'
							});
						}}
					>
						<Text>我的反馈</Text>
					</TouchableOpacity>
				</View>
				<Query query={feedbacksQuery} variables={{ user_id: user.id }}>
					{({ data, loading, error, refetch, fetchMore }) => {
						if (error) return null;
						if (!(data && data.feedbacks !== [])) return null;
						return (
							<FlatList
								data={data.feedbacks}
								keyExtractor={(item, index) => index.toString()}
								renderItem={this._feedbackItem}
								ListFooterComponent={() => <ContentEnd />}
							/>
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
					navigation.navigate('反馈详情', { feedback: item });
				}}
			>
				<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
					<Avatar uri={item.user.avatar} size={34} />
					<View style={{ paddingLeft: 10, justifyContent: 'center' }}>
						<Text style={{ color: Colors.black }}>风清扬</Text>
						<Text style={{ fontSize: 12, color: Colors.grey, paddingTop: 5 }}>发布于3小时前</Text>
					</View>
				</View>
				<View>
					<Text style={{ fontSize: 15, lineHeight: 18, color: Colors.primaryFont }}>{item.content}</Text>
					<View style={{ flexDirection: 'row', marginTop: 10 }}>
						{item.images.map((image, index) => {
							return (
								<Image
									source={{ uri: image.path }}
									style={{
										width: (Divice.width - 60) / 3,
										height: (Divice.width - 60) / 3,
										marginRight: 20
									}}
									key={index}
								/>
							);
						})}
					</View>
				</View>
			</TouchableOpacity>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	feedbackItem: {
		marginHorizontal: 15,
		borderBottomColor: Colors.lightBorder,
		borderBottomWidth: 0.5,
		paddingVertical: 15
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(FeedBackList);
