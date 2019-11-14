import React, { useMemo, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, Animated } from 'react-native';
import { Avatar, Row, Center, Iconfont } from '@src/components';
import { PxFit, SCREEN_WIDTH } from '@src/utils';
import { useLinearAnimation } from '@src/common';
import { observer, app } from 'store';

const width = SCREEN_WIDTH / 2 + PxFit(60);
const height = (width * 150) / 492;

const competitor = observer(props => {
    const { user, theLeft } = props;
    const [animation, startAnimation] = useLinearAnimation({ initValue: 0, duration: 500 });

    const source = useMemo(
        () =>
            props.theLeft
                ? require('@src/assets/images/compete_blue.png')
                : require('@src/assets/images/compete_yellow.png'),
        [props],
    );
    useEffect(() => {
        startAnimation();
    }, []);

    const animateStyles = useMemo(
        () => ({
            opacity: animation,
            transform: [
                {
                    translateX: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [theLeft ? -SCREEN_WIDTH : SCREEN_WIDTH, 0],
                        extrapolate: 'clamp',
                    }),
                },
            ],
        }),
        [animation],
    );

    return (
        <Animated.View style={[{ alignItems: 'center' }, animateStyles]}>
            <ImageBackground style={theLeft ? styles.leftUser : styles.rightUser} source={source}>
                <Avatar
                    source={user.avatar}
                    size={height - PxFit(16)}
                    style={theLeft ? styles.competeLeftAvatar : styles.competeRightAvatar}
                />
            </ImageBackground>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    competeLeftAvatar: {
        borderColor: '#fff',
        borderWidth: PxFit(3),
        marginRight: PxFit(7),
    },
    competeRightAvatar: {
        borderColor: '#fff',
        borderWidth: PxFit(3),
        marginLeft: PxFit(7),
    },
    leftUser: {
        alignItems: 'flex-end',
        height: ((SCREEN_WIDTH / 3) * 123) / 221,
        justifyContent: 'center',
        width: SCREEN_WIDTH / 3,
    },
    rightUser: {
        height: ((SCREEN_WIDTH / 3) * 123) / 221,
        justifyContent: 'center',
        width: SCREEN_WIDTH / 3,
    },
});

export default competitor;
