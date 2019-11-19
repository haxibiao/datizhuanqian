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
    const { duration, repeat, resetState, callback } = props;
    const [subTime, setSubTime] = useState(duration);
    const count = useRef(1);

    useEffect(() => {
        const timer: number = setInterval(() => {
            if (subTime === 0 && repeat === count.current) {
                callback();
            } else if (subTime === 0) {
                count.current++;
                resetState();
                setSubTime(duration);
            } else {
                setSubTime(prevCount => prevCount - 1);
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
