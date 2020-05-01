import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { StyleSheet, Animated, View, Text, ImageBackground, Image } from 'react-native';
import { useCirculationAnimation } from '@src/common';
import { playSound } from '../playSound';
import Sound from 'react-native-sound';

const MusicPlayer = props => {
    const { audio, duration, repeat, resetState, callback, store, score } = props;
    const [subTime, setSubTime] = useState(duration);
    const count = useRef(1);
    const answered = useRef(false);
    const whoosh = useRef();

    const randomAnswer = useCallback(() => {
        if (!answered.current) {
            answered.current = true;
            if (Math.random() > store.robotOdds) {
                store.calculateScore(score[count.current - 1].gold * store.scoreMultiple, 'RIVAL');
            }
        }
    }, []);

    useEffect(() => {
        const timer: number = setInterval(() => {
            setSubTime(prevCount => {
                // 机器人答题条件
                if (store.isRobot && prevCount < duration - 1 && Math.random() > 0.3) {
                    randomAnswer();
                }
                if (prevCount === 0) {
                    if (repeat === count.current) {
                        callback();
                        clearInterval(timer);
                        return 0;
                    }
                    answered.current = false;
                    count.current++;
                    resetState();
                    return duration;
                }
                return prevCount - 1;
            });
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        if (subTime === 3) {
            playSound('count_down.mp3');
        }
    }, [subTime]);

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

    // 播放器动画
    const recordAnimation = useCirculationAnimation({ duration: 10000, start: true });
    const recordStyle = recordAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const waveAnimations = useRef(
        Array.from({ length: 2 }).map(() => new Animated.Value(0)),
        [],
    ).current;

    useEffect(() => {
        Animated.loop(
            Animated.parallel(
                waveAnimations.map(animation => {
                    return Animated.timing(animation, {
                        toValue: 1,
                        duration: 5000,
                    });
                }),
            ),
        ).start(() => {});
    }, []);

    const waveStyles = useMemo(() => {
        return waveAnimations.map((animation, order) => ({
            transform: [
                {
                    rotateZ: animation.interpolate({
                        inputRange: [0, 0.25, 0.5, 0.75, 1],
                        outputRange:
                            order > 0
                                ? ['-15deg', '-30deg', '0deg', '-30deg', '-15deg']
                                : ['15deg', '30deg', '0deg', '30deg', '15deg'],
                        extrapolate: 'clamp',
                    }),
                },
                {
                    scale: animation.interpolate({
                        inputRange: [0, 0.25, 0.5, 0.75, 1],
                        outputRange: [1.1, 1.2, 1, 1.2, 1.1],
                        extrapolate: 'clamp',
                    }),
                },
            ],
        }));
    }, []);

    return (
        <View style={styles.container}>
            {waveStyles.map((waveStyle, index) => (
                <Animated.View key={index} style={[styles.wave, specialStyle[index], waveStyle]} />
            ))}
            <ImageBackground style={styles.recordBg} source={require('@src/assets/images/record_bg.png')}>
                <Animated.Image
                    style={[styles.recordAlbum, { transform: [{ rotateZ: recordStyle }] }]}
                    source={require('@src/assets/images/record_album01.png')}
                />
                <View style={styles.countDown}>
                    <Text style={styles.countDownText}>{subTime}</Text>
                </View>
            </ImageBackground>
        </View>
    );
};

const specialStyle = [
    {
        borderRadius: PxFit(40),
        backgroundColor: `rgba(255,255,255,0.5)`,
    },
    {
        borderRadius: PxFit(30),
        backgroundColor: `rgba(255,255,255,0.3)`,
    },
];

const width = Device.WIDTH / 3 - PxFit(36);

const styles = StyleSheet.create({
    container: {
        marginHorizontal: PxFit(15),
        borderWidth: PxFit(3),
        borderRadius: (Device.WIDTH / 3 - PxFit(30)) / 2,
        borderColor: '#fff',
    },
    wave: {
        position: 'absolute',
        top: PxFit(0),
        left: PxFit(0),
        height: width,
        width: width,
    },
    recordBg: {
        height: width,
        width: width,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordAlbum: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: width,
        width: width,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    countDown: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    countDownText: {
        fontSize: PxFit(15),
        color: '#81A1F4',
    },
});

export default MusicPlayer;
