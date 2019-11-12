/*
 * @flow
 * created by wyk made in 2019-03-22 16:31:22
 */
'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Platform,
    View,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import {
    PageContainer,
    Iconfont,
    TouchFeedback,
    StatusView,
    Placeholder,
    CustomRefreshControl,
    ItemSeparator,
    ListFooter,
    Row,
} from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH, Tools } from 'utils';
import { compose, Query, Mutation, graphql, GQL } from 'apollo';

import QuestionItem from './components/QuestionItem';

class Contributes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            finished: false,
        };
    }

    render() {
        let { navigation } = this.props;

        return (
            <Query query={GQL.mySubmitQuestionHistoryQuery} fetchPolicy="network-only">
                {({ data, loading, error, refetch, fetchMore }) => {
                    let questions = Tools.syncGetter('user.questions', data);
                    let empty = questions && questions.length === 0;
                    return (
                        <PageContainer
                            hiddenNavBar
                            title="我的出题"
                            refetch={refetch}
                            loading={questions === undefined}
                            empty={empty}
                            error={error}>
                            <FlatList
                                contentContainerStyle={styles.container}
                                data={questions}
                                keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
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
                                ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
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
        flexGrow: 1,
        padding: PxFit(Theme.itemSpace),
        backgroundColor: '#f9f9f9',
    },
});

export default Contributes;
