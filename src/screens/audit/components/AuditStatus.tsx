import React, { useMemo, useEffect } from 'react';
import { StyleSheet, Text, Animated } from 'react-native';
import { Iconfont, Row, TouchFeedback } from '@src/components';
import { useLinearAnimation } from '@src/common';
import { observer } from '@src/screens/answer/store';

import { useNavigation } from 'react-navigation-hooks';

export default observer(() => {
    const [animation, startAnimation] = useLinearAnimation({ initValue: 0, duration: 300 });
    const navigation = useNavigation();

    useEffect(() => {
        startAnimation();
    }, []);

    const animationStyle = useMemo(() => {
        return {
            opacity: animation,
            transform: [
                {
                    translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-100, 0],
                        extrapolate: 'clamp',
                    }),
                },
            ],
        };
    }, [animation]);

    return (
        <Animated.View style={[styles.container, animationStyle]}>
            <Row>
                <Iconfont name={'audit'} size={PxFit(14)} color={Theme.correctColor} />
                <Text style={styles.text}>题目审核</Text>
            </Row>
            <TouchFeedback
                style={styles.ruleLabel}
                onPress={() => {
                    navigation.navigate('AuditRule');
                }}>
                <Iconfont name={'question'} size={PxFit(14)} color={'#9E9E9E'} style={{ marginTop: PxFit(1) }} />
                <Text style={styles.ruleText}>审题指南</Text>
            </TouchFeedback>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: PxFit(20),
    },
    text: {
        marginLeft: PxFit(2),
        fontSize: PxFit(14),
        color: Theme.correctColor,
    },
    ruleLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ruleText: { fontSize: PxFit(14), color: '#9E9E9E', marginLeft: PxFit(2) },
});
