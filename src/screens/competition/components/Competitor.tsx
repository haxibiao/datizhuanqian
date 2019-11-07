import React, { useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, Animated } from 'react-native';
import { Avatar, Row, Center, Iconfont } from '@src/components';
import { PxFit, SCREEN_WIDTH } from '@src/utils';
import { useLinearAnimation } from '@src/common';
import { observer, app } from 'store';

const width = SCREEN_WIDTH / 2 + PxFit(60);
const height = (width * 150) / 492;

const competitor = observer(props => {
    const { user, fadeIn, theLeft, compete, competeLeft } = props;
    const [animation, startAnimation] = useLinearAnimation({ initValue: 0, duration: 500 });

    const source = useMemo(
        () =>
            props.theLeft
                ? require('@src/assets/images/matching_blue.png')
                : require('@src/assets/images/matching_yellow.png'),
        [props],
    );
    useEffect(() => {
        if (fadeIn) {
            startAnimation();
        } else {
            startAnimation(1, 0);
        }
    }, [fadeIn]);

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

    if (compete) {
        return (
            <Animated.View style={[{ alignItems: 'center' }, animateStyles]}>
                <ImageBackground
                    style={theLeft ? styles.leftUser : styles.rightUser}
                    source={
                        theLeft
                            ? require('@src/assets/images/compete_blue.png')
                            : require('@src/assets/images/compete_yellow.png')
                    }>
                    <Avatar source={app.me.avatar} size={height - PxFit(10)} style={styles.competeAvatar} />
                </ImageBackground>
            </Animated.View>
        );
    }

    return (
        <Animated.View style={[styles.competitor, animateStyles]}>
            <ImageBackground style={styles.background} source={source}>
                <Avatar
                    source={user.avatar || require('@src/assets/images/default_avatar.png')}
                    size={height * 0.76}
                    style={styles.avatar}
                />
            </ImageBackground>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    avatar: {
        borderWidth: PxFit(2),
        borderColor: '#fff',
    },
    background: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    competitor: {
        width,
        height,
    },
    leftUser: {
        width: SCREEN_WIDTH / 3,
        height: ((SCREEN_WIDTH / 3) * 123) / 221,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    competeAvatar: {
        marginRight: PxFit(7),
        borderWidth: PxFit(3),
        borderColor: '#fff',
    },
    rightUser: {
        width: SCREEN_WIDTH / 3,
        height: ((SCREEN_WIDTH / 3) * 123) / 221,
        justifyContent: 'center',
    },
});

export default competitor;
