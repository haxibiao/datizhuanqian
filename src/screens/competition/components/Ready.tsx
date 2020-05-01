import React, { useRef, useEffect } from 'react';
import { Text, StyleSheet, ImageBackground, Animated, Image } from 'react-native';
import { useLinearAnimation } from '@src/common';

const Ready = props => {
    const firstRender = useRef(true);

    const [animation, startAnimation] = useLinearAnimation({ initValue: 0, duration: 500 });

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            startAnimation();
        } else {
            startAnimation(1, 0);
        }
        return () => {
            console.log('====================================');
            console.log('Ready');
            console.log('====================================');
        };
    }, []);

    return (
        <ImageBackground style={styles.background} source={require('@src/assets/images/compete_bg.png')}>
            <Animated.View style={[styles.center, { opacity: animation }]}>
                <Image style={styles.competeVs} source={require('@src/assets/images/compete_vs.png')} />
                <Text style={styles.text} onPress={() => props.xx(false)}>
                    ready...
                </Text>
            </Animated.View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        resizeMode: 'cover',
        width: '100%',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    competeVs: {
        height: Device.WIDTH / 3,
        resizeMode: 'cover',
        width: ((Device.WIDTH / 3) * 214) / 128,
    },
    text: {
        color: '#fff',
        fontSize: PxFit(20),
        marginTop: PxFit(20),
    },
});

export default Ready;
