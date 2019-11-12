import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList, StatusBar, Image } from 'react-native';

import { GQL, useQuery, useLazyQuery, useMutation, useApolloClient } from 'apollo';
import { observer, app } from 'store';
import { exceptionCapture } from 'common';
import { Config, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit, Tools, Theme } from 'utils';
import { Iconfont, TouchFeedback } from 'components';

import VideoItem from './components/VideoItem';
import Footer from './components/Footer';
import VideoStore from './VideoStore';
import CommentOverlay from '../comment/CommentOverlay';
import { useNavigation } from 'react-navigation-hooks';

// TODO: 视频动态查看需重构

export default observer(props => {
    const { navigation } = props;
    const data = navigation.getParam('videos') || [];
    const activeIndex = navigation.getParam('index') || 0;
    const isComment = navigation.getParam('isComment') || false;
    const activeItem = useRef(0);
    // const [questions, setQuestions] = useState(data);
    console.log('data', data);
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
            query: GQL.myVideoQuestionHistoryQuery,
            variables: {
                limit: 5,
                offset: VideoStore.dataSource.length,
                QuestionFormEnumType: 'NON_SELECTION',
            },
        });
    }, [app.client]);

    const fetchData = useCallback(async () => {
        VideoStore.isLoadMore = true;
        const [error, result] = await exceptionCapture(VideosQuery);
        const videoSource = Tools.syncGetter('data.user.questions', result);

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

    const onMomentumScrollEnd = useCallback(
        event => {
            if (VideoStore.dataSource.length - activeItem.current <= 3) {
                fetchData();
            }
        },
        [fetchData],
    );

    const getVisibleRows = useCallback(info => {
        if (info.viewableItems[0]) {
            activeItem.current = info.viewableItems[0].index;
            VideoStore.viewableItemIndex = activeItem.current;
        }
    }, []);

    useEffect(() => {
        // fetchData({ authentication: firstAuthenticationQuery.current });
        VideoStore.viewableItemIndex = activeIndex;

        VideoStore.addSource(data);

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

    const question = VideoStore.dataSource[VideoStore.viewableItemIndex];

    console.log('question', question);
    if (!question) return null;
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
                renderItem={({ item, index }) => <VideoItem spider={item} index={index} navigation={navigation} />}
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
                // onMomentumScrollEnd={onMomentumScrollEnd}
                onViewableItemsChanged={getVisibleRows}
                viewabilityConfig={config.current}
            />

            <CommentOverlay ref={commentRef} question={question.video} isPost={true} />
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
});
