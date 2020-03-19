import React, { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, FlatList, StatusBar, Image } from 'react-native';

import { GQL } from 'apollo';
import { observer, app } from 'store';
import { exceptionCapture } from 'common';
import { Iconfont, TouchFeedback } from 'components';

import RewardProgress from './components/RewardProgress';

import VideoItem from './components/VideoItem';
import Footer from './components/Footer';
import VideoStore from './VideoStore';
import CommentOverlay from '../comment/CommentOverlay';

// TODO: 视频动态查看需重构

export default observer(props => {
    const { navigation } = props;
    const medium = navigation.getParam('medium') || [];
    const activeIndex = navigation.getParam('index') || 0;
    const isPost = navigation.getParam('isPost') || false;
    const activeItem = useRef(0);
    // const [questions, setQuestions] = useState(data);
    console.log('medium', medium);
    const commentRef = useRef();

    VideoStore.showComment = useCallback(() => {
        console.log('commentRef', commentRef);
        commentRef.current.slideUp();
    }, [commentRef]);

    const hideComment = useCallback(() => {
        commentRef.current.slideDown();
    }, [commentRef]);

    const config = useRef({
        waitForInteraction: true,
        viewAreaCoveragePercentThreshold: 95,
    });

    const onLayout = useCallback(event => {
        const { height } = event.nativeEvent.layout;
        VideoStore.viewportHeight = height;
    }, []);

    const VideosQuery = useCallback(() => {
        return app.client.query({
            query: GQL.HotPostsQuery,
            variables: {
                limit: 10,
                offset: VideoStore.dataSource.length,
                user_id: medium[0].user.id,
            },
        });
    }, [app.client]);

    const fetchData = useCallback(async () => {
        VideoStore.isLoadMore = true;
        const [error, result] = await exceptionCapture(VideosQuery);
        console.log('result', result, error);
        const videoSource = Helper.syncGetter('data.posts', result);

        if (error) {
            VideoStore.isError = true;
        } else {
            if (Array.isArray(videoSource) && videoSource.length > 0) {
                console.log('videoSource', videoSource);
                VideoStore.addSource(videoSource);
            } else {
                VideoStore.isFinish = true;
            }
        }
        VideoStore.isLoadMore = false;
    }, [VideosQuery]);

    const onMomentumScrollEnd = useCallback(() => {
        if (VideoStore.dataSource.length - activeItem.current <= 3) {
            if (medium.length > 1) {
                fetchData();
            }
        }
    }, [fetchData]);

    const getVisibleRows = useCallback(info => {
        if (info.viewableItems[0]) {
            activeItem.current = info.viewableItems[0].index;
            VideoStore.viewableItemIndex = activeItem.current;
        }
    }, []);

    useEffect(() => {
        // fetchData({ authentication: firstAuthenticationQuery.current });
        VideoStore.viewableItemIndex = activeIndex;

        VideoStore.addSource(medium);

        // if (isComment) {
        //     VideoStore.showComment();
        // }
        //TODO: 没有自动唤起评论

        const navWillFocusListener = navigation.addListener('willFocus', () => {
            if (VideoStore.viewableItemIndex < 0) {
                VideoStore.viewableItemIndex = 0;
            }
        });
        const navWillBlurListener = navigation.addListener('willBlur', () => {
            hideComment();
        });

        return () => {
            navWillFocusListener.remove();
            navWillBlurListener.remove();
            VideoStore.dataSource = [];
            VideoStore.viewableItemIndex = -1;
        };
    }, []);

    const media = VideoStore.dataSource[VideoStore.viewableItemIndex];

    if (!media) return null;
    return (
        <View style={styles.container} onLayout={onLayout}>
            <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'dark-content'} />
            <FlatList
                data={VideoStore.dataSource}
                contentContainerStyle={{ flexGrow: 1 }}
                bounces={false}
                scrollsToTop={false}
                showsVerticalScrollIndicator={false}
                initialScrollIndex={activeIndex}
                keyboardShouldPersistTaps="always"
                pagingEnabled={true}
                removeClippedSubviews={true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <VideoItem media={item} index={index} navigation={navigation} isPost={isPost} />
                )}
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

            {medium.length > 1 && (
                <View style={styles.rewardProgress}>
                    <RewardProgress />
                </View>
            )}
            <CommentOverlay
                ref={commentRef}
                question={isPost ? media : media.video}
                isSpider={isPost ? false : true}
                isPost={isPost}
            />
            <TouchFeedback
                style={styles.header}
                onPress={() => {
                    navigation.goBack();
                }}>
                <Iconfont name={'left'} size={20} color={Theme.white} />
            </TouchFeedback>
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
    rewardProgress: {
        bottom: PxFit(300 + Theme.HOME_INDICATOR_HEIGHT),
        position: 'absolute',
        right: PxFit(Theme.itemSpace),
    },
});
