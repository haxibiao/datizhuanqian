import React, { Component, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, Animated } from 'react-native';
import { TouchFeedback, Iconfont } from 'components';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';

interface Props {
    questionId: Number;
    question: Question;
    selectOption: Function;
    setAnswerStatus: Function;
    answerStatus: String;
    option: Option;
    index: number;
}

interface Question {
    id: Number;
    selections_array: Array<object>;
    description: String;
    answer: String;
}

interface Option {
    Value: String;
    Text: String;
}

const OptionItem = (props: Props) => {
    const [animated, setAnimated] = useState(new Animated.Value(0));
    const [optionIndex, setOptionIndex] = useState(-1);
    const flag = useRef(false);

    useEffect(() => {
        animation();
    }, []);

    useEffect(() => {
        animation();
        setOptionIndex(-1);
    }, [props.questionId]);

    const animation = () => {
        flag.current = true;
        animated.setValue(0);
        Animated.timing(animated, {
            toValue: 1,
            velocity: 10,
            tension: -10,
            friction: 5,
            delay: 350,
        }).start(() => {
            flag.current = false;
        });
    };

    const onPress = () => {
        if (flag.current) return;
        let { option, question, selectOption, setAnswerStatus, index } = props;
        setOptionIndex(index);
        setAnswerStatus(question.answer === option.Value ? 'correct' : 'error');
        selectOption(option.Value);
    };

    const buildProps = () => {
        let { option, answerStatus, index, question } = props;
        let labelStyle, contentStyle, label, status;

        let focused = optionIndex == index;

        if (focused) {
            status = answerStatus;
        } else {
            status = 'missing';
        }

        switch (status) {
            case 'correct':
                labelStyle = { backgroundColor: Theme.correctColor, borderWidth: 0 };
                contentStyle = { color: Theme.correctColor };
                label = <Iconfont name="correct" size={PxFit(16)} color={'#fff'} />;
                break;

            case 'error':
                labelStyle = { backgroundColor: Theme.errorColor, borderWidth: 0 };
                contentStyle = { color: Theme.errorColor };
                label = <Iconfont name="close" size={PxFit(19)} color={'#fff'} />;
                break;
            default:
                label = <Text style={styles.optionLabelText}>{option.Value}</Text>;
                break;
        }

        if (answerStatus.length > 0 && question.answer == option.Value) {
            labelStyle = { backgroundColor: Theme.correctColor, borderWidth: 0 };
            contentStyle = { color: Theme.correctColor };
            label = <Iconfont name="correct" size={PxFit(16)} color={'#fff'} />;
        }
        return { labelStyle, contentStyle, label };
    };

    const { option, even, answerStatus } = props;
    const { labelStyle, contentStyle, label } = buildProps();

    const animateStyles = {
        opacity: animated,
        transform: [
            {
                translateX: animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [even ? -SCREEN_WIDTH : SCREEN_WIDTH, 0],
                }),
            },
        ],
    };

    return (
        <Animated.View style={animateStyles}>
            <View style={styles.optionItemWrap}>
                <TouchFeedback style={styles.optionItem} onPress={onPress} disabled={answerStatus.length > 0}>
                    <View style={[styles.optionLabel, labelStyle]}>{label}</View>
                    <View style={styles.optionContent}>
                        <Text style={[styles.optionContentText, contentStyle]}>{option.Text}</Text>
                    </View>
                </TouchFeedback>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    optionItemWrap: {
        marginBottom: PxFit(20),
    },
    optionItem: {
        opacity: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionLabel: {
        marginRight: PxFit(15),
        width: PxFit(34),
        height: PxFit(34),
        borderRadius: PxFit(17),
        borderWidth: PxFit(1),
        borderColor: Theme.borderColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedOption: { backgroundColor: '#b6c2e1', borderWidth: 0 },
    correctOption: { backgroundColor: Theme.correctColor, borderWidth: 0 },
    errorOption: { backgroundColor: Theme.errorColor, borderWidth: 0 },
    optionLabelText: {
        fontSize: PxFit(16),
        color: Theme.white,
    },
    optionContent: {
        flex: 1,
        minHeight: PxFit(34),
        justifyContent: 'center',
    },
    optionContentText: {
        fontSize: PxFit(16),
        lineHeight: PxFit(20),
        color: Theme.white,
    },
});

export default OptionItem;
