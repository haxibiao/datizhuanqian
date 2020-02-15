import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Animated } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from '@src/utils';
import { Iconfont } from '@src/components';
import { useLinearAnimation } from '@src/common';
import { observer, useQuestionStore } from '../store';
import SelectionItem from './SelectionItem';

export default observer(() => {
    const store = useQuestionStore();
    const { question } = store;
    const [animation, startAnimation] = useLinearAnimation({ initValue: 0, duration: 300 });

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
                <Iconfont name={'audit'} size={PxFit(14)} color={Theme.primaryColor} />
                <Text style={styles.text}>待审题</Text>
            </Row>
            <TouchFeedback
                style={styles.ruleLabel}
                onPress={() => {
                    this.props.navigation.navigate('AuditRule');
                }}>
                <Text style={styles.ruleText}>审题指南</Text>
                <Iconfont name={'question'} size={PxFit(14)} color={Theme.subTextColor} />
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
        color: Theme.defaultTextColor,
    },
    ruleLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ruleText: { fontSize: PxFit(13), color: Theme.subTextColor, marginRight: PxFit(2) },
});
