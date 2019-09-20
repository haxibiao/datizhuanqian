import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList, StatusBar, Image } from 'react-native';

import { GQL, useQuery, useLazyQuery, useMutation, useApolloClient } from 'apollo';
import { observer } from 'store';
import { exceptionCapture } from 'common';
import { Config, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit, Tools, Theme } from 'utils';

import VideoItem from './components/VideoItem';
import Footer from './components/Footer';
import RewardProgress from './components/RewardProgress';
import VideoStore from './VideoStore';
import CommentOverlay from '../comment/CommentOverlay';
import { useNavigation } from 'react-navigation-hooks';

export default observer(props => {
    const client = useApolloClient();
    const navigation = useNavigation();
    const commentRef = useRef();
    const activeItem = useRef(0);
    const config = useRef({
        waitForInteraction: true,
        viewAreaCoveragePercentThreshold: 95,
    });

    VideoStore.showComment = useCallback(() => {
        commentRef.current.slideUp();
    }, [commentRef]);

    const hideComment = useCallback(() => {
        commentRef.current.slideDown();
    }, [commentRef]);

    const onLayout = useCallback(event => {
        const { height } = event.nativeEvent.layout;
        VideoStore.viewportHeight = height;
    }, []);

    const VideosQuery = useCallback(() => {
        return client.query({
            query: GQL.VideosQuery,
            variables: { limit: 5, offset: VideoStore.dataSource.length },
        });
    }, [client]);

    const fetchData = useCallback(async () => {
        VideoStore.isLoadMore = true;
        const [error, result] = await exceptionCapture(VideosQuery);
        const videoSource = Tools.syncGetter('data.videos', result);
        if (error) {
            VideoStore.isError = true;
        } else {
            if (Array.isArray(videoSource) && videoSource.length > 0) {
                VideoStore.addSource(videoSource);
            } else {
                VideoStore.isFinish = true;
            }
        }
        VideoStore.isLoadMore = false;
    }, [VideosQuery]);

    const getVisibleRows = useCallback(info => {
        if (info.viewableItems[0]) {
            activeItem.current = info.viewableItems[0].index;
            VideoStore.viewableItemIndex = activeItem.current;
        }
    }, []);

    const onMomentumScrollEnd = useCallback(
        event => {
            if (VideoStore.dataSource.length - activeItem.current <= 3) {
                fetchData();
            }
        },
        [fetchData],
    );

    useEffect(() => {
        const navWillBlurListener = navigation.addListener('willBlur', () => {
            hideComment();
        });
        fetchData();
        return () => {
            navWillBlurListener.remove();
        };
    }, []);

    const question = useMemo(() => {
        const media = VideoStore.dataSource[VideoStore.viewableItemIndex];
        return media ? media.question : {};
    }, [VideoStore.viewableItemIndex]);

    return (
        <View style={styles.container} onLayout={onLayout}>
            <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'light-content'} />
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
                renderItem={({ item, index }) => <VideoItem media={item} index={index} />}
                getItemLayout={(data, index) => ({
                    length: VideoStore.viewportHeight,
                    offset: VideoStore.viewportHeight * index,
                    index,
                })}
                ListEmptyComponent={
                    <View style={styles.cover}>
                        <Image style={styles.curtain} source={require('@src/assets/images/curtain.png')} />
                    </View>
                }
                ListFooterComponent={<Footer />}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onViewableItemsChanged={getVisibleRows}
                viewabilityConfig={config.current}
            />
            <View style={styles.rewardProgress}>
                <RewardProgress />
            </View>
            <CommentOverlay ref={commentRef} question={question} />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#131C1C',
        flex: 1,
    },
    cover: {
        ...StyleSheet.absoluteFill,
    },
    curtain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null,
    },
    rewardProgress: {
        position: 'absolute',
        left: PxFit(Theme.itemSpace),
        bottom: PxFit(140 + Theme.HOME_INDICATOR_HEIGHT),
    },
});
