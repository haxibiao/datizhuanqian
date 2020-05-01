/*
 * @flow
 * created by wyk made in 2019-02-25 17:34:23
 */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, BackHandler } from 'react-native';
import { withNavigation } from 'react-navigation';
import Video from 'react-native-video';
import VideoStatus from './VideoStatus';
import VideoControl from './VideoControl';

import { observer } from 'mobx-react';
import { config } from 'store';
import VideoStore from './VideoStore';
import Orientation from 'react-native-orientation';

@observer
class Player extends Component {
    constructor(props) {
        super(props);
        let { video, inScreen, navigation, isVideoList, isIntoView } = props;
        this.videoStore = new VideoStore({ video, inScreen, navigation, isVideoList, isIntoView });
        this.state = {
            muted: false,
        };
    }

    componentDidMount() {
        let { navigation } = this.props;
        // let BackHandler = ReactNative.BackHandler ? ReactNative.BackHandler : ReactNative.BackAndroid;
        if (Device.Android) {
            BackHandler.addEventListener('hardwareBackPress', this._backButtonPress);
        }
        this.willBlurSubscription = navigation.addListener('willBlur', () => {
            this.videoStore.paused = true;
        });
    }

    componentWillUpdate(nextProps) {
        if (this.props.isIntoView !== nextProps.isIntoView && this.videoStore.status == 'hide') {
            this.videoStore.paused = !nextProps.isIntoView;
        }
    }

    componentWillUnmount() {
        this.willBlurSubscription.remove();
        // 离开固定竖屏
        Orientation.lockToPortrait();
    }

    _backButtonPress = () => {
        if (config.isFullScreen) {
            this.videoStore.onFullScreen();
            return true;
        }
        return false;
    };

    render() {
        let { video, style, size = { width: Device.WIDTH, height: Device.WIDTH * 0.65 } } = this.props;
        let {
            status,
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
        } = this.videoStore;
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
                        : size,
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
    }
}

const styles = StyleSheet.create({
    playContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
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
export default withNavigation(Player);
