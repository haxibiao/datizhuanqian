import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions, RefreshControl, FlatList } from "react-native";

import {
	DivisionLine,
	TabTop,
	LoadingMore,
	ContentEnd,
	LoadingError,
	Banner,
	Loading
} from "../../components/Universal";

import { Colors } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

import PlateItem from "./PlateItem";
import { Storage, ItemKeys } from "../../store/localStorage";

const { width, height } = Dimensions.get("window");

class CategoryCache extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true,
			categoryCache: ""
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
		console.log("categoryCache", categoryCache);
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
						return this.state.fetchingMore ? <LoadingMore /> : <ContentEnd content={"暂时没有更多分类~"} />;
					}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({});

export default CategoryCache;
