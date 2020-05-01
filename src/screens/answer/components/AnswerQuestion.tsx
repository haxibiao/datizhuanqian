import React, { useMemo, useEffect } from 'react';
import { DeviceEventEmitter, StyleSheet, ScrollView, View, Text } from 'react-native';
import { useQuery, GQL } from '@src/apollo';
import { app, config } from '@src/store';
import { Audit, AuditStatus, Information, Question } from '@src/screens/question/component';
import AnswerBottom from './AnswerBottom';
import { observer, QuestionStore } from '../store';

export default observer(({ category, question, questions, order, showAnswerResult, showOptions }) => {
    const store = useMemo(() => new QuestionStore(question, order), [question]);
    const { isExam, isAudit, answered, answerQuestion } = store;

    const { data } = useQuery(GQL.UserMeansQuery, {
        variables: { id: app.me.id },
    });
    const user = useMemo(() => Helper.syncGetter('user', data), [data]);

    const header = useMemo(() => {
        if (!isExam) {
            return null;
        }
        return (
            <View
                style={[
                    styles.header,
                    answered && { borderBottomWidth: 0 },
                    answered &&
                        (question.answerResult == 'correct'
                            ? { backgroundColor: '#E3F7EC' }
                            : { backgroundColor: '#F7E3E2' }),
                ]}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.orderText}>{`${order + 1}/${questions.length}`}</Text>
            </View>
        );
    }, [isExam, answered, question, questions]);

    const footer = useMemo(() => {
        if ((isExam && !answered) || config.isFullScreen) {
            return null;
        }
        return <AnswerBottom user={user} question={question} store={store} showAnswerResult={showAnswerResult} />;
    }, [isExam, answered, user, question, store, config.isFullScreen]);

    useEffect(() => {
        DeviceEventEmitter.addListener('submitAnswer', () => {
            answerQuestion();
        });
        return () => {
            DeviceEventEmitter.removeListener('submitAnswer');
        };
    }, []);

    return (
        <View style={[styles.container, !config.isFullScreen && { width: Device.WIDTH, marginTop: PxFit(5) }]}>
            {header}
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    {
                        paddingBottom: isAudit ? Device.WIDTH / 3 : 0,
                        // backgroundColor: '#ffffff',
                    },
                ]}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                bounces={false}
                scrollEnabled={!config.isFullScreen}>
                <View style={{ paddingHorizontal: config.isFullScreen ? 0 : PxFit(20) }}>
                    <Question question={question} store={store} audit={isAudit} />
                    {answered && (
                        <Information
                            question={question}
                            question={question}
                            category={category}
                            showOptions={showOptions}
                        />
                    )}
                    {isAudit && <AuditStatus question={question} store={store} />}
                </View>
                {isAudit && <Audit question={question} store={store} />}
            </ScrollView>
            {footer}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    optionsButton: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center',
        width: PxFit(40),
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {},
    header: {
        paddingVertical: PxFit(10),
        paddingHorizontal: PxFit(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: PxFit(1),
        borderBottomColor: '#F3F3F3',
        marginBottom: PxFit(15),
    },
    categoryName: {
        fontSize: PxFit(14),
        color: '#212B34',
    },
    orderText: {
        fontSize: PxFit(12),
        color: '#969696',
    },
});
