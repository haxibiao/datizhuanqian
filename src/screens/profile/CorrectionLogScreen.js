import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, RefreshControl, TouchableOpacity } from 'react-native';
import {
	DivisionLine,
	BlankContent,
	Loading,
	LoadingError,
	LoadingMore,
	ContentEnd,
	Screen,
	CorrectionLogItem
} from '../../components';
import { Colors } from '../../constants';

import { connect } from 'react-redux';
import { curationsQuery } from '../../graphql/user.graphql';
import { Query } from 'react-apollo';

class CorrectionLogScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true
		};
	}

	render() {
		const { user, navigation } = this.props;

		return (
			<Screen
				customStyle={{
					backgroundColor: Colors.theme,
					borderBottomWidth: 0,
					borderBottomColor: 'transparent'
				}}
			>
				<Query query={curationsQuery} fetchPolicy="network-only">
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (loading) return <Loading />;
						if (!(data && data && data.questionRedresses && data.questionRedresses.length > 0))
							return <BlankContent text={'暂无纠错记录哦,快去纠错吧~'} fontSize={14} />;

						return (
							<FlatList
								data={data.questionRedresses}
								keyExtractor={(item, index) => index.toString()}
								refreshControl={
									<RefreshControl refreshing={loading} onRefresh={refetch} colors={[Colors.theme]} />
								}
								renderItem={({ item, index }) => (
									<CorrectionLogItem navigation={navigation} item={item} />
								)}
								ListHeaderComponent={this._userWithdrawInfo}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									if (data.questionRedresses) {
										fetchMore({
											variables: {
												offset: data.questionRedresses.length
											},
											updateQuery: (prev, { fetchMoreResult }) => {
												if (
													!(
														fetchMoreResult &&
														fetchMoreResult.questionRedresses &&
														fetchMoreResult.questionRedresses.length > 0
													)
												) {
													this.setState({
														fetchingMore: false
													});
													return prev;
												}
												return Object.assign({}, prev, {
													questionRedresses: [
														...prev.questionRedresses,
														...fetchMoreResult.questionRedresses
													]
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
										<ContentEnd content={'没有更多记录了~'} />
									);
								}}
							/>
						);
					}}
				</Query>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({});

export default connect(store => {
	return {
		user: store.users.user
	};
})(CorrectionLogScreen);
