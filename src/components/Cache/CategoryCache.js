import React, { Component } from 'react';
import { StyleSheet, View, Text, RefreshControl, FlatList } from 'react-native';

import { Loading, ContentEnd, Banner, LoadingMore, TabTop } from '../Universal';
import PlateItem from '../ListItem/PlateItem';

import { Colors } from '../../constants';

import { Storage, ItemKeys } from '../../store/localStorage';

class CategoryCache extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true,
			categoryCache: ''
		};
	}

	async componentWillMount() {
		this.setState({
			categoryCache: await Storage.getItem(ItemKeys.categoryCache)
		});
	}

	render() {
		const { navigation, refetch, login } = this.props;
		let { categoryCache } = this.state;
		if (!categoryCache) return null;
		return (
			<View>
				<TabTop />
				<FlatList
					data={categoryCache}
					refreshControl={<RefreshControl onRefresh={refetch} colors={[Colors.theme]} />}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item, index }) => (
						<PlateItem category={item} navigation={navigation} login={login} />
					)}
					ListHeaderComponent={() => {
						return <Banner />;
					}}
					onEndReachedThreshold={0.3}
					ListFooterComponent={() => {
						return this.state.fetchingMore ? <LoadingMore /> : <ContentEnd content={'暂时没有更多分类~'} />;
					}}
				/>
			</View>
		);
	}
}

export default CategoryCache;
