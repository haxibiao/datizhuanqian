/*
 * @flow
 * created by wyk made in 2019-03-27 11:50:09
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import OptionItem from './OptionItem';

class QuestionOption extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { selections, submited, answer, selectedOption, onSelectOption, questionId } = this.props;
        let singleOption = answer && answer.length === 1;
        console.log('selectedOption', selectedOption);
        return (
            <View>
                {selections.map((option, index) => {
                    return (
                        <OptionItem
                            questionId={questionId}
                            key={index}
                            even={index % 2 === 0}
                            submited={submited}
                            option={option}
                            selectedOption={selectedOption}
                            onSelectOption={onSelectOption}
                            singleOption={singleOption}
                            correct={answer && answer.includes(option.Value)}
                        />
                    );
                })}
            </View>
        );
    }
}

export default QuestionOption;
