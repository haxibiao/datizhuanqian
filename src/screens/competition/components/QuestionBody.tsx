import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Iconfont } from '@src/components';
import { Theme, SCREEN_WIDTH, PxFit } from 'utils';
import OptionItem from './OptionItem';
import SongOption from './SongOption';

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
    const { selectOption, question, setAnswerStatus, answerStatus, isGuessSong } = props;
    const { selections_array, description, id, category } = question;

    return (
        <View style={{ paddingHorizontal: PxFit(25), marginTop: PxFit(25) }}>
            {isGuessSong ? (
                <View style={styles.guessBanner}>
                    <Image style={styles.bannerImage} source={require('@src/assets/images/guess_song_name.png')} />
                </View>
            ) : (
                <>
                    {category && category.name && (
                        <Text style={styles.categoryText}>
                            {'—— '}
                            <Iconfont name="order-fill" color={'#fff'} size={PxFit(18)} />
                            {category.name}
                        </Text>
                    )}
                    <Text style={{ color: Theme.white, fontSize: PxFit(17), marginBottom: PxFit(20) }}>
                        {description}
                    </Text>
                </>
            )}

            {selections_array.map((option, index) => {
                return isGuessSong ? (
                    <SongOption
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
                ) : (
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
    categoryText: { color: '#fff', fontSize: PxFit(16), marginBottom: PxFit(10), fontWeight: 'bold' },
    guessBanner: {
        marginBottom: PxFit(20),
        alignItems: 'center',
    },
    bannerImage: {
        width: SCREEN_WIDTH / 2,
        height: ((SCREEN_WIDTH / 2) * 75) / 362,
    },
});

export default QuestionBody;
