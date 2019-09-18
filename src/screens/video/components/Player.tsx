import React, { PureComponent, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Animated, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import { Iconfont } from 'components';
import { observer } from 'store';
import { PxFit, Theme, Tools } from 'utils';
import VideoStore from '../VideoStore';
import VideoLoading from './VideoLoading';
import { useNavigation } from 'react-navigation-hooks';

export default observer(props => {
    const { media } = props;
    const navigation = useNavigation();
    const progress = useRef(0);
    const videoRef = useRef();
    const [paused, setPause] = useState(true);
    const [loading, setLoaded] = useState(true);
    const intoView = useMemo(() => !(media.id === VideoStore.intoViewVideoId), [VideoStore.intoViewVideoId]);
    const resizeMode = useMemo(() => {
        const videoHeight = media.height;
        const videoWidth = media.width;
        return videoHeight > videoWidth * 1.3 ? 'cover' : 'contain';
    }, [media]);

    const togglePause = useCallback(() => {
        setPause(v => !v);
    }, []);

    const videoEvents = useMemo((): object => {
        return {
            onLoadStart() {},

            onLoad() {
                setLoaded(false);
            },

            onProgress(data) {
                media.currentTime = data.currentTime;
            },

            onEnd() {},

            onError() {},

            onAudioBecomingNoisy() {
                setPause(true);
            },

            onAudioFocusChanged(event: { hasAudioFocus: boolean }) {
                videoRef.current.seek(0);
                // if (!paused && !event.hasAudioFocus) {
                // setPause(true);
                // }
            },
        };
    }, []);

    useEffect(() => {
        if (media.currentTime) {
            progress.current = media.currentTime;
        }
    }, [media.currentTime]);

    useEffect(() => {
        const navWillFocusListener = navigation.addListener('willFocus', () => {
            setPause(intoView);
        });
        const navWillBlurListener = navigation.addListener('willBlur', () => {
            setPause(true);
        });
        return () => {
            navWillFocusListener.remove();
            navWillBlurListener.remove();
        };
    }, [intoView]);

    return (
        <TouchableWithoutFeedback onPress={togglePause}>
            <View style={styles.playContainer}>
                <Video
                    ref={videoRef}
                    poster={media.cover}
                    posterResizeMode={resizeMode}
                    resizeMode={resizeMode}
                    paused={paused}
                    source={{
                        uri: media.url,
                    }}
                    style={styles.fullScreen}
                    rate={1} // 控制暂停/播放，0 代表暂停paused, 1代表播放normal.
                    volume={1} // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数
                    muted={false} // true代表静音，默认为false.
                    progressUpdateInterval={150}
                    disableFocus={true}
                    useTextureView={false}
                    repeat={true} // 是否重复播放
                    ignoreSilentSwitch="obey"
                    {...videoEvents}
                />
                {paused && <Iconfont name="play" size={PxFit(70)} color="#fff" style={{ opacity: 0.8 }} />}
                <VideoLoading loading={loading} />
                <View style={[styles.progress, { width: progress.current + '%' }]} />
            </View>
        </TouchableWithoutFeedback>
    );
});

const styles = StyleSheet.create({
    playContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    progress: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 0,
        height: PxFit(1),
        backgroundColor: '#fff',
    },
});
