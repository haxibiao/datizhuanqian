import React, { useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, View, Image, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Player, overlayView, TouchFeedback, PlaceholderImage, OverlayViewer, Iconfont, Avatar } from '@src/components';
import { Theme, PxFit, Tools, SCREEN_WIDTH } from '@src/utils';
import { observer, useQuestionStore } from '@src/screens/answer/store';
import Selections from './Selections';
import ImageViewer from 'react-native-image-zoom-viewer';
import question from 'src/screens/question';
import { useNavigation } from 'react-navigation-hooks';

export default observer(({ store }) => {
    const { question, selections, setSelectionText, setAnswers, isMultiple } = store;
    const navigation = useNavigation();

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
        return (
            <Text style={{ color: isMultiple ? '#FF5E7D' : '#8282FF' }}>{isMultiple ? '(多选题)' : '(单选题)'}</Text>
        );
    }, [isMultiple]);

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

    const askQuestionUser = useMemo(() => {
        const user = question.user;
        if (user.id == 1) {
            return null;
        }
        return (
            <View style={styles.askUser}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.userItem}
                    onPress={() => navigation.navigate('User', { user })}>
                    <Text style={styles.userItemText}>出题人：</Text>
                    <Text style={styles.userName}>({user.name})</Text>
                    <Avatar source={user.avatar} userId={user.id} size={PxFit(22)} />
                </TouchableOpacity>
            </View>
        );
    }, [question]);

    const content = useMemo(() => {
        const { image, video } = question;
        if (image) {
            const { width, height, path } = image;
            const style = Tools.singleImageResponse(width, height, SCREEN_WIDTH - PxFit(24));
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
            return <Player style={{ marginTop: PxFit(Theme.itemSpace) }} size={styles.video} video={video} />;
        }

        return null;
    }, [question]);

    return (
        <View style={styles.content}>
            <Text style={styles.description}>
                {answerType}
                {question.description}
                {/* {answerReward} */}
            </Text>
            {content}
            <View style={{ marginTop: PxFit(20) }}>
                <Selections store={store} />
            </View>
            {askQuestionUser}
        </View>
    );
});

const styles = StyleSheet.create({
    content: {},
    description: {
        color: '#525252',
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
    video: {
        width: SCREEN_WIDTH - PxFit(24),
        height: (SCREEN_WIDTH - PxFit(24)) * 0.65,
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
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: PxFit(20),
        backgroundColor: '#E3F2FD',
        borderRadius: PxFit(5),
        paddingHorizontal: PxFit(10),
        paddingVertical: PxFit(5),
    },
    userItemText: { fontSize: PxFit(14), color: '#5F93FD' },
    userName: { fontSize: PxFit(14), color: '#5F93FD', paddingRight: PxFit(5) },
});
