import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, View, Text } from 'react-native';
import { PageContainer, Avatar, Row } from 'components';
import { Theme, SCREEN_WIDTH, Tools, PxFit } from 'utils';
import { observer, app } from 'store';
import CountDown from './components/CountDown';
import QuestionBody from './components/QuestionBody';
import { useCountDown } from 'common';
import { useQuery, GQL } from 'apollo';

interface Props {
    questions: Array<object>;
    index: any;
}

const Progress = (props: Props) => {
    const { questions, index } = props;
    return (
        <View style={styles.container}>
            <View
                style={{
                    height: PxFit(16),
                    width: SCREEN_WIDTH - PxFit(60),
                    backgroundColor: 'rgba(0,0,255,0.2)',
                    borderRadius: PxFit(8),
                }}>
                <View
                    style={{
                        height: PxFit(16),
                        width: (SCREEN_WIDTH - PxFit(60)) / 4,
                        backgroundColor: Theme.primaryColor,
                        borderRadius: PxFit(8),
                    }}></View>
            </View>
            <Text style={{ color: Theme.white }}>{`${index + 1}/${questions.length}`}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: PxFit(15),
        marginTop: PxFit(20),
    },
});

export default Progress;
