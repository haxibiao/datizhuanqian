import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer, useQuestionStore } from '../store';
import SelectionItem from './SelectionItem';

export default observer(() => {
    const store = useQuestionStore();
    const { selections, setSelectionText, setAnswers } = store;
    return (
        <View style={styles.container}>
            {selections.map((item, index) => {
                return (
                    <SelectionItem
                        key={index}
                        item={item}
                        style={{ marginBottom: PxFit(10) }}
                        onChange={text => setSelectionText(index, text)}
                        onCheck={() => setAnswers(index)}
                    />
                );
            })}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        marginBottom: PxFit(5),
    },
});
