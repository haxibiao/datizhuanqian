/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 13:38:51
 */

import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { PageContainer, ListFooter, StatusView, CustomRefreshControl } from 'components';

import { Query, withApollo, GQL } from 'apollo';
import { app } from 'store';

import SystemNotificationItem from './components/SystemNotificationItem';

class SystemNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: false,
        };
    }

    componentWillUnmount() {
        const { client } = this.props;

        client.query({
            query: GQL.userUnreadQuery,
            variable: {
                id: app.me.id,
            },
            fetchPolicy: 'network-only',
        });
    }

    render() {
        const { navigation } = this.props;
        return (
            <PageContainer title="系统通知" white>
                <Query
                    query={GQL.systemNotificationsQuery}
                    variables={{
                        filter: [
                            'WITHDRAW_SUCCESS',
                            'WITHDRAW_FAILURE',
                            'CURATION_REWARD',
                            'QUESTION_AUDIT',
                            'LEVEL_UP',
                            'REPORT_SUCCEED',
                            'NEW_MEDAL',
                            'OFFICIAL_REWARD',
                        ],
                    }}
                    fetchPolicy="network-only">
                    {({ data, error, loading, refetch, fetchMore }) => {
                        if (error) return <StatusView.ErrorView onPress={refetch} />;
                        if (loading) return <StatusView.LoadingSpinner />;
                        if (!(data && data.notifications.length > 0)) return <StatusView.EmptyView />;
                        return (
                            <FlatList
                                style={{ backgroundColor: Theme.lightBorder }}
                                data={data.notifications}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <SystemNotificationItem
                                        notification={item}
                                        navigation={navigation}
                                        user={app.me.id}
                                    />
                                )}
                                refreshControl={
                                    <CustomRefreshControl
                                        refreshing={loading}
                                        onRefresh={refetch}
                                        reset={() =>
                                            this.setState({
                                                finished: false,
                                            })
                                        }
                                    />
                                }
                                onEndReachedThreshold={0.3}
                                onEndReached={() => {
                                    fetchMore({
                                        variables: {
                                            offset: data.notifications.length,
                                        },
                                        updateQuery: (prev, { fetchMoreResult }) => {
                                            if (!(fetchMoreResult && fetchMoreResult.notifications.length > 0)) {
                                                this.setState({
                                                    finished: true,
                                                });
                                                return prev;
                                            }
                                            return Object.assign({}, prev, {
                                                notifications: [
                                                    ...prev.notifications,
                                                    ...fetchMoreResult.notifications,
                                                ],
                                            });
                                        },
                                    });
                                }}
                                ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
                            />
                        );
                    }}
                </Query>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({});

export default withApollo(SystemNotification);
