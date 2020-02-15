import React, { useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, View, Image, Text, ActivityIndicator } from 'react-native';
import { Player, overlayView, TouchFeedback, PlaceholderImage, OverlayViewer, Iconfont } from '@src/components';
import { Theme, PxFit, Tools, SCREEN_WIDTH } from '@src/utils';
import { observer, useQuestionStore } from '../store';
import Selections from './Selections';
import ImageViewer from 'react-native-image-zoom-viewer';
import question from 'src/screens/question';

export default observer(({ question }) => {
    const store = useQuestionStore();
    const { selections, setSelectionText, setAnswers } = store;

    const showPicture = useCallback(url => {
        const imageViewer = (
            <ImageViewer
                onSwipeDown={() => OverlayViewer.hide()}
                imageUrls={[{ url }]}
                enableSwipeDown
                saveToLocalByLongPress={false}
                loadingRender={() => {
                    return <ActivityIndicator size="large" color={'#fff'} />;
                }}
            />
        );
        OverlayViewer.show(imageViewer);
    }, []);

    const answerType = useMemo(() => {
        const isMultiple = String(question.answer).length > 1;
        return (
            <Text style={{ color: isMultiple ? Theme.blue : Theme.primaryColor }}>
                {isMultiple ? '(多选题)' : '(单选题)'}
            </Text>
        );
    }, [question]);

    const answerReward = useMemo(() => {
        if (!question.audit && question.gold > 0) {
            return (
                <Text style={{ color: Theme.primaryColor }}>
                    （{question.gold}*
                    <Iconfont name="diamond" size={PxFit(14)} color={Theme.primaryColor} />）
                </Text>
            );
        } else {
            return null;
        }
    }, [question]);

    const content = useMemo(() => {
        const { image, video } = question;
        if (image) {
            const { width, height, path } = image;
            const style = Tools.singleImageResponse(width, height, SCREEN_WIDTH - PxFit(Theme.itemSpace) * 4);
            return (
                <View style={styles.imageCover}>
                    <TouchFeedback style={{ overflow: 'hidden' }} onPress={() => showPicture(path)}>
                        <PlaceholderImage style={style} source={{ uri: path }} />
                        <View style={styles.amplification}>
                            <Iconfont name="fullScreen" size={PxFit(14)} color="#fff" />
                        </View>
                    </TouchFeedback>
                </View>
            );
        }
        if (video && video.url) {
            return <Player style={{ marginTop: PxFit(Theme.itemSpace) }} video={video} />;
        }

        return null;
    }, [question]);

    return (
        <View style={styles.content}>
            <Text style={styles.description}>
                {answerType}
                {description}
                {answerReward}
            </Text>
            {content}
            <View style={{ marginHorizontal: PxFit(Theme.itemSpace), marginTop: PxFit(20) }}>
                <Selections />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    content: {},
    description: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(16),
        lineHeight: PxFit(22),
    },
    imageCover: {
        marginTop: PxFit(Theme.itemSpace),
        alignItems: 'center',
        justifyContent: 'center',
    },
    subject: {
        color: Theme.correctColor,
        fontSize: PxFit(16),
        lineHeight: PxFit(22),
        fontWeight: '500',
    },
    videoCover: {
        marginTop: PxFit(Theme.itemSpace),
        width: SCREEN_WIDTH - 60,
        height: (SCREEN_WIDTH * 9) / 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    img: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: SCREEN_WIDTH - 60,
        height: (SCREEN_WIDTH * 9) / 16,
    },
    amplification: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: PxFit(30),
        height: PxFit(18),
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
