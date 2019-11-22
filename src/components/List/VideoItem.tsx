import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';
import Iconfont from '../Iconfont';

interface Video {
    width: Number;
    height: Number;
    url: String;
    cover: String;
}

interface Props {
    video: Video;
}

const VideoItem = (props: Props) => {
    const { video } = props;

    const maxHeight = 240;
    const maxWidth = SCREEN_WIDTH - Theme.itemSpace * 2;
    const videoWidth = (video && video.width) || 1;
    const videoHeight = (video && video.height) || 1;

    const isLargeScale = videoWidth > videoHeight && videoWidth / videoHeight > maxWidth / maxHeight;
    return (
        <View style={styles.image}>
            <Image
                source={{ uri: video && video.cover }}
                style={
                    isLargeScale
                        ? {
                              width: maxWidth,
                              height: (maxWidth * videoHeight) / videoWidth,
                              borderRadius: PxFit(5),
                              backgroundColor: '#000',
                          }
                        : {
                              width: PxFit(240) * (videoWidth / videoHeight),
                              height: PxFit(240),
                              borderRadius: PxFit(5),
                              backgroundColor: '#000',
                          }
                }
            />
            <Iconfont
                name='paused'
                size={PxFit(34)}
                color='#fff'
                style={
                    isLargeScale
                        ? {
                              position: 'absolute',
                              top: ((maxWidth * videoHeight) / videoWidth - PxFit(34)) / 2,
                              left: (PxFit(maxWidth) - PxFit(34)) / 2,
                              bottom: 0,
                              right: 0,
                          }
                        : {
                              position: 'absolute',
                              top: PxFit(103),
                              left: (PxFit(240) * (videoWidth / videoHeight) - PxFit(34)) / 2,
                              bottom: 0,
                              right: 0,
                          }
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        // marginVertical: PxFit(10),
        marginTop: PxFit(10),
        borderRadius: PxFit(5),
    },
});

export default VideoItem;
