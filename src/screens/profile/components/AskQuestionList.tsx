/*
 * @flow
 * created by wyk made in 2019-03-22 16:31:22
 */
'use strict';

import React, { Component, useEffect, useState, useCallback } from 'react';
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
import { compose, useQuery, Mutation, graphql, GQL } from 'apollo';
import { app } from 'store';
import { exceptionCapture } from 'common';

import QuestionItem from './QuestionItem';

const AskQuestionList = (props: any) => {
    const [finished, setFinished] = useState(false);

    const { data, loading, refetch, error, fetchMore } = useQuery(GQL.SpidersQuery, {
        variables: {
            limit: 10,
        },
        fetchPolicy: 'network-only',
    });

    const spiders = Tools.syncGetter('spiders', data);
    console.log('spiders', spiders);
    return (
        <PageContainer hiddenNavBar loading={loading} empty={spiders && spiders.length < 1} error={error}>
            <FlatList
                contentContainerStyle={styles.container}
                data={spiders}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <QuestionItem video={item.video} spiders={spiders} navigation={props.navigation} spider={item} />
                )}
                refreshControl={<CustomRefreshControl onRefresh={refetch} reset={() => setFinished(false)} />}
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                    fetchMore({
                        variables: {
                            offset: spiders.length,
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                            if (!(fetchMoreResult && fetchMoreResult.spiders && fetchMoreResult.spiders.length > 0)) {
                                setFinished(true);
                                return prev;
                            }
                            return Object.assign({}, prev, {
                                spiders: [...prev.spiders, ...fetchMoreResult.spiders],
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
    container: {
        flexGrow: 1,
        paddingHorizontal: PxFit(Theme.itemSpace),
        backgroundColor: '#fff',
    },
});

export default AskQuestionList;
