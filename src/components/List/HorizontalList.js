/*
* @flow
* created by wyk made in 2018-12-24 16:51:24
*/
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, VirtualizedListProps, ActivityIndicator } from 'react-native';
import { Theme, PxFit } from '../../utils';
import EmptyView from '../StatusView/EmptyView';
import CustomRefreshControl from './CustomRefreshControl';

type IndicatorSize = number | 'small' | 'large';

type Props = {
	waitingSpinnerSize?: IndicatorSize,
	waitingSpinnerColor?: ?string,
	...VirtualizedListProps.propTypes
};

type State = {
	finished: boolean
};

class HorizontalList extends Component<Props, State> {
	static defaultProps = {
		waitingSpinnerSize: 'small',
		waitingSpinnerColor: Theme.primaryColor,
		showsHorizontalScrollIndicator: false,
		onEndReachedThreshold: 0.2
	};

	fetching = false;

	state = {
		finished: false
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
		}
	};

	renderFooter = () => {
		if (this.state.finished) {
			return <View />;
		} else {
			return (
				<View style={styles.footerView}>
					<ActivityIndicator color={this.props.waitingSpinnerColor} size={this.props.waitingSpinnerSize} />
				</View>
			);
		}
	};

	render() {
		let { data, ListEmptyComponent, ...other } = this.props;
		if (!ListEmptyComponent) {
			ListEmptyComponent = <View />;
		}
		return (
			<FlatList
				{...other}
				data={data}
				horizontal
				onEndReached={this.onEndReached}
				ListFooterComponent={this.renderFooter}
				ListEmptyComponent={ListEmptyComponent}
				keyExtractor={(item, index) => 'key_' + (item.id ? item.id : index)}
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
	}
});

export default HorizontalList;
