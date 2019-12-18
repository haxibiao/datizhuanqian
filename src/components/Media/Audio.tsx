import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, Dimensions, Platform, View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import WaveView from '../Container/WaveView';
import { Theme, PxFit, Tools } from '../../utils';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import Sound from 'react-native-sound';

const mainButtonImage = {
    stopped: require('@src/assets/images/ic_speech_play.png'),
    recording: require('@src/assets/images/ic_speech_pause.png'),
    none: require('@src/assets/images/ic_speech_record.png'),
};

const recordingState = {
    stopped: '录音完成',
    recording: '录音中',
    none: '点击录音',
};

export type RecordStatus = 'none' | 'recording' | 'stopped';

export const Recorder = () => {
    const audioDirectoryPath = useRef(AudioUtils.DocumentDirectoryPath + '/test.aac');
    const hasPermission = useRef(true);
    const [audioFilePath, setAudioFilePath] = useState('');
    const [currentTime, setCurrentTime] = useState(0);
    const [status, setStatus] = useState('none');
    const recordStatus = useRef('none');

    useEffect(() => {
        recordStatus.current = status;
    }, [status]);

    const prepareRecordingPath = useCallback(audioPath => {
        console.log('====================================');
        console.log('audioPath', audioPath);
        console.log('====================================');
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: 'Low',
            AudioEncoding: 'aac',
            AudioEncodingBitRate: 32000,
        });
    }, []);

    const finishRecording = useCallback((didSucceed, filePath, fileSize) => {
        console.log(`Finished recording at path: ${filePath} and size of ${fileSize || 0} bytes`);
        setAudioFilePath(filePath);
    }, []);

    useEffect(() => {
        AudioRecorder.requestAuthorization().then(isGranted => {
            hasPermission.current = isGranted;
            console.log('====================================');
            console.log('isGranted', isGranted);
            console.log('====================================');
            if (!isGranted) {
                return;
            }

            prepareRecordingPath(audioDirectoryPath.current);

            AudioRecorder.onProgress = data => {
                setCurrentTime(Math.ceil(data.currentTime));
            };

            AudioRecorder.onFinished = data => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    finishRecording(data.status === 'OK', data.audioFileURL, data.audioFileSize);
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

        if (recordStatus.current === 'stopped') {
            prepareRecordingPath(audioDirectoryPath.current);
        }

        setStatus('recording');

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.log(error);
        }
    }, []);

    const stop = useCallback(async () => {
        console.log('_stop _stop!');
        if (recordStatus.current !== 'recording') {
            console.log('没有录音 无需停止!');
            return;
        }

        setStatus('stopped');

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                finishRecording(true, filePath);
            }
            console.log('filePath', filePath);

            return filePath;
        } catch (error) {
            console.error(error);
        }
    }, []);

    const play = useCallback(async () => {
        if (recordStatus.current === 'recording') {
            await stop();
        }

        setTimeout(() => {
            var sound = new Sound(audioDirectoryPath.current, '', error => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
            });

            setTimeout(() => {
                sound.play(success => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 100);
        }, 100);
    }, []);

    const operation = useMemo(() => ({ none: record, recording: stop, stopped: play }), []);

    return (
        <View style={styles.recorderContainer}>
            <View style={styles.audioInfo}>
                <Text style={styles.audioProgress}>00:00</Text>
                <Text style={styles.audioState}>{recordingState[status]}</Text>
            </View>
            <View style={styles.utils}>
                {!!audioFilePath && (
                    <TouchableWithoutFeedback onPress={() => null}>
                        <View>
                            <Image
                                source={require('@src/assets/images/ic_message_opt_delete.png')}
                                style={styles.sideButton}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                )}

                <TouchableWithoutFeedback onPress={operation[status]}>
                    <View>
                        {status === 'recording' && (
                            <WaveView containerStyle={styles.waveContainer} style={styles.wave} />
                        )}
                        <Image source={mainButtonImage[status]} style={styles.mainButton} />
                    </View>
                </TouchableWithoutFeedback>

                {!!audioFilePath && (
                    <TouchableWithoutFeedback onPress={() => null}>
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

export const Player = () => {
    return <View style={styles.playerContainer}></View>;
};

const MAIN_BUTTON_WIDTH = Dimensions.get('window').width / 4;
const SIDE_BUTTON_WIDTH = MAIN_BUTTON_WIDTH / 3;
// FF5E7D
const styles = StyleSheet.create({
    audioInfo: {
        marginBottom: PxFit(40),
        alignItems: 'center',
    },
    audioProgress: {
        color: '#404950',
        fontSize: PxFit(17),
        fontWeight: 'bold',
    },
    audioState: {
        color: '#C4BFCF',
        fontSize: PxFit(15),
        marginTop: PxFit(15),
    },
    mainButton: {
        height: PxFit(MAIN_BUTTON_WIDTH),
        width: PxFit(MAIN_BUTTON_WIDTH),
    },
    playerContainer: {
        justifyContent: 'center',
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
        borderRadius: PxFit(MAIN_BUTTON_WIDTH),
        backgroundColor: '#b997ff',
    },
    waveContainer: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
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
