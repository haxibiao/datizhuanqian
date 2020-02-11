import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Animated, Keyboard } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from '@src/utils';
import { useLinearAnimation, useKeyboardListener } from '@src/common';
import { Audio } from '@src/components';
import { observer, useQuestionStore } from '../store';
import SelectionItem from './SelectionItem';
import { useNavigation } from 'react-navigation-hooks';

export default observer(props => {
    const store = useQuestionStore();
    const navigation = useNavigation();
    const firstRender = useRef(true);
    const [audioHeight, setAudioHeight] = useState(0);
    const [slideIn, setSlideIn] = useState(false);
    const { contentImagePicker, contentVideoPicker, picture, video, audio, setQuestionAudio } = store;
    const [animation, startAnimation] = useLinearAnimation({ initValue: 0, duration: 200 });

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
        } else {
            if (slideIn) {
                startAnimation();
            } else {
                startAnimation(1, 0);
            }
        }
    }, [slideIn]);

    const height = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [audioHeight == 0 ? 400 : 0, audioHeight],
    });

    const toggleAudioTool = useCallback(e => {
        Keyboard.dismiss();
        setSlideIn(slideIn => {
            return !slideIn;
        });
    }, []);

    const showAudio = useCallback(e => {
        setSlideIn(false);
    }, []);

    useKeyboardListener(showAudio);

    return (
        <View style={styles.container}>
            <View style={styles.toolsContainer}>
                <TouchableOpacity disabled={!!(video || audio)} style={styles.toolItem} onPress={contentImagePicker}>
                    <Image
                        style={styles.toolImg}
                        source={
                            !(video || audio)
                                ? require('@src/assets/images/img_publish_video_or_img.png')
                                : require('@src/assets/images/img_publish_video_or_img_disabled.png')
                        }
                    />
                    <Text style={[styles.toolName, !!(video || audio) && { color: '#999EAD' }]}>相册</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={!!(picture || audio)} style={styles.toolItem} onPress={contentVideoPicker}>
                    <Image
                        style={styles.toolImg}
                        source={
                            !(picture || audio)
                                ? require('@src/assets/images/icon_add_video.png')
                                : require('@src/assets/images/icon_add_video_disabled.png')
                        }
                    />
                    <Text style={[styles.toolName, !!(picture || audio) && { color: '#999EAD' }]}>视频</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={!!(picture || video)} style={styles.toolItem} onPress={toggleAudioTool}>
                    <Image
                        style={styles.toolImg}
                        source={
                            !(picture || video)
                                ? require('@src/assets/images/icon_add_voice.png')
                                : require('@src/assets/images/icon_add_voice_disable.png')
                        }
                    />
                    <Text style={[styles.toolName, !!(picture || video) && { color: '#999EAD' }]}>录音</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolItem} onPress={() => navigation.navigate('EditExplain')}>
                    <Image style={styles.toolImg} source={require('@src/assets/images/icon_add_vote.png')} />
                    <Text style={styles.toolName}>解析</Text>
                </TouchableOpacity>
            </View>
            <Animated.View
                style={[{ overflow: 'hidden', height }, audioHeight == 0 && { position: 'absolute', bottom: -500 }]}>
                <Audio.Recorder
                    onLayout={event => {
                        if (audioHeight == 0) {
                            setAudioHeight(event.nativeEvent.layout.height);
                        }
                    }}
                    style={styles.audioContainer}
                    completeRecording={(path, key) => setQuestionAudio({ ...audio, path, key })}
                />
            </Animated.View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
    toolsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: PxFit(1),
        borderTopColor: '#F1EFFA',
    },
    toolItem: {
        paddingVertical: PxFit(10),
        paddingHorizontal: PxFit(15),
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolImg: {
        width: PxFit(30),
        height: PxFit(30),
        resizeMode: 'cover',
    },
    toolName: {
        fontSize: PxFit(12),
        color: '#149EFF',
        marginTop: PxFit(6),
    },
    audioContainer: {
        paddingVertical: PxFit(20),
        borderTopWidth: PxFit(1),
        borderTopColor: '#F1EFFA',
    },
});
