import React, { Component, useState, useEffect } from 'react';
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
import { Query, withApollo, compose, useQuery, GQL } from 'apollo';

import UserProfile from './UserProfile';
import PostItem from './PostItem';
import Placeholder from './Placeholder';

const Posts = props => {
    const { navigation, userInfo } = props;

    const [finished, setFinished] = useState(false);

    const { data, error, loading, refetch, fetchMore } = useQuery(GQL.HotPostsQuery, {
        variables: {
            id: userInfo.id,
            limit: 10,
        },
        fetchPolicy: 'network-only',
    });

    useEffect(() => {}, []);

    if (loading) {
        return <Placeholder />;
    }

    const posts = Tools.syncGetter('posts', data) || [];

    return (
        <PageContainer refetch={refetch} error={error} hiddenNavBar>
            <FlatList
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
                }}
                style={styles.container}
                data={posts}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={<UserProfile user={posts[0].user} navigation={navigation} />}
                ListEmptyComponent={<StatusView.EmptyView title='空空如也，没有出过题目' />}
                renderItem={({ item, index }) => (
                    <PostItem post={item} navigation={navigation} posts={posts} activeIndex={index} />
                )}
                refreshControl={<CustomRefreshControl onRefresh={refetch} reset={() => setFinished(false)} />}
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                    fetchMore({
                        variables: {
                            offset: posts.length,
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                            if (
                                !(
                                    fetchMoreResult &&
                                    fetchMoreResult &&
                                    fetchMoreResult.posts &&
                                    fetchMoreResult.posts.length > 0
                                )
                            ) {
                                setFinished(true);
                                return prev;
                            }
                            return Object.assign({}, prev, {
                                posts: [...prev.posts, ...fetchMoreResult.posts],
                            });
                        },
                    });
                }}
                ListFooterComponent={() => (posts.length == 0 ? <View /> : <ListFooter finished={finished} />)}
            />
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
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

export default Posts;
