import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PageContainer, TouchFeedback, Row } from '@src/components';
import { playVideo } from 'common';
import * as Progress from 'react-native-progress';
import { ScrollView } from 'react-native-gesture-handler';
import { observer } from './store';

const ExamResult = observer((props: { navigation: any }) => {
    const { navigation } = props;
    const category = useMemo(() => navigation.getParam('category', {}), []);
    const questions = useMemo(() => navigation.getParam('questions', []), []);
    const store = useMemo(() => navigation.getParam('store', {}), []);

    const [getRewarded, setGetRewarded] = useState(false);

    const getReward = () => {
        playVideo({
            type: answerResult ? 'AnswerPass' : 'AnswerFail',
            callback: () => {
                memorizedCallback();
            },
        });
    };

    const memorizedCallback = useCallback(() => {
        setGetRewarded(true);
    }, [getRewarded]);

    const resetAction = () => {
        store.reset();
        navigation.replace('Exam', { category, question_id: null });
    };

    const correctItems = questions.filter(question => {
        return question.submittedAnswer === question.answer;
    });
    console.log('correctItems', correctItems);

    const answerResult = correctItems.length / questions.length >= 0.6;
    const newDate = new Date(+new Date() + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '');

    return (
        <PageContainer title="练习报告" white>
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>考试分区：{category.name}</Text>
                    <Text style={styles.headerText}>交卷时间：{newDate}</Text>
                </View>
                <View style={styles.body}>
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.progressContainer}>
                            <View style={styles.progressCenter}>
                                <View style={styles.answerResult}>
                                    <Text style={styles.answerCorrect}>{correctItems.length}</Text>
                                    <Text style={{ color: Theme.grey, fontSize: PxFit(13), marginTop: PxFit(5) }}>
                                        （共{questions.length}题）
                                    </Text>
                                </View>
                            </View>
                            <Progress.Circle
                                progress={correctItems.length / questions.length}
                                size={Device.WIDTH * 0.45}
                                borderWidth={0}
                                color="#3BD4C2"
                                thickness={10}
                                strokeCap="round"
                            />
                        </View>
                    </View>
                    <View style={styles.cardInfo}>
                        <View>
                            <Text style={styles.cardTitle}>答题卡</Text>
                            <Row style={{ justifyContent: 'space-between' }}>
                                <Row>
                                    <Row>
                                        <View style={styles.correct} />
                                        <Text>正确</Text>
                                    </Row>
                                    <Row>
                                        <View style={styles.fail} />
                                        <Text>错误</Text>
                                    </Row>
                                </Row>
                                <Text>共{questions.length}题</Text>
                            </Row>
                        </View>
                        <Row style={styles.questions}>
                            {questions.map((question: string, index: number) => {
                                let backgroundColor = '#969696';
                                if (question.submittedAnswer) {
                                    backgroundColor = '#FF7271';
                                    if (question.submittedAnswer === question.answer) {
                                        backgroundColor = '#3BD4C2';
                                    }
                                }

                                return (
                                    <View style={styles.questionWrap} key={index}>
                                        <TouchFeedback
                                            onPress={() => {
                                                navigation.navigate('Exam', {
                                                    viewableQuestionIndex: index,
                                                    questions,
                                                    category,
                                                });
                                            }}
                                            style={{
                                                ...styles.question,
                                                backgroundColor,
                                            }}>
                                            <Text style={styles.questionText}>{index + 1}</Text>
                                        </TouchFeedback>
                                    </View>
                                );
                            })}
                        </Row>
                    </View>
                </View>
            </ScrollView>

            <Row>
                {(getRewarded || answerResult) && (
                    <TouchFeedback style={styles.bottomLeft} onPress={resetAction}>
                        <Text style={styles.bottomText}>继续答题</Text>
                    </TouchFeedback>
                )}

                <TouchFeedback
                    style={{
                        ...styles.bottomRight,
                        width: getRewarded || answerResult ? Device.WIDTH * 0.5 : Device.WIDTH,
                    }}
                    onPress={getReward}
                    disabled={getRewarded}>
                    <Text style={styles.bottomText}>领取奖励</Text>
                </TouchFeedback>
            </Row>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    header: {
        marginHorizontal: PxFit(15),
        paddingVertical: PxFit(15),
        borderBottomWidth: PxFit(0.2),
        borderBottomColor: Theme.lightBorder,
    },
    headerText: {
        color: Theme.grey,
        fontSize: PxFit(13),
        lineHeight: PxFit(22),
    },
    body: {
        marginHorizontal: PxFit(15),
        marginTop: PxFit(30),
    },
    progressContainer: {
        alignItems: 'center',
        position: 'relative',
        height: Device.WIDTH * 0.45,
        width: Device.WIDTH * 0.45,
    },
    progressCenter: {
        width: Device.WIDTH * 0.45,
        height: Device.WIDTH * 0.45,
        borderRadius: Device.WIDTH * 0.225,
        justifyContent: 'center',
        alignItems: 'center',
        ...StyleSheet.absoluteFill,
    },
    answerResult: {
        width: Device.WIDTH * 0.45,
        height: Device.WIDTH * 0.45,
        borderRadius: Device.WIDTH * 0.225,
        borderWidth: PxFit(10),
        borderColor: Theme.lightBorder,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerCorrect: {
        fontSize: PxFit(36),
        fontWeight: 'bold',
    },
    cardInfo: {
        paddingVertical: PxFit(10),
        marginTop: PxFit(20),
    },
    cardTitle: {
        fontSize: PxFit(18),
        marginBottom: PxFit(10),
    },
    correct: {
        backgroundColor: '#3BD4C2',
        width: PxFit(16),
        height: PxFit(16),
        borderRadius: PxFit(8),
        marginRight: PxFit(5),
    },
    fail: {
        backgroundColor: '#FF7271',
        width: PxFit(16),
        height: PxFit(16),
        borderRadius: PxFit(8),
        marginRight: PxFit(5),
        marginLeft: PxFit(20),
    },
    questions: {
        flexWrap: 'wrap',
        // justifyContent: 'space-between',
        paddingVertical: PxFit(15),
    },
    questionWrap: {
        width: (Device.WIDTH - PxFit(30)) * 0.2,
        height: (Device.WIDTH - PxFit(30)) * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    question: {
        backgroundColor: '#45B7FF',
        height: PxFit(38),
        width: PxFit(38),
        borderRadius: PxFit(19),
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionText: {
        color: 'white',
        fontSize: PxFit(15),
    },
    bottomLeft: {
        width: Device.WIDTH * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3BD4C2',
        height: PxFit(50),
    },
    bottomRight: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#45B7FF',
        height: PxFit(50),
    },
    bottomText: {
        color: Theme.white,
        fontSize: PxFit(16),
    },
});

export default ExamResult;
