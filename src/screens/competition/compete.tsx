import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, View, Text, ScrollView, BackHandler } from 'react-native';
import { PageContainer, Avatar, Row } from 'components';
import { Theme, SCREEN_WIDTH, Tools, PxFit } from 'utils';
import { observer, app } from 'store';
import CountDown from './components/CountDown';
import QuestionBody from './components/QuestionBody';
import Progress from './components/Progress';
import Competitor from './components/Competitor';
import LeaveGameOverlay from './components/LeaveGameOverlay';
import { useQuery, GQL } from 'apollo';
import { useNavigation } from 'react-navigation-hooks';
import { Overlay } from 'teaset';

const width = SCREEN_WIDTH / 3;
const height = ((SCREEN_WIDTH / 3) * 123) / 221;

const compete = observer(props => {
    const { navigation } = props;
    const [subTime, setSubTime] = useState(10); //倒计时
    const [index, setIndex] = useState(0); //题目下标值
    const [score, setScore] = useState(0); //分数
    const [fadeIn, setFadeIn] = useState(true); //
    const [answerStatus, setAnswerStatus] = useState('');

    const game = navigation.getParam('game');
    const store = navigation.getParam('store');

    useEffect(() => {
        const timer = setInterval(() => {
            setSubTime(prevCount => prevCount - 1);
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        if (subTime === 0) {
            if (index + 1 === data.gameQuestions.length) {
                //结算
                Tools.navigate('Settlement');
            } else {
                resetState();
            }
        }
    }, [subTime]);

    const { data, loading, error } = useQuery(GQL.GameQuestionsQuery, {
        variables: {
            game_id: game.id,
        },
    });

    const selectOption = (value: any) => {
        if (data.gameQuestions[index].answer === value) {
            // setScore(data.gameQuestions[index].gold * 10);
            store.calculateScore(data.gameQuestions[index].gold * 10);
        }
    };

    const resetState = () => {
        setFadeIn(false);
        setIndex(index + 1);
        setSubTime(10);
        setTimeout(() => {
            setFadeIn(true);
        }, 100);
        setAnswerStatus('');
    };

    useEffect(() => {
        const hardwareBackPress = BackHandler.addEventListener('hardwareBackPress', () => {
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
            return true;
        });
        return () => {
            hardwareBackPress.remove();
        };
    }, []);

    if (loading) {
        return <ImageBackground style={styles.background} source={require('@src/assets/images/compete_bg.png')} />;
    }

    return (
        <ImageBackground style={styles.background} source={require('@src/assets/images/compete_bg.png')}>
            <PageContainer
                title={'答题'}
                titleStyle={{ color: Theme.white }}
                navBarStyle={{
                    backgroundColor: 'transparent',
                }}>
                <ScrollView>
                    <Progress questions={data.gameQuestions} index={index} />
                    <View style={styles.userContainer}>
                        <Competitor fadeIn={fadeIn} user={app.me} compete theLeft />
                        <CountDown countDown={subTime} />
                        <Competitor fadeIn={fadeIn} user={store.rival} compete />
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
                        question={data.gameQuestions[index]}
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
