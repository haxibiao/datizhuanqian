import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList, StatusBar, Image } from 'react-native';
import { GQL, useApolloClient } from 'apollo';
import { observer, app, config as configStore } from 'store';
import { exceptionCapture, throttle } from 'common';
import { PxFit, Tools, Theme } from 'utils';
import { beginnerGuidance, VideoGuidance } from 'components';

import VideoItem from './components/VideoItem';
import Footer from './components/Footer';
import RewardProgress from './components/RewardProgress';
import VideoStore from './VideoStore';
import CommentOverlay from '../comment/CommentOverlay';
import { useNavigation } from 'react-navigation-hooks';
import service from 'service';

export default observer(props => {
    const { launched } = app;
    const client = useApolloClient();
    const navigation = useNavigation();
    const commentRef = useRef();
    const config = useRef({
        waitForInteraction: true,
        viewAreaCoveragePercentThreshold: 95,
    });
    const post = useMemo(() => {
        const activeItem = VideoStore.dataSource[VideoStore.viewableItemIndex >= 0 ? VideoStore.viewableItemIndex : 0];
        return activeItem ? activeItem : {};
    }, [VideoStore.dataSource, VideoStore.viewableItemIndex]);

    const onLayout = useCallback(event => {
        const { height } = event.nativeEvent.layout;
        app.viewportHeight = height;
    }, []);

    VideoStore.showComment = useCallback(() => {
        if (TOKEN) {
            commentRef.current.slideUp();
        } else {
            navigation.navigate('Login');
        }
    }, [commentRef]);

    const hideComment = useCallback(() => {
        commentRef.current.slideDown();
    }, [commentRef]);

    const VideosQuery = useCallback(() => {
        return client.query({
            query: GQL.HotPostsQuery,
            variables: { offset: VideoStore.dataSource.length, limit: 10 },
            fetchPolicy: 'network-only',
        });
    }, [client]);

    const fetchData = useCallback(async () => {
        if (VideoStore.isLoadMore) {
            return;
        }
        VideoStore.isLoadMore = true;
        const [error, result] = await exceptionCapture(VideosQuery);
        console.log('result :', result, error);
        const videoSource = Tools.syncGetter('data.posts', result);
        if (error) {
            VideoStore.isError = true;
        } else {
            if (Array.isArray(videoSource) && videoSource.length > 0) {
                VideoStore.addSource(videoSource);
                VideoStore.addVisit(videoSource[0]);
                console.log('videoSource:', VideoStore.dataSource);
            } else {
                VideoStore.isFinish = true;
            }
        }
        VideoStore.isLoadMore = false;
    }, [VideosQuery]);

    const reportData = useCallback(
        throttle(() => {
            client
                .mutate({
                    mutation: GQL.SaveVisitsMutation,
                    variables: { visits: VideoStore.visits },
                })
                .then(data => {
                    console.log('reportData', data);
                    VideoStore.visits = [];
                    fetchData();
                })
                .catch(err => {
                    console.log('err :', err);
                    fetchData();
                });
        }, 1200),
        [client, fetchData],
    );

    const getVisibleRows = useCallback(info => {
        if (info.viewableItems[0]) {
            VideoStore.viewableItemIndex = info.viewableItems[0].index;
        }
    }, []);

    const onMomentumScrollEnd = useCallback(() => {
        VideoStore.addVisit(VideoStore.dataSource[VideoStore.viewableItemIndex]);
        if (VideoStore.dataSource.length - VideoStore.viewableItemIndex <= 2) {
            reportData();
        }
    }, [reportData]);

    useEffect(() => {
        const navWillFocusListener = props.navigation.addListener('willFocus', () => {
            StatusBar.setBarStyle('light-content');
            !configStore.disableAd &&
                beginnerGuidance({
                    guidanceKey: 'Video',
                    GuidanceView: VideoGuidance,
                    dismissEnabled: true,
                });

            service.dataReport({
                data: { category: '用户行为', action: 'user_click_video_screen', name: '用户点击进入学习视频页' },
                callback: (result: any) => {
                    console.warn('result', result);
                },
            });
        });
        const navWillBlurListener = navigation.addListener('willBlur', () => {
            StatusBar.setBarStyle('dark-content');
            hideComment();
        });

        return () => {
            navWillFocusListener.remove();
            navWillBlurListener.remove();
        };
    }, []);

    const fetchGuidanceVideo = () => {
        client
            .query({
                query: GQL.PostQuery,
                variables: { id: 10667 },
                fetchPolicy: 'network-only',
            })
            .then((result: any) => {
                const post = Tools.syncGetter('data.post', result);
                VideoStore.setGuidanceVideo(post);
            })
            .catch((error: any) => {});
    };

    useEffect(() => {
        if (launched) {
            fetchData();
            fetchGuidanceVideo();
        }
        return () => {
            VideoStore.reset();
        };
    }, [launched]);

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
                renderItem={({ item, index }) => <VideoItem media={item} index={index} />}
                getItemLayout={(data, index) => ({
                    length: app.viewportHeight,
                    offset: app.viewportHeight * index,
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
            {!configStore.disableAd && (
                <View style={styles.rewardProgress}>
                    <RewardProgress />
                </View>
            )}
            <CommentOverlay ref={commentRef} question={post} isPost />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#131C1C',
        flex: 1,
    },
    cover: {
        flex: 1,
        // ...StyleSheet.absoluteFill,
    },
    curtain: {
        alignItems: 'center',
        flex: 1,
        height: null,
        justifyContent: 'center',
        width: null,
    },
    rewardProgress: {
        bottom: PxFit(380 + Theme.HOME_INDICATOR_HEIGHT),
        position: 'absolute',
        right: PxFit(Theme.itemSpace),
    },
});
