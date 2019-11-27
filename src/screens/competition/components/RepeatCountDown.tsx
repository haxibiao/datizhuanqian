import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { Theme, SCREEN_WIDTH, PxFit } from 'utils';

const height = ((SCREEN_WIDTH / 3) * 123) / 221;

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

    const randomAnswer = useCallback(() => {
        if (!answered.current) {
            answered.current = true;
            store.score[1] += Math.random() > 0.5 ? score[count.current - 1].gold * store.scoreMultiple : 0;
        }
    }, []);

    useEffect(() => {
        console.log('====================================');
        console.log('setInterval');
        console.log('====================================');
        const timer: number = setInterval(() => {
            setSubTime(prevCount => {
                if (prevCount === 0) {
                    if (repeat === count.current) {
                        answered.current = false;
                        callback();
                        clearInterval(timer);
                        return 0;
                    }
                    count.current++;
                    resetState();
                    return duration;
                }
                return prevCount - 1;
            });
            // 机器人答题条件
            if (prevCount < duration - 1 && Math.random() > 0.5) {
                randomAnswer();
            }
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

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
