import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { VideoMark, OverlayViewer } from '@src/components';
import ImageViewer from 'react-native-image-zoom-viewer';

export default ({ explanation, audit }) => {
    const MEDIA_WIDTH = audit ? Device.WIDTH - PxFit(48) : Device.WIDTH - PxFit(24);

    const explain = useMemo(() => {
        const result = {};
        result.video = Helper.syncGetter('video', explanation);
        result.text = Helper.syncGetter('content', explanation);
        result.image = Helper.syncGetter('images.0.path', explanation);
        return result;
    }, [explanation]);

    const showPicture = useCallback(() => {
        const imageViewer = (
            <ImageViewer
                onSwipeDown={() => OverlayViewer.hide()}
                imageUrls={[{ url: explain.image }]}
                enableSwipeDown
                saveToLocalByLongPress={false}
                loadingRender={() => {
                    return <ActivityIndicator size="large" color={'#fff'} />;
                }}
            />
        );
        OverlayViewer.show(imageViewer);
    }, [explain]);

    return (
        <View style={styles.explainContainer} elevation={10}>
            {explain.text && (
                <View style={styles.contentContainer}>
                    <Text style={styles.content}>{`解析：${explain.text}`}</Text>
                </View>
            )}

            {explain.image && (
                <View style={styles.mediaContainer}>
                    <TouchableWithoutFeedback onPress={showPicture}>
                        <Image
                            source={{ uri: explain.image }}
                            style={[styles.imageCover, { width: MEDIA_WIDTH, height: MEDIA_WIDTH * 0.6 }]}
                        />
                    </TouchableWithoutFeedback>
                </View>
            )}

            {explain.video && (
                <View style={styles.mediaContainer}>
                    <TouchableWithoutFeedback
                        onPress={() => Helper.middlewareNavigate('VideoExplanation', { video: explain.video })}>
                        <View style={styles.imageCover}>
                            <Image source={require('@src/assets/images/video_explain.jpg')} style={styles.cover} />
                            <VideoMark size={PxFit(60)} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    explainContainer: {
        padding: PxFit(12),
        backgroundColor: '#fff',
    },
    contentContainer: {
        backgroundColor: '#F2F5F7',
        borderRadius: PxFit(2),
        marginBottom: PxFit(20),
        padding: PxFit(10),
    },
    content: {
        fontSize: PxFit(17),
        lineHeight: PxFit(25),
        color: '#525252',
    },
    mediaContainer: {
        marginBottom: PxFit(20),
    },
    imageCover: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    cover: {
        position: 'absolute',
        width: null,
        height: null,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
