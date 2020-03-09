import React, { useMemo } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { PxFit, Tools, SCREEN_WIDTH } from '@src/utils';
import { useQuery, GQL } from '@src/apollo';
import { app, config } from '@src/store';
import { useNavigation } from 'react-navigation-hooks';
import { Audit, AuditStatus, Question, Information } from '@src/screens/question/component';
import AnswerBottom from '@src/screens/answer/components/AnswerBottom';
// import VideoExplain from '@src/screens/answer/components/VideoExplain';
import Explain from '@src/screens/question/component/Explain';
import { observer, QuestionStore } from '@src/screens/answer/store';

export default observer(({ category, question, questions, order }) => {
    const store = useMemo(() => new QuestionStore(question, order), [question]);
    const { isExam, isAudit, answered, answerResult } = store;
    const { data } = useQuery(GQL.UserMeansQuery, {
        variables: { id: app.me.id },
    });
    const user = useMemo(() => Tools.syncGetter('user', data), [data]);
    const explain = useMemo(() => {
        const result = { video: null, text: null, image: null };
        result.video = Tools.syncGetter('explanation.video', question);
        result.text = Tools.syncGetter('explanation.content', question);
        result.image = Tools.syncGetter('explanation.images.0.path', question);
        return result;
    }, [question]);
    const header = useMemo(() => {
        if (!isExam) {
            return null;
        }
        return (
            <View style={[styles.header]}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.orderText}>{`${order + 1}/${questions.length}`}</Text>
            </View>
        );
    }, [isExam, answerResult, questions]);

    const footer = useMemo(() => {
        return <AnswerBottom user={user} question={question} store={store} />;
    }, [isExam, answered, user, question, store]);

    return (
        <View style={styles.container}>
            {header}
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    {
                        paddingBottom: isAudit ? SCREEN_WIDTH / 3 : 0,
                        backgroundColor: answered ? '#F3F3F3' : '#ffffff',
                    },
                ]}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                bounces={false}
                scrollEnabled={!config.isFullScreen}>
                <View style={styles.content}>
                    <Question question={question} store={store} audit={true} />
                    {/* <VideoExplain video={Tools.syncGetter('explanation.video', question)} /> */}
                    <AuditStatus question={question} store={store} />
                    {(explain.text || explain.image || explain.video) && (
                        <Explain explanation={question.explanation} audit={true} />
                    )}
                </View>
                <Audit question={question} store={store} />
            </ScrollView>
            {footer}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
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
    content: {
        paddingVertical: PxFit(10),
        paddingHorizontal: PxFit(12),
    },
    header: {
        paddingVertical: PxFit(10),
        paddingHorizontal: PxFit(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: PxFit(1),
        borderBottomColor: '#F3F3F3',
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