import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Player, TouchFeedback, PlaceholderImage, OverlayViewer, Iconfont, Avatar, Audio } from '@src/components';
import { observer } from '@src/screens/answer/store';
import Selections from './Selections';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useNavigation } from 'react-navigation-hooks';

export default observer(({ store, question, audit }) => {
    const { isMultiple } = store;
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
            <View
                style={{
                    position: 'absolute',
                    width: Font(52),
                    height: Font(24),
                    left: 0,
                    top: Font(1),
                    borderRadius: Font(12),
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isMultiple ? '#FBF5D7' : '#DFEEFF',
                }}>
                <Text
                    style={{
                        color: isMultiple ? '#EAA329' : '#7D9EC4',
                        fontSize: Font(12),
                        fontWeight: '600',
                    }}>
                    {isMultiple ? '多选题' : '单选题'}
                </Text>
            </View>
        );
    }, [isMultiple]);

    const content = useMemo(() => {
        const { image, video, audio } = question;
        if (image) {
            const { width, height, path } = image;
            const style = Helper.singleImageResponse(width, height, Device.WIDTH - PxFit(24));
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
            return <Player style={{ marginTop: PxFit(20) }} size={styles.video} video={video} />;
        }

        if (audio && audio.url) {
            return <Audio.Player style={styles.audioContainer} audio={audio} />;
        }

        return null;
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
                    <Avatar source={user.avatar} userId={user.id} size={PxFit(27)} />
                    <Text style={styles.userName}>{user.name}</Text>
                </TouchableOpacity>
            </View>
        );
    }, [question]);

    return (
        <View style={styles.content}>
            {askQuestionUser}
            <View>
                {answerType}
                <Text style={styles.description}>
                    &emsp;&emsp;&emsp;&ensp;
                    {question.description}
                    {/* {answerReward} */}
                </Text>
            </View>
            {content}
            <View style={{ marginTop: PxFit(20) }}>
                <Selections question={question} store={store} audit={audit} />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    content: {},
    description: {
        color: '#666666',
        fontSize: Font(16),
        lineHeight: PxFit(26),
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
        width: Device.WIDTH - 60,
        height: (Device.WIDTH * 9) / 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    video: {
        width: Device.WIDTH - PxFit(40),
        height: (Device.WIDTH - PxFit(40)) * 0.65,
    },
    audioContainer: {
        marginTop: PxFit(Theme.itemSpace),
        width: PxFit(160),
        height: PxFit(36),
        paddingHorizontal: PxFit(14),
        borderRadius: PxFit(18),
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
    askUser: {
        flexDirection: 'row',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: PxFit(5),
        borderRadius: PxFit(5),
        paddingVertical: PxFit(5),
    },
    userItemText: { fontSize: PxFit(14), color: '#212121' },
    userName: { fontSize: Font(13), color: '#424242', paddingHorizontal: PxFit(5) },
});
