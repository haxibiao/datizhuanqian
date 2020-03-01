import React, { Component, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, Animated } from 'react-native';
import { TouchFeedback, Iconfont } from 'components';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';
import { playSound } from '../playSound';

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

const SongOption = (props: Props) => {
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
        let result = question.answer === option.Value;
        playSound(result ? 'answer_pass.mp3' : 'answer_fail.mp3');

        setOptionIndex(index);
        setAnswerStatus(result ? 'correct' : 'error');
        selectOption(option.Value);
    };

    const buildProps = () => {
        let { answerStatus, index } = props;
        let backgroundColor, color;

        let focused = optionIndex == index;

        if (focused) {
            status = answerStatus;
        } else {
            status = 'missing';
        }

        switch (status) {
            case 'correct':
                backgroundColor = Theme.teaGreen;
                color = '#fff';
                break;

            case 'error':
                backgroundColor = Theme.watermelon;
                color = '#fff';
                break;
            default:
                backgroundColor = '#fff';
                color = '#81A1F4';
                break;
        }

        return { backgroundColor, color };
    };

    const { option, even, answerStatus } = props;
    const { backgroundColor, color } = buildProps();

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
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.optionItem, { backgroundColor }]}
                    onPress={onPress}
                    disabled={answerStatus.length > 0}>
                    <Text style={[styles.optionText, { color }]}>{option.Text}</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    optionItemWrap: {
        marginBottom: PxFit(20),
        alignItems: 'center',
    },
    optionItem: {
        maxWidth: PxFit(300),
        minWidth: PxFit(240),
        width: SCREEN_WIDTH * 0.8,
        height: PxFit(44),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: PxFit(5),
    },
    optionText: {
        fontSize: PxFit(16),
    },
});

export default SongOption;
