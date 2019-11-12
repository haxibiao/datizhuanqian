/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:24
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, FlatList, Image, Animated } from 'react-native';
import {
    PageContainer,
    TouchFeedback,
    Iconfont,
    Row,
    ListItem,
    CustomSwitch,
    ItemSeparator,
    PopOverlay,
    CustomRefreshControl,
    ListFooter,
    StatusView,
    PullChooser,
} from 'components';
import { Theme, PxFit, Tools, SCREEN_WIDTH, NAVBAR_HEIGHT } from 'utils';

import { app } from 'store';
import { Query, withApollo, compose, graphql, GQL } from 'apollo';

import UserProfile from './components/UserProfile';
import QuestionItem from './components/QuestionItem';
import Placeholder from './components/Placeholder';

const HEADER_EXPANDED_HEIGHT = PxFit(158);
const HEADER_COLLAPSED_HEIGHT = 0;
const ORDER = ['ANSWERS_COUNT', 'CREATED_AT'];

class index extends Component {
    constructor(props) {
        super(props);
        this.switchOrder = Tools.throttle(this.switchOrder.bind(this), 500);
        this.state = {
            finished: false,
            orderByHot: false,
        };
    }

    renderContent = (questions, fetchMore, refetch) => {
        let { navigation } = this.props;
    };

    showOptions = () => {
        let { navigation } = this.props;
        let user = navigation.getParam('user', {});

        PullChooser.show([
            {
                title: '举报',
                onPress: () => navigation.navigate('ReportUser', { user }),
            },
        ]);
    };

    switchOrder() {
        this.setState({ orderByHot: !this.state.orderByHot });
    }

    render() {
        let { orderByHot } = this.state;
        let { navigation } = this.props;
        let user = navigation.getParam('user', {});
        return (
            <Query
                query={GQL.UserInfoQuery}
                variables={{ id: user.id, order: orderByHot ? ORDER[0] : ORDER[1], filter: 'publish' }}
                fetchPolicy="network-only">
                {({ data, loading, error, refetch, fetchMore }) => {
                    let user = Tools.syncGetter('user', data),
                        questions = [];
                    if (!user) {
                        return <Placeholder />;
                    }
                    if (user && user.questions) {
                        questions = user.questions;
                    }
                    return (
                        <PageContainer
                            refetch={refetch}
                            error={error}
                            title={user.name + '的主页'}
                            white
                            rightView={
                                user.id == app.me.id ? null : (
                                    <TouchFeedback onPress={this.showOptions} style={styles.optionsButton}>
                                        <Iconfont
                                            name="more-horizontal"
                                            color={Theme.defaultTextColor}
                                            size={PxFit(18)}
                                        />
                                    </TouchFeedback>
                                )
                            }>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                                contentContainerStyle={{
                                    flexGrow: 1,
                                    paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
                                }}
                                style={styles.container}
                                data={questions}
                                keyExtractor={(item, index) => index.toString()}
                                ListHeaderComponent={
                                    <UserProfile
                                        user={user}
                                        hasQuestion={questions.length > 0}
                                        navigation={navigation}
                                        switchOrder={this.switchOrder}
                                        orderByHot={orderByHot}
                                    />
                                }
                                ListEmptyComponent={<StatusView.EmptyView title="空空如也，没有出过题目" />}
                                renderItem={({ item, index }) => (
                                    <QuestionItem question={item} navigation={navigation} />
                                )}
                                refreshControl={
                                    <CustomRefreshControl
                                        onRefresh={refetch}
                                        reset={() => this.setState({ finished: false })}
                                    />
                                }
                                onEndReachedThreshold={0.3}
                                onEndReached={() => {
                                    fetchMore({
                                        variables: {
                                            offset: questions.length,
                                        },
                                        updateQuery: (prev, { fetchMoreResult }) => {
                                            if (
                                                !(
                                                    fetchMoreResult &&
                                                    fetchMoreResult.user &&
                                                    fetchMoreResult.user.questions &&
                                                    fetchMoreResult.user.questions.length > 0
                                                )
                                            ) {
                                                this.setState({
                                                    finished: true,
                                                });
                                                return prev;
                                            }
                                            return Object.assign({}, prev, {
                                                user: Object.assign({}, prev.user, {
                                                    questions: [
                                                        ...prev.user.questions,
                                                        ...fetchMoreResult.user.questions,
                                                    ],
                                                }),
                                            });
                                        },
                                    });
                                }}
                                ListFooterComponent={() =>
                                    questions.length == 0 ? <View /> : <ListFooter finished={this.state.finished} />
                                }
                            />
                        </PageContainer>
                    );
                }}
            </Query>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: SCREEN_WIDTH,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    optionsButton: {
        flex: 1,
        width: PxFit(40),
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});

export default compose(withApollo)(index);
