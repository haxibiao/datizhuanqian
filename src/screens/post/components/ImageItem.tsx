import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Iconfont } from 'components';

interface Media {
    width: any;
    height: any;
    cover?: any; //视频截图地址
    path?: any; //图片地址
    url?: string;
}

interface Props {
    media: Media;
}

const VideoItem = (props: Props) => {
    const { media } = props;

    const isVideo = media && media.url;

    const maxHeight = PxFit(240); //媒体最大高度
    const maxWidth = Device.WIDTH - Theme.itemSpace * 2; //媒体最大宽度
    const mediaWidth = (media && media.width) || 1; //媒体宽度
    const mediaHeight = (media && media.height) || 1; //媒体高度

    const isLargeScale = mediaWidth > mediaHeight && mediaWidth / mediaHeight > maxWidth / maxHeight; //是否比例超过最大宽高比

    //大比例图片样式
    const largeScaleImageStyle = {
        width: maxWidth,
        height: (maxWidth * mediaHeight) / mediaWidth,
        borderRadius: PxFit(5),
        backgroundColor: '#000',
    };

    //小比例图片样式
    const smallScaleImageStyle = {
        width: PxFit(240) * (mediaWidth / mediaHeight),
        height: PxFit(240),
        borderRadius: PxFit(5),
        backgroundColor: '#000',
    };

    //大比例视频截图播放按钮位置
    const largeScaleIconStyle = {
        position: 'absolute',
        top: ((maxWidth * mediaHeight) / mediaWidth - PxFit(34)) / 2,
        left: (PxFit(maxWidth) - PxFit(34)) / 2,
        bottom: 0,
        right: 0,
    };
    //小比例视频截图播放按钮位置
    const smallScaleIconStyle = {
        position: 'absolute',
        top: PxFit(103),
        left: (PxFit(240) * (mediaWidth / mediaHeight) - PxFit(34)) / 2,
        bottom: 0,
        right: 0,
    };

    if (!media) return null;
    return (
        <View style={styles.image}>
            <Image
                source={{ uri: isVideo ? media.cover : media.path }}
                style={isLargeScale ? largeScaleImageStyle : smallScaleImageStyle}
            />
            {isVideo && (
                <Iconfont
                    name="paused"
                    size={PxFit(34)}
                    color="#fff"
                    style={isLargeScale ? largeScaleIconStyle : smallScaleIconStyle}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        marginTop: PxFit(10),
        borderRadius: PxFit(5),
    },
});

export default VideoItem;
