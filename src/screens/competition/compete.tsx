import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, View, Text, ScrollView } from 'react-native';
import { PageContainer, Avatar, Row } from 'components';
import { Theme, SCREEN_WIDTH, Tools, PxFit } from 'utils';
import { observer, app } from 'store';
import CountDown from './components/CountDown';
import QuestionBody from './components/QuestionBody';
import Progress from './components/Progress';
import Competitor from './components/Competitor';
import { useCountDown } from 'common';
import { useQuery, GQL } from 'apollo';

const width = SCREEN_WIDTH / 3;
const height = ((SCREEN_WIDTH / 3) * 123) / 221;

const compete = () => {
    const [subTime, setSubTime] = useState(10); //倒计时
    const [index, setIndex] = useState(0); //题目下标值
    const [score, setScore] = useState(0); //分数
    const [fadeIn, setFadeIn] = useState(true);

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
            setFadeIn(false);
            setIndex(index + 1);
            setSubTime(10);
            setTimeout(() => {
                setFadeIn(true);
            }, 100);
        }
    }, [subTime]);

    const { data, loading, error } = useQuery(GQL.QuestionListQuery, {
        variables: {
            category_id: 1,
        },
    });

    const selectOption = (value: any) => {
        setFadeIn(false);
        if (data.questions[index].answer === value) {
            setScore(data.questions[index].gold * 10);
        }
        setIndex(index + 1);
        setSubTime(10);
        setTimeout(() => {
            setFadeIn(true);
        }, 100);
    };

    if (loading)
        return <ImageBackground style={styles.background} source={require('@src/assets/images/compete_bg.png')} />;

    return (
        <ImageBackground style={styles.background} source={require('@src/assets/images/compete_bg.png')}>
            <PageContainer
                title={'答题'}
                titleStyle={{ color: Theme.white }}
                navBarStyle={{
                    backgroundColor: 'transparent',
                }}>
                <ScrollView>
                    <Progress questions={data.questions} index={index} />
                    <View style={styles.userContainer}>
                        <Competitor fadeIn={fadeIn} user={app.me} compete theLeft />
                        <CountDown countDown={subTime} />
                        <Competitor fadeIn={fadeIn} user={app.me} compete />
                    </View>
                    <Row style={styles.textWrap}>
                        <Text style={styles.name}>大美女</Text>
                        <Text style={styles.name}>大美女</Text>
                    </Row>
                    <Row style={styles.textWrap}>
                        <Text style={styles.score}>{score}</Text>
                        <Text style={styles.score}>{score}</Text>
                    </Row>

                    <QuestionBody question={data.questions[index]} selectOption={selectOption} />
                </ScrollView>
            </PageContainer>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: PxFit(15),
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: PxFit(30),
    },
    leftUser: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    avatar: {
        marginRight: PxFit(7),
        borderWidth: PxFit(3),
        borderColor: '#fff',
    },
    rightUser: {
        width: width,
        height: height,
        justifyContent: 'center',
    },
    textWrap: {
        justifyContent: 'space-between',
        paddingHorizontal: PxFit(15),
    },
    name: {
        marginTop: PxFit(10),
        color: Theme.white,
    },
    score: {
        marginTop: PxFit(5),
        fontSize: PxFit(22),
        color: Theme.blue,
    },
    background: {
        height: '100%',
        resizeMode: 'cover',
        width: '100%',
    },
});

export default compete;
