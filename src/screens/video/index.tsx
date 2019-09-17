import React, { Component, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native';

import { GQL, useQuery, useLazyQuery, useMutation, useApolloClient } from 'apollo';
import { observer } from 'store';
import { exceptionCapture } from 'common';
import { Config, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit } from 'utils';

import VideoItem from './components/VideoItem';
import Guide from './components/Guide';
import Footer from './components/Footer';
import VideoStore from './VideoStore';

export default observer(props => {
    const client = useApolloClient();
    const prevMedia = useRef();
    const currentMedia = useRef();
    const activeItem = useRef(0);
    const config = useRef({
        waitForInteraction: true,
        viewAreaCoveragePercentThreshold: 95,
    });
    const [viewportHeight, setViewportHeight] = useState(Device.HEIGHT);

    const recommendVideosQuery = useCallback(() => {
        return client.query({
            query: GQL.RecommendVideosQuery,
            variables: { page: VideoStore.currentPage, count: 10 },
        });
    }, []);

    const videoPlayReward = useCallback(() => {
        return client.mutate({
            mutation: GQL.videoPlayRewardMutation,
            variables: {
                input: {
                    video_id: Helper.syncGetter('video.id', prevMedia.current),
                    play_duration: Helper.syncGetter('currentTime', prevMedia.current),
                },
            },
            errorPolicy: 'all',
        });
    }, [client, prevMedia.current]);

    // const singUp = useCallback(() => {
    //     return client.mutate({
    //         mutation: GQL.signUpMutation,
    //         variables: {
    //             name: '墨友' + Date.now(),
    //             account: Device.phoneNumber,
    //             password: '123456',
    //         },
    //         errorPolicy: 'all',
    //     });
    // }, []);

    const fetchData = useCallback(async () => {
        VideoStore.isLoadMore = true;
        const [error, result] = await exceptionCapture(recommendVideosQuery);
        const videoSource = Helper.syncGetter('data.recommendVideos.data', result);
        if (error) {
            VideoStore.isError = true;
        } else {
            if (Array.isArray(videoSource) && videoSource.length > 0) {
                if (!VideoStore.intoViewVideoId) {
                    VideoStore.intoViewVideoId = videoSource[0].id;
                }
                VideoStore.addSource(videoSource);
            } else {
                VideoStore.isFinish = true;
            }
        }
        VideoStore.isLoadMore = false;
    }, []);

    const submitPlayDuration = useCallback(async () => {
        const [error, result] = await exceptionCapture(videoPlayReward);
        console.log('====================================');
        console.log(error, result);
        console.log('====================================');
        const reward = Helper.syncGetter('data.videoPlayReward.gold', result);
        if (reward) {
            Toast.show({ content: `获得${reward}墨币奖励` });
        }
    }, []);

    const onLayout = useCallback(event => {
        const { height } = event.nativeEvent.layout;
        setViewportHeight(height);
    }, []);

    const getVisibleRows = useCallback(info => {
        if (info.viewableItems[0]) {
            const temp = VideoStore.dataSource[activeItem.current];
            activeItem.current = info.viewableItems[0].index;
            VideoStore.intoViewVideoId = info.viewableItems[0].item.id;
            prevMedia.current = currentMedia.current || VideoStore.dataSource[0];
            currentMedia.current = temp;
        }
    }, []);

    const onMomentumScrollEnd = useCallback(event => {
        console.log('====================================');
        console.log('TOKEN', TOKEN);
        console.log('====================================');
        if (TOKEN) {
            submitPlayDuration();
        }
        if (activeItem.current + 3 > VideoStore.dataSource.length) {
            if (!TOKEN) {
                Toast.show({ content: `登录才能获取奖励哦` });
            }
            fetchData();
        }
    }, []);

    useEffect(() => {
        fetchData();
        const navWillFocusListener = props.navigation.addListener('willFocus', () => {
            StatusBar.setBarStyle('light-content');
        });

        return () => {
            navWillFocusListener.remove();
        };
    }, []);

    return (
        <View style={styles.container} onLayout={onLayout}>
            <FlatList
                data={VideoStore.dataSource}
                contentContainerStyle={{ flexGrow: 1 }}
                bounces={false}
                scrollsToTop={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                pagingEnabled={true}
                removeClippedSubviews={true}
                keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                renderItem={({ item, index }) => <VideoItem media={item} height={viewportHeight} />}
                getItemLayout={(data, index) => ({
                    length: viewportHeight,
                    offset: viewportHeight * index,
                    index,
                })}
                ListEmptyComponent={<View style={{ flex: 1 }} />}
                ListFooterComponent={<Footer />}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onViewableItemsChanged={getVisibleRows}
                viewabilityConfig={config.current}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 48,
        left: 15,
        bottom: 0,
        right: 0,
        height: 50,
        width: 50,
    },
});
