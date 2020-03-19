import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { PageContainer, CustomRefreshControl, ListFooter } from 'components';

import { useQuery, GQL } from '@src/apollo';

const AllAnswerLog = props => {
    const { navigation } = props;
    const [finished, setFinished] = useState(false);
    const { data, loading, error, fetchMore, refetch } = useQuery(GQL.answerHistoriesQuery, {
        fetchPolicy: 'network-only',
    });

    const questionItem = (item: any) => (
        <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Question', { question: Helper.syncGetter('question', item) })}>
            <View style={styles.questionItem}>
                <View style={styles.content}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.subjectText} numberOfLines={3}>
                            {Helper.syncGetter('question.description', item)}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            style={{ padding: PxFit(10) }}
                            onPress={() =>
                                navigation.navigate('ReportQuestion', {
                                    question: Helper.syncGetter('question', item),
                                })
                            }>
                            <Text style={{ fontSize: PxFit(13), color: Theme.correctColor }}>举报</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <View style={styles.answer}>
                        <Text
                            style={[
                                styles.answerText,
                                {
                                    color:
                                        Helper.syncGetter('correct_count', item) > 0
                                            ? Theme.correctColor
                                            : Theme.errorColor,
                                },
                            ]}>
                            {Helper.syncGetter('correct_count', item) > 0 ? '您答对了' : '您答错了'}
                        </Text>
                        <Text style={[styles.answerText]}>#{Helper.syncGetter('question.id', item)}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );

    const answerHistories = Helper.syncGetter('user.answerHistories', data);
    const empty = answerHistories && answerHistories.length === 0;

    return (
        <PageContainer hiddenNavBar refetch={refetch} loading={loading} error={error} empty={empty}>
            <FlatList
                contentContainerStyle={styles.container}
                data={answerHistories}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => questionItem(item)}
                refreshControl={<CustomRefreshControl onRefresh={refetch} />}
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                    fetchMore({
                        variables: {
                            offset: answerHistories.length,
                        },
                        updateQuery: (prev: { user: { answerHistories: any } }, { fetchMoreResult }: any) => {
                            if (
                                !(
                                    fetchMoreResult &&
                                    fetchMoreResult.user &&
                                    fetchMoreResult.user.answerHistories &&
                                    fetchMoreResult.user.answerHistories.length > 0
                                )
                            ) {
                                setFinished(true);
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
                ListFooterComponent={() => <ListFooter finished={finished} />}
            />
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    answer: {
        padding: PxFit(Theme.itemSpace),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    container: {
        flexGrow: 1,
        padding: PxFit(Theme.itemSpace),
        backgroundColor: '#f9f9f9',
    },
    content: {
        padding: PxFit(Theme.itemSpace),
        borderColor: '#f0f0f0',
        borderBottomWidth: PxFit(0.6),
    },
    questionItem: {
        marginBottom: PxFit(Theme.itemSpace),
        borderRadius: PxFit(5),
        backgroundColor: '#fff',
    },
    subjectText: {
        fontSize: PxFit(15),
        lineHeight: PxFit(20),
        color: Theme.primaryFont,
    },
    answerText: {
        fontSize: PxFit(13),
        color: Theme.subTextColor,
    },
});

export default AllAnswerLog;
