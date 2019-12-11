import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, ImageBackground, View, Text, ScrollView, BackHandler } from 'react-native';
import { PageContainer, Row } from 'components';
import { Theme, SCREEN_WIDTH, Tools, PxFit } from 'utils';
import { observer, app } from 'store';
import RepeatCountDown from './components/RepeatCountDown';
import QuestionBody from './components/QuestionBody';
import Progress from './components/Progress';
import Competitor from './components/Competitor';
import LeaveGameOverlay from './components/LeaveGameOverlay';
import Ready from './components/Ready';
import { useQuery, GQL } from 'apollo';
import { useNavigation } from 'react-navigation-hooks';
import { Overlay } from 'teaset';

const width = SCREEN_WIDTH / 3;
const height = ((SCREEN_WIDTH / 3) * 123) / 221;

const compete = observer(props => {
    const navigation = useNavigation();
    const game = navigation.getParam('game');
    const store = navigation.getParam('store');

    const [index, setIndex] = useState(0); // 题目下标值
    const [answerStatus, setAnswerStatus] = useState('');

    const { data, error } = useQuery(GQL.GameQuestionsQuery, {
        variables: {
            game_id: game.id,
        },
    });

    const gameQuestions = useMemo(() => Tools.syncGetter('gameQuestions', data), [data]);

    const selectOption = useCallback(
        (value: any) => {
            if (gameQuestions[index].answer === value) {
                store.calculateScore(gameQuestions[index].gold * store.scoreMultiple);
            }
        },
        [gameQuestions, index],
    );

    const handlerResult = useCallback(() => {
        let result;
        // 答题结束如果得分为0，同样提交分数
        if (store.score[0] === 0) {
            store.calculateScore(0);
        }
        if (store.isRobot && store.score[1] === 0) {
            store.calculateScore(0, 'RIVAL');
        }
        if (store.score[0] > store.score[1]) {
            result = 'victory';
        } else if (store.score[0] < store.score[1]) {
            result = 'defeat';
        } else {
            result = 'draw';
        }
        navigation.replace('GameSettlement', {
            result,
            store,
        });
    }, []);

    const resetState = useCallback(() => {
        setIndex(i => i + 1);
        setAnswerStatus('');
    }, []);

    const backPress = useCallback(() => {
        let popViewRef;
        Overlay.show(
            <Overlay.PopView modal={true} style={styles.overlay} ref={ref => (popViewRef = ref)}>
                <LeaveGameOverlay
                    onConfirm={() => {
                        popViewRef.close();
                        navigation.pop(2);
                        store.leaveGame();
                    }}
                    close={() => popViewRef.close()}
                />
            </Overlay.PopView>,
        );
    }, []);

    useEffect(() => {
        if (store.isLeaving) {
            navigation.replace('GameSettlement', {
                result: 'victory',
                store,
            });
        }
    }, [store.isLeaving]);

    useEffect(() => {
        const hardwareBackPress = BackHandler.addEventListener('hardwareBackPress', () => {
            backPress();
            return true;
        });
        return () => {
            hardwareBackPress.remove();
        };
    }, []);

    if (!gameQuestions) {
        return <Ready />;
    }
    console.log('====================================');
    console.log('store.rival', store.me, store.rival);
    console.log('====================================');
    return (
        <ImageBackground style={styles.background} source={require('@src/assets/images/compete_bg.png')}>
            <PageContainer
                title={'答题'}
                titleStyle={{ color: Theme.white }}
                navBarStyle={{
                    backgroundColor: 'transparent',
                }}
                backButtonPress={backPress}>
                <ScrollView>
                    <Progress questions={gameQuestions} index={index} />
                    <View style={styles.userContainer}>
                        <Competitor user={store.me} compete theLeft />
                        <RepeatCountDown
                            duration={10}
                            repeat={gameQuestions.length}
                            callback={handlerResult}
                            resetState={resetState}
                            store={store}
                            score={gameQuestions}
                        />
                        <Competitor user={store.rival} compete />
                    </View>
                    <Row style={styles.textWrap}>
                        <Text style={styles.name}>{app.me.name}</Text>
                        <Text style={styles.name}>{store.rival.name}</Text>
                    </Row>
                    <Row style={styles.textWrap}>
                        <Text style={[styles.score, { color: '#70E9F3' }]}>{store.score[0]}</Text>
                        <Text style={styles.score}>{store.score[1]}</Text>
                    </Row>
                    <QuestionBody
                        question={gameQuestions[index]}
                        selectOption={selectOption}
                        setAnswerStatus={setAnswerStatus}
                        answerStatus={answerStatus}
                    />
                </ScrollView>
            </PageContainer>
        </ImageBackground>
    );
});

const styles = StyleSheet.create({
    avatar: {
        borderColor: '#fff',
        borderWidth: PxFit(3),
        marginRight: PxFit(7),
    },
    background: {
        height: '100%',
        resizeMode: 'cover',
        width: '100%',
    },
    container: {
        paddingHorizontal: PxFit(15),
    },
    leftUser: {
        alignItems: 'flex-end',
        height: height,
        justifyContent: 'center',
        width: width,
    },
    name: {
        color: Theme.white,
        marginTop: PxFit(10),
    },
    overlay: { alignItems: 'center', justifyContent: 'center' },
    rightUser: {
        height: height,
        justifyContent: 'center',
        width: width,
    },
    score: {
        color: '#FFEB7A',
        fontSize: PxFit(22),
        marginTop: PxFit(5),
    },
    textWrap: {
        justifyContent: 'space-between',
        paddingHorizontal: PxFit(15),
    },
    userContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: PxFit(30),
    },
});

export default compete;
