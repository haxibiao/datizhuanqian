/*
* @flow
* created by wyk made in 2018-12-11 09:12:40
*/
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, VirtualizedListProps, ActivityIndicator } from 'react-native';
import { Theme, PxFit } from '../../utils';
import EmptyView from '../StatusView/EmptyView';
import CustomRefreshControl from './CustomRefreshControl';
import ListFooter from './ListFooter';

type IndicatorSize = number | 'small' | 'large';

type Props = {
	waitingSpinnerSize?: IndicatorSize,
	waitingSpinnerColor?: ?string,
	...VirtualizedListProps.propTypes
};

type State = {
	isRefreshing: boolean,
	finished: boolean
};

class PullList extends Component<Props, State> {
	static defaultProps = {
		contentContainerStyle: { flexGrow: 1 },
		waitingSpinnerSize: 'small',
		waitingSpinnerColor: Theme.primaryColor,
		showsVerticalScrollIndicator: false,
		onEndReachedThreshold: 0.2
	};

	fetching = false;

	state = {
		isRefreshing: false,
		finished: false
	};

	onRefresh = () => {
		if (!this.props.onRefresh) return;
		this.setState({ isRefreshing: true }, async () => {
			await this.props.onRefresh();
			this.setState({ isRefreshing: false });
		});
	};

	onEndReached = () => {
		let { data, onFetchMore } = this.props;
		if (data instanceof Array && data.length > 0 && onFetchMore && !this.fetching) {
			this.fetching = true;
			onFetchMore({
				fetched: () => (this.fetching = false),
				finished: () =>
					this.setState({ finished: true }, () => {
						this.fetching = false;
					})
			});
		} else {
			this.setState({ finished: true }, () => {
				this.fetching = false;
			});
		}
	};

	renderFooter = () => {
		let { data, onFetchMore, ListFooterComponent } = this.props;
		if (ListFooterComponent) {
			return ListFooterComponent;
		} else if (data instanceof Array && data.length > 9 && onFetchMore) {
			return <ListFooter finished={this.state.finished} />;
		} else {
			return <View />;
		}
	};

	render() {
		let { data, ListEmptyComponent, ...other } = this.props;
		if (!ListEmptyComponent) {
			ListEmptyComponent = <EmptyView />;
		}
		return (
			<FlatList
				{...other}
				data={data}
				ref={ref => (this._flatList = ref)}
				refreshing={this.state.isRefreshing}
				refreshControl={
					<CustomRefreshControl refreshing={this.state.isRefreshing} onRefresh={this.onRefresh} />
				}
				onEndReached={this.onEndReached}
				ListFooterComponent={this.renderFooter}
				ListEmptyComponent={ListEmptyComponent}
				keyExtractor={(item, index) => 'key_' + (item&&item.id ? item.id : index)}
			/>
		);
	}
}

const styles = StyleSheet.create({
	footerView: {
		height: PxFit(40),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	footerViewText: {
		fontSize: PxFit(14),
		color: '#a0a0a0'
	}
});

export default PullList;
