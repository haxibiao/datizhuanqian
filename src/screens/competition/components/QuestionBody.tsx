import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { Theme, SCREEN_WIDTH, Tools, PxFit } from 'utils';
import OptionItem from './OptionItem';

interface Props {
    question: Question;
    selectOption: Function;
}

interface Question {
    id: Number;
    selections_array: Array<object>;
    description: String;
}

const QuestionBody = (props: Props) => {
    const _animated = new Animated.Value(0);
    const { selectOption, question } = props;
    const { selections_array, description, id } = question;

    useEffect(() => {}, []);

    return (
        <View style={{ paddingHorizontal: PxFit(25), marginTop: PxFit(25) }}>
            <Text style={{ color: Theme.white, fontSize: PxFit(17), marginBottom: PxFit(20) }}>{description}</Text>

            {selections_array.map((option, index) => {
                return (
                    <OptionItem
                        questionId={id}
                        key={index}
                        even={index % 2 === 0}
                        option={option}
                        selectOption={selectOption}
                        question={question}
                    />
                );
            })}
        </View>
    );
};

export default QuestionBody;
