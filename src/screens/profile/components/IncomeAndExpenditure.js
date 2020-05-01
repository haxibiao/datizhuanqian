/*
 * @flow
 * created by wyk made in 2019-04-11 17:14:30
 */
'use strict';
import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { ListFooter, StatusView, CustomRefreshControl } from 'components';

import { Query, GQL } from 'apollo';
import { app } from 'store';

import IncomeAndExpenditureItem from './IncomeAndExpenditureItem';

class IntegralDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: false,
        };
    }

    render() {
        const { navigation } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <Query query={GQL.GoldsQuery} fetchPolicy="network-only" variables={{ user_id: app.me.id }}>
                    {({ data, error, loading, refetch, fetchMore }) => {
                        let golds = Helper.syncGetter('golds', data);
                        if (error) return <StatusView.ErrorView onPress={refetch} error={error} />;
                        if (loading) return <StatusView.LoadingSpinner />;
                        if (!golds || golds.length === 0)
                            return (
                                <StatusView.EmptyView
                                    imageSource={require('../../../assets/images/default_message.png')}
                                />
                            );
                        return (
                            <FlatList
                                data={golds}
                                keyExtractor={(item, index) => index.toString()}
                                refreshControl={
                                    <CustomRefreshControl
                                        onRefresh={refetch}
                                        reset={() => this.setState({ finished: false })}
                                    />
                                }
                                renderItem={({ item }) => (
                                    <IncomeAndExpenditureItem item={item} navigation={navigation} />
                                )}
                                ListHeaderComponent={this._userWithdrawInfo}
                                onEndReachedThreshold={0.3}
                                onEndReached={() => {
                                    fetchMore({
                                        variables: {
                                            offset: golds.length,
                                        },
                                        updateQuery: (prev, { fetchMoreResult }) => {
                                            if (
                                                !(
                                                    fetchMoreResult &&
                                                    fetchMoreResult.golds &&
                                                    fetchMoreResult.golds.length > 0
                                                )
                                            ) {
                                                this.setState({
                                                    finished: true,
                                                });
                                                return prev;
                                            }
                                            return Object.assign({}, prev, {
                                                golds: [...prev.golds, ...fetchMoreResult.golds],
                                            });
                                        },
                                    });
                                }}
                                ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
                            />
                        );
                    }}
                </Query>
            </View>
        );
    }
}

export default IntegralDetail;
