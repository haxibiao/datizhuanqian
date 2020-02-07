import React, { useContext, useCallback, useMemo } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { TouchFeedback, Iconfont, PullChooser, OverlayViewer } from '@src/components';
import { Theme, PxFit } from '@src/utils';
import Video from 'react-native-video';
import ImageViewer from 'react-native-image-zoom-viewer';
import { observer, useQuestionStore } from '../store';

export default observer(props => {
    const store = useQuestionStore();
    const { explainImagePicker, explainVideoPicker } = store;
    const { style, picture, videoPath, setPicture, setVideo } = props;

    const onSelect = useCallback(() => {
        PullChooser.show([
            {
                title: '视频',
                onPress: explainVideoPicker,
            },
            {
                title: '图片',
                onPress: explainImagePicker,
            },
        ]);
    }, []);

    const showPicture = useCallback(url => {
        const overlayView = (
            <ImageViewer
                onSwipeDown={() => OverlayViewer.hide()}
                imageUrls={[
                    {
                        url,
                    },
                ]}
                enableSwipeDown
            />
        );
        OverlayViewer.show(overlayView);
    }, []);

    const showVideo = useCallback(uri => {
        console.log('====================================');
        console.log('uri', uri);
        console.log('====================================');
        const overlayView = (
            <Video
                source={{
                    uri,
                }}
                style={styles.videoViewer}
                muted={false}
                paused={false}
                resizeMode="contain"
            />
        );
        OverlayViewer.show(overlayView);
    }, []);

    const content = useMemo(() => {
        if (picture) {
            return (
                <TouchFeedback onPress={() => showPicture(picture)}>
                    <Image
                        source={{
                            uri: picture,
                        }}
                        style={styles.addImage}
                    />
                    <TouchableOpacity style={styles.closeBtn} onPress={() => setPicture()}>
                        <Iconfont name={'close'} size={PxFit(20)} color="#fff" />
                    </TouchableOpacity>
                </TouchFeedback>
            );
        } else if (videoPath) {
            return (
                <TouchFeedback onPress={() => showVideo(videoPath)}>
                    <Video
                        muted
                        source={{
                            uri: videoPath,
                        }}
                        style={styles.addImage}
                        resizeMode="cover"
                        repeat
                    />
                    <TouchableOpacity style={styles.closeBtn} onPress={() => setVideo(null)}>
                        <Iconfont name={'close'} size={PxFit(20)} color="#fff" />
                    </TouchableOpacity>
                </TouchFeedback>
            );
        } else {
            return (
                <TouchableOpacity style={styles.addImage} onPress={onSelect}>
                    <Image
                        style={{
                            width: PxFit(40),
                            height: PxFit(30),
                        }}
                        source={require('../../../assets/images/camera.png')}
                    />
                </TouchableOpacity>
            );
        }
    }, [picture, videoPath, setPicture, setVideo, onSelect]);

    return <View style={[styles.container, style]}>{content}</View>;
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    addImage: {
        width: PxFit(90),
        height: PxFit(90),
        backgroundColor: Theme.groundColour,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: PxFit(20),
        height: PxFit(20),
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoViewer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});
