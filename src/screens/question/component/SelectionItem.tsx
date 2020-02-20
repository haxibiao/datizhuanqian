import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Iconfont } from '@src/components';
import { Theme, PxFit } from '@src/utils';
import { observer } from '@src/screens/answer/store';

export default observer(({ value, text, style, store }) => {
    const { question, submitted, selectAnswer, selectedAnswers, isMultiple } = store;
    const [checked, setChecked] = useState(false);
    const choose = useCallback(() => {
        setChecked(c => !c);
        selectAnswer(value);
    }, []);

    useEffect(() => {
        if (!isMultiple && !selectedAnswers.includes(value)) {
            setChecked(false);
        }
    }, [value, selectedAnswers, isMultiple]);

    const correct = useMemo(() => {
        return question.answer.includes(value);
    }, [value]);

    const Label = useMemo(() => {
        let style = { borderWidth: PxFit(1), borderColor: '#74A1FF' };
        let color = '#5F93FD';

        if (submitted) {
            if (correct) {
                style = { backgroundColor: Theme.correctColor, borderWidth: 0 };
                color = '#fff';
            } else if (checked) {
                style = { backgroundColor: Theme.errorColor, borderWidth: 0 };
                color = '#fff';
            } else {
                style = { borderWidth: PxFit(1), borderColor: '#9E9E9E' };
                color = '#9E9E9E';
            }
        } else if (checked) {
            style = { backgroundColor: '#b6c2e1', borderWidth: 0 };
            color = '#fff';
        }

        return (
            <View style={[styles.labelItem, style]}>
                <Text style={[styles.labelValue, { color }]}>{value}</Text>
            </View>
        );
    }, [value, correct, submitted, checked]);

    return useMemo(() => {
        return (
            <TouchableOpacity opacity={0.8} disabled={submitted} style={[styles.optionItem, style]} onPress={choose}>
                {Label}
                <View style={styles.content}>
                    <Text style={styles.contentText}>{text}</Text>
                </View>
            </TouchableOpacity>
        );
    }, [style, submitted, checked]);
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