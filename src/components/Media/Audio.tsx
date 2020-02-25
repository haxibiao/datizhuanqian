import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, Dimensions, Platform, View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import Iconfont from '../Iconfont';
import WaveView from '../Container/WaveView';
import GradientView from '../Basics/GradientView';
import { Theme, PxFit, Tools } from '../../utils';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import Sound from 'react-native-sound';
import * as Progress from 'react-native-progress';
import { Overlay } from 'teaset';
import AudioTracks, { AnimatedTracks } from './AudioTracks';
import RNFetchBlob from 'rn-fetch-blob';

// playingListener
// stoppedListener

const mainButtonImage = {
    none: require('@src/assets/images/ic_speech_record.png'),
    recording: require('@src/assets/images/ic_speech_pause.png'),
    stopped: require('@src/assets/images/ic_speech_play.png'),
    played: require('@src/assets/images/ic_speech_stop.png'),
};

const recordingState = {
    none: '点击录音',
    recording: '录音中',
    stopped: '录音完成',
    played: '点击停止',
};

function TimeFormat(second) {
    let i = 0,
        s = parseInt(second);
    if (s > 60) {
        i = parseInt(s / 60);
        s = parseInt(s % 60);
    }
    // 补零
    let zero = function(v) {
        return v >> 0 < 10 ? '0' + v : v;
    };
    return [zero(i), zero(s)].join(':');
}

export type RecordStatus = 'none' | 'recording' | 'stopped' | 'played';

// 录音器
export const Recorder = ({ style, onLayout, invisible, completeRecording, minimumTime = 3 }) => {
    const hasPermission = useRef(true);
    const audioDirectoryPath = useRef(AudioUtils.DocumentDirectoryPath + '/test.aac');
    const [audioFilePath, setAudioFilePath] = useState('');
    const [duration, setDuration] = useState(0);
    const [status, setStatus] = useState('none');
    const recordStatus = useRef('none');
    const whoosh = useRef();
    const minDuration = useRef();

    useEffect(() => {
        if (invisible) {
            if (status === 'recording') {
                stopRecord();
            } else if (status === 'played') {
                stopSound();
            }
        }
    }, [invisible, status, stopRecord, stopSound]);

    useEffect(() => {
        recordStatus.current = status;
    }, [status]);

    useEffect(() => {
        minDuration.current = duration;
    }, [duration]);

    const prepareRecordingPath = useCallback(audioPath => {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: 'Low',
            AudioEncoding: 'aac',
            AudioEncodingBitRate: 32000,
        });
    }, []);

    const finishRecording = useCallback((didSucceed, filePath) => {
        if (didSucceed) {
            if (minDuration.current < minimumTime) {
                Toast.show({ content: '录音失败，时长过短' });
                deleteAudio();
                return;
            }
            setAudioFilePath(filePath);
        }
    }, []);

    useEffect(() => {
        AudioRecorder.requestAuthorization().then(isGranted => {
            hasPermission.current = isGranted;
            if (!isGranted) {
                return;
            }

            AudioRecorder.onProgress = data => {
                if (Math.ceil(data.currentTime) >= 60) {
                    stopRecord();
                }
                setDuration(Math.ceil(data.currentTime));
            };

            AudioRecorder.onFinished = data => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    finishRecording(data.status === 'OK', data.audioFileURL);
                }
            };
        });
    }, []);

    const record = useCallback(async () => {
        console.log('开始录音!');

        if (recordStatus.current === 'recording') {
            return;
        }

        if (!hasPermission.current) {
            Toast.show({ content: '请开启录音权限' });
            return;
        }

        prepareRecordingPath(audioDirectoryPath.current);

        setStatus('recording');

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.log(error);
        }
    }, []);

    const stopRecord = useCallback(async () => {
        if (recordStatus.current === 'recording') {
            setStatus('stopped');

            try {
                const filePath = await AudioRecorder.stopRecording();
                if (Platform.OS === 'android') {
                    finishRecording(true, filePath);
                }
                return filePath;
            } catch (error) {
                console.error(error);
            }
        }
    }, []);

    const playSound = useCallback(async () => {
        if (recordStatus.current === 'recording') {
            await stopRecord();
        }

        setStatus('played');

        setTimeout(() => {
            whoosh.current = new Sound(
                audioDirectoryPath.current,
                '',
                error => {
                    if (error) {
                        console.log('failed to load the sound', error);
                    }
                },
                {
                    playingListener: () => {
                        // setStatus('stopped');
                    },
                    stoppedListener: () => {
                        setStatus('stopped');
                    },
                },
            );

            setTimeout(() => {
                whoosh.current.play(success => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 100);
        }, 100);
    }, []);

    const stopSound = useCallback(() => {
        if (recordStatus.current === 'played' && whoosh.current) {
            whoosh.current.stop();
            whoosh.current.release();
        }
        setStatus('stopped');
    }, []);

    const deleteAudio = useCallback(() => {
        whoosh.current = null;
        setAudioFilePath('');
        setDuration(0);
        setStatus('none');
    }, []);

    const uploadAudio = useCallback((audio, callback) => {
        return new Promise((resolve, reject) => {
            RNFetchBlob.fetch(
                'POST',
                'http://video.datizhuanqian.com/api/audio',
                {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer access-token',
                },
                [{ api_token: TOKEN, type: 'audio/aac', data: RNFetchBlob.wrap(audio) }],
            )
                .then(resp => {
                    const res = resp.text();
                    console.log('resp', res);
                    resolve(res);
                })
                .catch(err => {
                    console.log('err', err);
                    reject(err);
                });
        });

        // return new Promise((resolve, reject) => {
        //     var data = new FormData();
        //     data.append('api_token', TOKEN);
        //     data.append('audio', audio);
        //     const config = {
        //         method: 'POST',
        //         headers: {
        //             Accept: 'application/json',
        //             'Content-Type': 'multipart/form-data',
        //         },
        //         body: data,
        //     };
        //     console.log('config', config);
        //     fetch('http://video.datizhuanqian.com/api/audio', config)
        //         .then(response => response.json())
        //         .then(data => {
        //             console.log('data', data);
        //             resolve(data);
        //         })
        //         .catch(err => {
        //             console.log('err', err);
        //             reject(err);
        //         });
        // });
    }, []);

    const complete = useCallback(async () => {
        if (completeRecording) {
            await uploadAudio(audioFilePath);
            completeRecording(audioFilePath, Math.random(0, 1));
            deleteAudio();
        }
    }, [audioFilePath]);

    const showDeleteModal = useCallback(() => {
        let overlayRef;
        Overlay.show(
            <Overlay.View modal animated ref={ref => (overlayRef = ref)}>
                <View style={styles.overlayInner}>
                    <View style={styles.contentWrap}>
                        <Text style={styles.modalContent}>是否删除当前录音</Text>
                        <View style={styles.modalOperation}>
                            <TouchableWithoutFeedback onPress={() => overlayRef.close()}>
                                <View style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>取消</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    deleteAudio();
                                    overlayRef.close();
                                }}>
                                <View
                                    style={[styles.modalButton, { marginLeft: PxFit(20), backgroundColor: '#FF5E7D' }]}>
                                    <Text style={[styles.modalButtonText, { color: '#fff' }]}>删除</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
            </Overlay.View>,
        );
    }, []);

    const operation = useMemo(
        () => ({ none: record, recording: stopRecord, stopped: playSound, played: stopSound }),
        [],
    );

    return (
        <View style={[styles.recorderContainer, style || {}]} onLayout={onLayout}>
            <View style={styles.audioInfo}>
                <Text style={styles.audioProgress}>{TimeFormat(duration)}</Text>
                <View style={styles.audioStateWrap}>
                    <Text style={styles.audioState}>{recordingState[status]}</Text>
                    {status === 'recording' && <View style={styles.redDot} />}
                    {status === 'recording' && <Text style={styles.audioState}>60秒内</Text>}
                </View>
            </View>
            <View style={styles.tracksContainer}>
                {status === 'played' && <AnimatedTracks maxWidth={MAIN_BUTTON_WIDTH * 2} multiple={PxFit(2)} />}
            </View>
            <View style={styles.utils}>
                {!!audioFilePath && (
                    <TouchableWithoutFeedback onPress={showDeleteModal}>
                        <View>
                            <Image
                                source={require('@src/assets/images/ic_message_opt_delete.png')}
                                style={styles.sideButton}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                )}

                <TouchableWithoutFeedback onPress={operation[status]}>
                    <View style={styles.mainButtonWrap}>
                        {status === 'recording' && (
                            <WaveView containerStyle={styles.waveContainer} style={styles.wave} />
                        )}

                        <Image source={mainButtonImage[status]} style={styles.mainButton} />
                    </View>
                </TouchableWithoutFeedback>

                {!!audioFilePath && (
                    <TouchableWithoutFeedback onPress={complete}>
                        <View>
                            <Image
                                source={require('@src/assets/images/ic_done_round_big.png')}
                                style={styles.sideButton}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </View>
        </View>
    );
};

// 语音播放
export const Player = ({ audio, style, fontSize = PxFit(14) }) => {
    const [status, setStatus] = useState('paused');
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const whoosh = useRef();
    const currentStatus = useRef('paused');
    const timer = useRef();
    const onPress = useCallback(() => {
        if (whoosh.current) {
            if (currentStatus.current !== 'played') {
                setStatus('played');
                clearInterval(timer.current);
                timer.current = setInterval(() => {
                    setCurrentTime(v => v + 0.1);
                }, 100);
                whoosh.current.play(success => {});
            } else if (currentStatus.current == 'played') {
                clearInterval(timer.current);
                whoosh.current.pause();
                setStatus('paused');
            }
        }
    }, []);

    useEffect(() => {
        currentStatus.current = status;
    }, [status]);

    useEffect(() => {
        if (audio) {
            whoosh.current = new Sound(
                audio,
                '',
                error => {
                    if (error) {
                        Toast.show({ content: '播放异常' });
                        return;
                    }
                    setDuration(Math.ceil(whoosh.current.getDuration()));
                },
                {
                    playingListener: () => {
                        // setStatus('played');
                    },
                    stoppedListener: () => {
                        if (whoosh.current) {
                            whoosh.current.stop(() => {
                                setStatus('paused');
                                setCurrentTime(0);
                                clearInterval(timer.current);
                            });
                        }
                    },
                },
            );
        }

        return () => {
            if (whoosh.current) {
                whoosh.current.release();
            }
        };
    }, [audio]);

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <GradientView colors={['#16B2F5', '#1CDEE2']} style={style}>
                <View style={styles.playerContainer}>
                    <Iconfont name={status === 'played' ? 'play' : 'paused'} size={fontSize} color="#fff" />
                    <View style={{ flex: 1, height: fontSize, paddingHorizontal: fontSize / 2 }}>
                        <AudioTracks duration={duration} currentTime={currentTime} />
                    </View>
                    <Text style={[styles.durationText, { fontSize }]}>
                        {duration < 10 ? '0' + duration : duration}"
                    </Text>
                </View>
            </GradientView>
        </TouchableWithoutFeedback>
    );
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const MAIN_BUTTON_WIDTH = SCREEN_WIDTH / 4;
const SIDE_BUTTON_WIDTH = MAIN_BUTTON_WIDTH / 3;
// FF5E7D
const styles = StyleSheet.create({
    audioInfo: {
        alignItems: 'center',
    },
    audioProgress: {
        color: '#404950',
        fontSize: PxFit(17),
        fontWeight: 'bold',
    },
    audioStateWrap: {
        marginTop: PxFit(15),
        flexDirection: 'row',
        alignItems: 'center',
    },
    audioState: {
        color: '#C4BFCF',
        fontSize: PxFit(15),
    },
    redDot: {
        width: PxFit(4),
        height: PxFit(4),
        borderRadius: PxFit(2),
        backgroundColor: '#FF5E7D',
        marginHorizontal: PxFit(4),
    },
    mainButtonWrap: {
        width: PxFit(MAIN_BUTTON_WIDTH),
        height: PxFit(MAIN_BUTTON_WIDTH),
    },
    mainButton: {
        ...StyleSheet.absoluteFill,
        width: PxFit(MAIN_BUTTON_WIDTH),
        height: PxFit(MAIN_BUTTON_WIDTH),
    },
    playerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    durationText: {
        color: '#fff',
        fontSize: PxFit(16),
    },
    recorderContainer: {
        justifyContent: 'center',
    },
    sideButton: {
        height: PxFit(SIDE_BUTTON_WIDTH),
        width: PxFit(SIDE_BUTTON_WIDTH),
    },
    utils: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    wave: {
        height: PxFit(MAIN_BUTTON_WIDTH * 0.8),
        width: PxFit(MAIN_BUTTON_WIDTH * 0.8),
        borderRadius: PxFit(MAIN_BUTTON_WIDTH * 0.8),
        backgroundColor: '#b997ff',
    },
    waveContainer: {
        bottom: 0,
        left: PxFit(MAIN_BUTTON_WIDTH * 0.1),
        position: 'absolute',
        right: 0,
        top: PxFit(MAIN_BUTTON_WIDTH * 0.1),
    },
    tracksContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: PxFit(40),
    },
    overlayInner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentWrap: {
        padding: PxFit(30),
        paddingHorizontal: PxFit(20),
        borderRadius: PxFit(10),
        backgroundColor: '#fff',
    },
    modalContent: {
        color: '#404950',
        fontSize: PxFit(16),
        marginTop: PxFit(20),
        marginBottom: PxFit(40),
        textAlign: 'center',
    },
    modalOperation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalButton: {
        width: PxFit(120),
        height: PxFit(46),
        borderRadius: PxFit(23),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ECEAF3',
    },
    modalButtonText: {
        color: '#202020',
        fontSize: PxFit(14),
    },
});

// const resume = useCallback(async () => {
//     if (status !== 'paused') {
//         console.log("Can't resume, not paused!");
//         return;
//     }

//     try {
//         await AudioRecorder.resumeRecording();
//         setStatus('recording');
//     } catch (error) {
//         console.error(error);
//     }
// }, [status]);

// const pause = useCallback(async () => {
//     if (status !== 'recording') {
//         console.log("Can't pause, not recording!");
//         return;
//     }

//     try {
//         const filePath = await AudioRecorder.pauseRecording();
//         setStatus('paused');
//     } catch (error) {
//         console.error(error);
//     }
// }, [status]);

// function checkPermission() {
//     console.log('checkPermission');

//     if (Platform.OS !== 'android') {
//         return Promise.resolve(true);
//     }
//     console.log('rationale');

//     const rationale = {
//         title: '访问麦克风',
//         message: '是否允许软件访问您的麦克风以便可以录制音频',
//     };
//     PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale).then(result => {
//         console.log('Permission result:', result);

//         return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
//     });
// }
