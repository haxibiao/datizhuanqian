/*
 * @Author: Gaoxuan
 * @Date:   2019-03-06 15:01:30
 */

/*
 * @Author: Gaoxuan
 * @Date:   2019-03-06 15:26:14
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { Screen, DivisionLine, LoadingMore, ContentEnd, UserItem } from '../../../components';
import { Colors, Divice } from '../../../constants';

class Fans extends Component {
	constructor(props) {
		super(props);
		this.state = {
			follows: [
				{
					id: 1,
					user: {
						id: 1,
						name: '风清扬',
						avatar: 'http://cos.ainicheng.com/storage/avatar/270_1543393851.jpg',
						gender: 1,
						level: {
							id: 1,
							level: 1
						},
						is_follow: 1,
						description: '没有介绍'
					}
				},
				{
					id: 1,
					user: {
						id: 1,
						name: '风清扬',
						avatar: 'http://cos.ainicheng.com/storage/avatar/270_1543393851.jpg',
						gender: 0,
						level: {
							id: 1,
							level: 1
						},
						is_follow: 0,
						description: '没有介绍'
					}
				},
				{
					id: 1,
					user: {
						id: 1,
						name: '风清扬',
						avatar: 'http://cos.ainicheng.com/storage/avatar/270_1543393851.jpg',
						gender: 1,
						level: {
							id: 1,
							level: 1
						},
						is_follow: 1,
						description: '没有介绍'
					}
				}
			],
			fetchingMore: false
		};
	}
	render() {
		const { navigation } = this.props;
		return (
			<Screen tabLabel="粉丝" header>
				<DivisionLine height={5} />
				<FlatList
					data={this.state.follows}
					keyExtractor={(item, index) => index.toString()}
					// refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} colors={[Colors.theme]} />}
					renderItem={({ item, index }) => <UserItem navigation={navigation} item={item} />}
					onEndReachedThreshold={0.3}
					onEndReached={() => {
						if (false) {
							fetchMore({
								variables: {
									offset: data.withdraws.length
								},
								updateQuery: (prev, { fetchMoreResult }) => {
									console.log('fetchMoreResult', fetchMoreResult, fetchMoreResult.withdraws);
									if (
										!(
											fetchMoreResult &&
											fetchMoreResult.withdraws &&
											fetchMoreResult.withdraws.length > 0
										)
									) {
										this.setState({
											fetchingMore: false
										});
										return prev;
									}
									return Object.assign({}, prev, {
										withdraws: [...prev.withdraws, ...fetchMoreResult.withdraws]
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
						return this.state.fetchingMore ? <LoadingMore /> : <ContentEnd content={'没有更多了~'} />;
					}}
				/>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({});

export default Fans;
