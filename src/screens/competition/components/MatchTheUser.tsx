import React, { useMemo, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, Animated } from 'react-native';
import { Avatar, Row, Center, Iconfont } from '@src/components';
import { PxFit, SCREEN_WIDTH } from '@src/utils';
import { useLinearAnimation } from '@src/common';
import { observer, app } from 'store';

const width = SCREEN_WIDTH / 2 + PxFit(60);
const height = (width * 150) / 492;

const MatchTheUser = observer(props => {
    const { user, fadeIn, theLeft } = props;
    const firstRender = useRef(true);
    const [animation, startAnimation] = useLinearAnimation({ initValue: 0, duration: 500 });

    const source = useMemo(
        () =>
            props.theLeft
                ? require('@src/assets/images/matching_blue.png')
                : require('@src/assets/images/matching_yellow.png'),
        [props],
    );
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
        } else {
            if (fadeIn) {
                startAnimation();
            } else {
                startAnimation(1, 0);
            }
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

    return (
        <Animated.View style={[styles.MatchTheUser, animateStyles]}>
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
        borderColor: '#fff',
        borderWidth: PxFit(2),
    },
    background: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        resizeMode: 'cover',
        width: '100%',
    },
    competitor: {
        height,
        width,
    },
});

export default MatchTheUser;
