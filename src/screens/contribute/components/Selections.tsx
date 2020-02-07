import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Theme, PxFit } from '@src/utils';
import { observer, useQuestionStore } from '../store';
import SelectionItem from './SelectionItem';

export default observer(props => {
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
                        onChange={() => setSelectionText(index)}
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
