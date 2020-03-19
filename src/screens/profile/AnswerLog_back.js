/*
 * @flow
 * created by wyk made in 2019-03-22 16:26:54
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { PageContainer, CustomRefreshControl, ListFooter } from 'components';
import { compose, Query, graphql, GQL } from 'apollo';

class AnswerLog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            finished: false,
        };
    }

    render() {
        let { navigation } = this.props;

        return (
            <Query query={GQL.answerHistoriesQuery} fetchPolicy="network-only">
                {({ data, loading, refetch, fetchMore }) => {
                    let answerHistories = Helper.syncGetter('user.answerHistories', data);
                    let empty = answerHistories && answerHistories.length === 0;
                    loading = !answerHistories;
                    return (
                        <PageContainer title="答题记录" refetch={refetch} loading={loading} empty={empty}>
                            <FlatList
                                contentContainerStyle={styles.container}
                                data={answerHistories}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => <QuestionItem answer={item} navigation={navigation} />}
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
                                            offset: answerHistories.length,
                                        },
                                        updateQuery: (prev, { fetchMoreResult }) => {
                                            if (
                                                !(
                                                    fetchMoreResult &&
                                                    fetchMoreResult.user &&
                                                    fetchMoreResult.user.answerHistories &&
                                                    fetchMoreResult.user.answerHistories.length > 0
                                                )
                                            ) {
                                                this.setState({
                                                    finished: true,
                                                });
                                                return prev;
                                            }
                                            return Object.assign({}, prev, {
                                                user: Object.assign({}, prev.user, {
                                                    answerHistories: [
                                                        ...prev.user.answerHistories,
                                                        ...fetchMoreResult.user.answerHistories,
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

class QuestionItem extends Component {
    render() {
        let {
            answer: { question, correct_count },
            navigation,
        } = this.props;
        let { description, id } = question;

        return (
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Question', { question })}>
                <View style={styles.questionItem}>
                    <View style={styles.content}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.subjectText} numberOfLines={3}>
                                {description}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <TouchableOpacity
                                style={{ padding: PxFit(10) }}
                                onPress={() => navigation.navigate('ReportQuestion', { question })}>
                                <Text style={{ fontSize: PxFit(13), color: Theme.correctColor }}>举报</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <View style={styles.answer}>
                            <Text
                                style={[
                                    styles.answerText,
                                    { color: correct_count > 0 ? Theme.correctColor : Theme.errorColor },
                                ]}>
                                {correct_count > 0 ? '您答对了' : '您答错了'}
                            </Text>
                            <Text style={[styles.answerText]}>#{id}</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: PxFit(Theme.itemSpace),
        backgroundColor: '#f9f9f9',
    },
    questionItem: {
        marginBottom: PxFit(Theme.itemSpace),
        borderRadius: PxFit(5),
        backgroundColor: '#fff',
    },
    categoryLabel: {
        alignSelf: 'auto',
        paddingHorizontal: PxFit(4),
        paddingVertical: PxFit(2),
        borderWidth: PxFit(0.5),
        borderRadius: PxFit(3),
        fontSize: PxFit(14),
        color: Theme.primaryColor,
        borderColor: Theme.primaryColor,
    },
    content: {
        padding: PxFit(Theme.itemSpace),
        borderColor: '#f0f0f0',
        borderBottomWidth: PxFit(0.6),
    },
    subjectText: {
        fontSize: PxFit(15),
        lineHeight: PxFit(20),
        color: Theme.primaryFont,
    },
    answer: {
        padding: PxFit(Theme.itemSpace),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    answerText: {
        fontSize: PxFit(13),
        color: Theme.subTextColor,
    },
});

export default compose(
    graphql(GQL.toggleFavoriteMutation, {
        name: 'cancelFavorite',
    }),
)(AnswerLog);
