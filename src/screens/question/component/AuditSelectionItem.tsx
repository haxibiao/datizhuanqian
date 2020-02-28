import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, DeviceEventEmitter } from 'react-native';
import { Iconfont } from '@src/components';
import { Theme, PxFit } from '@src/utils';
import { observer } from '@src/screens/answer/store';

export default observer(({ value, text, style, question, store }) => {
    const correct = useMemo(() => {
        return question.answer.includes(value);
    }, [value]);

    const Label = useMemo(() => {
        let style = { borderWidth: PxFit(1), borderColor: '#74A1FF' };
        let color = '#5F93FD';

        if (correct) {
            style = { backgroundColor: Theme.correctColor, borderWidth: 0 };
            color = '#fff';
        }

        return (
            <View style={[styles.labelItem, style]}>
                <Text style={[styles.labelValue, { color }]}>{value}</Text>
            </View>
        );
    }, [value, correct]);

    return useMemo(() => {
        return (
            <TouchableOpacity opacity={0.8} style={[styles.optionItem, style]}>
                {Label}
                <View style={styles.content}>
                    <Text style={styles.contentText}>{text}</Text>
                </View>
            </TouchableOpacity>
        );
    }, [style]);
});

const styles = StyleSheet.create({
    optionItem: {
        opacity: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelItem: {
        marginRight: PxFit(15),
        width: PxFit(34),
        height: PxFit(34),
        borderRadius: PxFit(17),
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelValue: {
        fontSize: PxFit(16),
    },
    content: {
        flex: 1,
        paddingVertical: PxFit(4),
    },
    contentText: {
        fontSize: PxFit(16),
        lineHeight: PxFit(26),
        color: '#525252',
    },
});
