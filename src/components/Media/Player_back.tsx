import React, { Component, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Easing, TouchableOpacity, BackHandler } from 'react-native';
import { withNavigation } from 'react-navigation';
import Video from 'react-native-video';
import { Theme, PxFit, Config, SCREEN_WIDTH, ISAndroid, Tools } from '../../utils';
import Iconfont from '../Iconfont';
import VideoStatus from './VideoStatus';
import VideoControl from './VideoControl';

import { observer, Provider, inject } from 'mobx-react';
import { config, app } from 'store';
import VideoStore from './VideoStore';
import Orientation from 'react-native-orientation';

const Player = props => {
    let { video, style, inScreen, navigation, isVideoList, isIntoView } = props;
    const videoStore = new VideoStore({ video, inScreen, navigation, isVideoList, isIntoView });

    useEffect(() => {
        videoStore.paused = !isIntoView;
        if (ISAndroid) {
            BackHandler.addEventListener('hardwareBackPress', _backButtonPress);
        }
        const navWillBlurListener = navigation.addListener('willBlur', () => {
            videoStore.paused = true;
        });
        return () => {
            navWillBlurListener.remove();
            // 离开固定竖屏
            Orientation.lockToPortrai;
        };
    }, [isIntoView]);

    const _backButtonPress = () => {
        if (config.isFullScreen) {
            this.videoStore.onFullScreen();
            return true;
        }
        return false;
    };

    let {
        status,
        orientation,
        paused,
        getVideoRef,
        controlSwitch,
        onAudioBecomingNoisy,
        onAudioFocusChanged,
        loadStart,
        onLoaded,
        onProgressChanged,
        onPlayEnd,
        onPlayError,
    } = videoStore;
    return (
        <View
            style={[
                styles.playContainer,
                style,
                config.isFullScreen
                    ? {
                          width: config.screenWidth,
                          height: config.screenHeight,
                          marginTop: 0,
                          position: 'absolute',
                          zIndex: 10000,
                      }
                    : styles.defaultSize,
            ]}>
            {status !== 'notWifi' && (
                <Video
                    style={styles.videoStyle}
                    ref={getVideoRef}
                    source={{
                        uri: video.url,
                    }}
                    // poster={video.cover}
                    rate={1.0}
                    volume={1.0}
                    muted={false}
                    paused={paused}
                    resizeMode={'contain'}
                    disableFocus={true}
                    useTextureView={false}
                    playWhenInactive={false}
                    playInBackground={false}
                    onLoadStart={loadStart} // 当视频开始加载时的回调函数
                    onLoad={onLoaded} // 当视频加载完毕时的回调函数
                    onProgress={onProgressChanged} //每250ms调用一次，以获取视频播放的进度
                    onEnd={onPlayEnd}
                    onError={onPlayError}
                    onAudioBecomingNoisy={onAudioBecomingNoisy}
                    onAudioFocusChanged={onAudioFocusChanged}
                    ignoreSilentSwitch="obey"
                />
            )}
            <TouchableOpacity activeOpacity={1} onPress={controlSwitch} style={styles.controlContainer}>
                <VideoControl videoStore={this.videoStore} />
            </TouchableOpacity>
            <VideoStatus videoStore={this.videoStore} />
        </View>
    );
};

const styles = StyleSheet.create({
    playContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    defaultSize: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 0.65,
    },
    videoStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    controlContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

export default Player;
