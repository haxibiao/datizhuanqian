import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, DeviceEventEmitter } from 'react-native';
import { observer } from '@src/screens/answer/store';

export default observer(({ value, text, style, question, store }) => {
    const { order, answered, selectAnswer, selectedAnswers, isMultiple, isExam } = store;
    const [checked, setChecked] = useState(question.submittedAnswer ? question.submittedAnswer.includes(value) : false);

    const choose = useCallback(() => {
        let isTurnable = false;
        setChecked((c) => {
            isTurnable = !c;
            return !c;
        });
        const answer = selectAnswer(value);
        question.submittedAnswer = answer;
        // 考试题逻辑
        if (isExam && answer) {
            if ((!isMultiple && isTurnable) || answer.length >= question.answer.length) {
                DeviceEventEmitter.emit('nextQuestion');
            }
            DeviceEventEmitter.emit('selectAnswer');
        }
    }, []);

    const correct = useMemo(() => {
        return question.answer.includes(value);
    }, [value]);

    useEffect(() => {
        if (question.submittedAnswer) {
            setChecked(question.submittedAnswer.includes(value));
        } else {
            setChecked(false);
        }
    }, [question.submittedAnswer]);

    const Label = useMemo(() => {
        let style = { borderWidth: PxFit(0.33), borderColor: '#D8D8D8' };
        let color = '#666666';
        let icon;
        if (answered) {
            if (correct) {
                style = { backgroundColor: '#DEFAD8', borderWidth: 0 };
                color = '#24c374';
                icon = {
                    url: require('@src/assets/images/ic_answer_pass.png'),
                    style: { width: PxFit(15), height: (PxFit(15) * 30) / 44 },
                };
            } else if (checked) {
                style = { backgroundColor: '#FAF4D4', borderWidth: 0 };
                color = '#FFB608';

                icon = {
                    url: require('@src/assets/images/ic_answer_error.png'),
                    style: { width: PxFit(12), height: PxFit(12) },
                };
            } else {
                // style = { borderWidth: PxFit(1), borderColor: '#9E9E9E' };
                color = '#9E9E9E';
            }
        } else if (checked) {
            style = { backgroundColor: '#DFEEFF', borderWidth: 0 };
            color = Theme.grey;
        }

        return (
            <View style={[styles.labelItem, style]}>
                {icon ? (
                    <Image source={icon.url} style={icon.style} />
                ) : (
                    <Text style={[styles.labelValue, { color }]}>{value}</Text>
                )}
            </View>
        );
    }, [value, correct, answered, checked]);

    return useMemo(() => {
        return (
            <TouchableOpacity opacity={0.8} disabled={answered} style={[styles.optionItem, style]} onPress={choose}>
                {Label}
                <View style={styles.content}>
                    <Text style={styles.contentText}>{text}</Text>
                </View>
            </TouchableOpacity>
        );
    }, [style, answered, checked]);
});

const styles = StyleSheet.create({
    optionItem: {
        opacity: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelItem: {
        marginRight: PxFit(15),
        width: Font(34),
        height: Font(34),
        borderRadius: Font(17),
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
        fontSize: Font(16),
        lineHeight: PxFit(26),
        color: '#525252',
    },
});
