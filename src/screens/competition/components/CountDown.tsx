import React from 'react';
import { View, Text } from 'react-native';
import { Theme, SCREEN_WIDTH, Tools, PxFit } from 'utils';
import { observer, app } from 'store';

const width = SCREEN_WIDTH / 3;
const height = ((SCREEN_WIDTH / 3) * 123) / 221;

interface Props {
    countDown: Number;
}

const CountDown = (props: Props) => {
    const { countDown } = props;
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
                    backgroundColor: Theme.primaryColor,
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
                            backgroundColor: Theme.blue,
                            width: height - PxFit(34),
                            height: height - PxFit(34),
                            borderRadius: (height - PxFit(34)) / 2,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{ color: Theme.white }}>{countDown}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default CountDown;
