import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text } from 'react-native';
import { playSound } from '../playSound';

const height = ((Device.WIDTH / 3) * 123) / 221;

interface Props {
    duration: number;
    repeat: number;
    resetState: Function;
    callback: Function;
}

const RepeatCountDown = (props: Props) => {
    const { duration, repeat, resetState, callback, store, score } = props;
    const [subTime, setSubTime] = useState(duration);
    const count = useRef(1);
    const answered = useRef(false);
    // 机器人随机答题
    const randomAnswer = useCallback(() => {
        if (!answered.current) {
            answered.current = true;
            // 正确率
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

    return (
        <View
            style={{
                backgroundColor: Theme.white,
                width: height - PxFit(10),
                height: height - PxFit(10),
                borderRadius: (height - PxFit(10)) / 2,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <View
                style={{
                    backgroundColor: '#FCA838',
                    width: height - PxFit(20),
                    height: height - PxFit(20),
                    borderRadius: (height - PxFit(20)) / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <View
                    style={{
                        backgroundColor: Theme.white,
                        width: height - PxFit(30),
                        height: height - PxFit(30),
                        borderRadius: (height - PxFit(30)) / 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            backgroundColor: '#4E84E6',
                            width: height - PxFit(34),
                            height: height - PxFit(34),
                            borderRadius: (height - PxFit(34)) / 2,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{ color: Theme.white }}>{subTime}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default RepeatCountDown;
