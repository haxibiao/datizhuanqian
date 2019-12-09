import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { Iconfont } from '@src/components';
import { Theme, SCREEN_WIDTH, Tools, PxFit } from 'utils';
import OptionItem from './OptionItem';

interface Props {
    question: Question;
    selectOption: Function;
    setAnswerStatus: Function;
    answerStatus: String;
}

interface Question {
    id: Number;
    selections_array: Array<object>;
    description: String;
    answer: String;
}

const QuestionBody = (props: Props) => {
    const { selectOption, question, setAnswerStatus, answerStatus } = props;
    const { selections_array, description, id, category } = question;

    return (
        <View style={{ paddingHorizontal: PxFit(25), marginTop: PxFit(25) }}>
            {category && category.name && (
                <Text style={styles.categoryText}>
                    {'—— '}
                    <Iconfont name="order-fill" color={Theme.watermelon} size={PxFit(18)} />
                    {category.name}
                </Text>
            )}
            <Text style={{ color: Theme.white, fontSize: PxFit(17), marginBottom: PxFit(20) }}>{description}</Text>

            {selections_array.map((option, index) => {
                return (
                    <OptionItem
                        questionId={id}
                        key={index}
                        index={index}
                        even={index % 2 === 0}
                        option={option}
                        selectOption={selectOption}
                        question={question}
                        setAnswerStatus={setAnswerStatus}
                        answerStatus={answerStatus}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    categoryText: { color: Theme.watermelon, fontSize: PxFit(17), marginBottom: PxFit(10) },
});

export default QuestionBody;
