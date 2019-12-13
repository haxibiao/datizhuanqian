import React, { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Image,
    Text,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
    BackHandler,
    Animated,
} from 'react-native';
import { PageContainer, NavigatorBar, Avatar, RewardTipsOverlay } from '@src/components';
import { playVideo, syncGetter, useCirculationAnimation } from '@src/common';
import { Theme, SCREEN_WIDTH, PxFit } from 'utils';
import { observer, app, storage } from 'store';
import { useNavigation } from 'react-navigation-hooks';

const avatarWidget = {
    victory: [
        require('@src/assets/images/avatar_frame_blue_win.png'),
        require('@src/assets/images/avatar_frame_yellow.png'),
    ],
    defeat: [
        require('@src/assets/images/avatar_frame_blue.png'),
        require('@src/assets/images/avatar_frame_yellow_win.png'),
    ],
    draw: [require('@src/assets/images/avatar_frame_blue.png'), require('@src/assets/images/avatar_frame_yellow.png')],
};

const competitionResult = {
    victory: require('@src/assets/images/competition_victory.png'),
    defeat: require('@src/assets/images/competition_defeat.png'),
    draw: require('@src/assets/images/competition_draw.png'),
};

const over = observer(props => {
    const navigation = useNavigation();
    const store = navigation.getParam('store');
    const [result, setResult] = useState(() => navigation.getParam('result', 'draw'));
    const [loading, setLoading] = useState(true);
    const [scores, setScores] = useState([-1, -1]);
    const [winner, setWinner] = useState();
    const [disabledRewardAdVideo, setDisabledRewardAdVideo] = useState(false);
    const fetchResultTimer = useRef(0);
    const setLoadingTimer = useRef(0);
    const gameOverCount = useRef(0);
    const gameQueryCount = useRef(0);
    const maxRepeat = useRef(10);

    // 领取奖励
    const receiveReward = useCallback(async () => {
        const [error, res] = await store.receiveGameReward();

        if (error) {
            Toast.show({ content: syncGetter('message', error) ? syncGetter('message', error) : '奖励领取失败' });
        } else if (syncGetter('data.gameReward', res)) {
            RewardTipsOverlay.show({
                reward: syncGetter('data.gameReward', res),
                rewardVideo: true,
                title: result === 'victory' ? '胜者奖励领取成功' : '安慰奖领取成功',
            });
            setDisabledRewardAdVideo(true);
        }
    }, [result]);

    // 观看广告
    const loadAd = useCallback(() => {
        playVideo({
            type: 'Compete',
            noReward: true,
        });
        receiveReward();
    }, []);

    // 结束
    const gameOver = useCallback(() => {
        (async () => {
            gameOverCount.current++;
            const [error, res] = await store.gameOver();
            const endGame = syncGetter('data.endGame', res);
            const scores = syncGetter('data.scores', endGame);
            const status = syncGetter('status', endGame);
            const winner = syncGetter('winner', endGame);
            const reward = syncGetter('reward', endGame);
            // 游戏未结束或者接口出错  重新请求
            if (status == 'END') {
                // 设置获胜者和得分
                clearTimeout(setLoadingTimer.current);
                store.game.reward = reward;
                setLoading(false);
                if (winner) {
                    setWinner(winner);
                }
                if (scores) {
                    setScores(() => {
                        let arr = [];
                        scores.forEach(item => {
                            if (item.user_id === store.me.id) {
                                arr[0] = item.score;
                            } else {
                                arr[1] = item.score;
                            }
                        });
                        return arr;
                    });
                }
            } else if (maxRepeat.current > 0) {
                clearTimeout(fetchResultTimer.current);
                fetchResultTimer.current = setTimeout(() => {
                    --maxRepeat.current;
                    fetchResult();
                }, 3000);
            }
        })();
    }, []);

    // 查询
    const fetchResult = useCallback(() => {
        (async () => {
            gameQueryCount.current++;
            const [error, res] = await store.gameQuery();
            const game = syncGetter('data.game', res);
            const scores = syncGetter('data.scores', game);
            const status = syncGetter('status', game);
            const winner = syncGetter('winner', game);
            const reward = syncGetter('reward', game);
            // 游戏未结束或者接口出错就间隔查询游戏状态
            if (status == 'END') {
                // 设置获胜者和得分
                clearTimeout(setLoadingTimer.current);
                store.game.reward = reward;
                setLoading(false);
                if (winner) {
                    setWinner(winner);
                }
                if (scores) {
                    setScores(() => {
                        let arr = [];
                        scores.forEach(item => {
                            if (item.user_id === store.me.id) {
                                arr[0] = item.score;
                            } else {
                                arr[1] = item.score;
                            }
                        });
                        return arr;
                    });
                }
            } else if (maxRepeat.current > 0) {
                clearTimeout(fetchResultTimer.current);
                fetchResultTimer.current = setTimeout(() => {
                    --maxRepeat.current;
                    fetchResult();
                }, 3000);
            }
        })();
    }, []);

    // 计算获胜者
    useEffect(() => {
        if (winner) {
            if (winner.id === store.me.id) {
                setResult('victory');
            } else if (winner.id > 0) {
                setResult('defeat');
            } else {
                setResult('draw');
            }
        }
    }, [winner]);

    useEffect(() => {
        // 对方离开一下，立马结算
        if (store.isLeaving) {
            setLoading(false);
        } else {
            // 通知游戏结算
            gameOver();
            // 请求超时 前端先结算
            setLoadingTimer.current = setTimeout(() => {
                clearTimeout(fetchResultTimer.current);
                setLoading(false);
                maxRepeat.current = 0;
            }, 30000);
        }

        return () => {
            clearTimeout(fetchResultTimer.current);
            clearTimeout(fetchResultTimer.current);
        };
    }, []);

    useEffect(() => {
        const hardwareBackPress = BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
        });
        return () => {
            hardwareBackPress.remove();
        };
    }, []);

    // 计算得分
    const reward = useMemo(() => {
        if (result == 'victory') {
            return store.game.reward;
        } else {
            return 0;
        }
    }, [result, store.game.reward]);

    const animation = useCirculationAnimation({ duration: 2000, start: true });
    const scale = animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.2, 1],
    });

    return (
        <PageContainer hiddenNavBar>
            <ImageBackground style={styles.background} source={require('@src/assets/images/compete_bg.png')}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.container}
                    contentContainerStyle={styles.content}>
                    <View style={styles.competitor}>
                        <ImageBackground style={styles.playerBg} source={avatarWidget[result][0]}>
                            <Avatar source={store.me.avatar_url} size={PxFit(100)} style={styles.playerAvatar} />
                        </ImageBackground>
                        <Image style={styles.competeVs} source={require('@src/assets/images/compete_vs.png')} />
                        <ImageBackground
                            style={[styles.playerBg, { alignItems: 'flex-start' }]}
                            source={avatarWidget[result][1]}>
                            <Avatar source={store.rival.avatar_url} size={PxFit(100)} style={styles.playerAvatar} />
                        </ImageBackground>
                    </View>
                    {loading ? (
                        <View style={styles.loading}>
                            <ActivityIndicator size="small" color={'#fff'} />
                            <Text style={styles.loadingText}>正在结算</Text>
                        </View>
                    ) : (
                        <>
                            <View style={styles.userInfo}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.userName} numberOfLines={1}>
                                        {store.me.name}
                                    </Text>
                                    <Text style={styles.score}>{scores[0] > 0 ? scores[0] : store.score[0]}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Text style={styles.userName} numberOfLines={1}>
                                        {store.rival.name}
                                    </Text>
                                    <Text style={[styles.score, { color: '#F8CE4D' }]}>
                                        {store.isLeaving ? '中途离开' : scores[1] > 0 ? scores[1] : store.score[1]}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.main}>
                                <View style={styles.gameResult}>
                                    <Image style={styles.gameResultBg} source={competitionResult[result]} />
                                </View>
                                <View style={styles.statisticPanel}>
                                    <View style={styles.statisticItem}>
                                        <Text style={styles.itemText1}>答对数:</Text>
                                        <Image
                                            style={styles.iconImage}
                                            source={require('@src/assets/images/competition_log.png')}
                                        />
                                        <Text style={styles.itemText2}>{store.answerPassCount}题</Text>
                                    </View>
                                    <Image
                                        style={styles.orangeLine}
                                        source={require('@src/assets/images/orange_line.png')}
                                    />
                                    <View style={styles.statisticItem}>
                                        <Text style={styles.itemText1}>奖励:</Text>
                                        <Image
                                            style={styles.iconImage}
                                            source={require('@src/assets/images/competition_reward.png')}
                                        />
                                        <Text style={styles.itemText2}>
                                            {disabledRewardAdVideo
                                                ? '已领取'
                                                : result == 'victory'
                                                ? '待领取'
                                                : '再接再厉'}
                                        </Text>
                                    </View>
                                    <Image
                                        style={styles.orangeLine}
                                        source={require('@src/assets/images/orange_line.png')}
                                    />
                                </View>
                                <View style={styles.bottom}>
                                    <Animated.View
                                        style={[
                                            styles.buttonWrap,
                                            !disabledRewardAdVideo && { transform: [{ scale }] },
                                        ]}>
                                        <TouchableOpacity
                                            style={[
                                                styles.button,
                                                {
                                                    backgroundColor: disabledRewardAdVideo
                                                        ? Theme.subTextColor
                                                        : Theme.watermelon,
                                                },
                                            ]}
                                            disabled={disabledRewardAdVideo}
                                            onPress={loadAd}>
                                            <Text style={[styles.buttonText, { color: '#fff' }]}>
                                                {disabledRewardAdVideo
                                                    ? '已经领取奖励'
                                                    : result === 'victory'
                                                    ? '领取胜者奖励'
                                                    : '领取安慰奖励'}
                                            </Text>
                                        </TouchableOpacity>
                                    </Animated.View>
                                    <View style={styles.buttonWrap}>
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={() => {
                                                navigation.replace('Matching');
                                            }}>
                                            <Text style={styles.buttonText}>继续答题挑战</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </>
                    )}
                </ScrollView>
            </ImageBackground>
            <View style={styles.header}>
                <NavigatorBar
                    navigation={navigation}
                    style={styles.navigatorBar}
                    titleStyle={styles.titleStyle}
                    title="对战结束"
                    backButtonPress={() => navigation.pop(2)}
                />
            </View>
        </PageContainer>
    );
});

const competeBgWidth = SCREEN_WIDTH / 3;
const competeBgHeight = (competeBgWidth * 149) / 229;
const fixCrownHeight = (competeBgHeight * 26) / 149;
const avatarSize = competeBgHeight - fixCrownHeight - PxFit(12);
const vsWidth = avatarSize - PxFit(12);

const styles = StyleSheet.create({
    background: {
        height: '100%',
        resizeMode: 'cover',
        width: '100%',
    },
    bottom: {
        marginTop: PxFit(20),
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: PxFit(6),
        height: PxFit(42),
        justifyContent: 'center',
        width: PxFit(180),
    },
    buttonText: {
        color: Theme.watermelon,
        fontSize: PxFit(16),
        fontWeight: 'bold',
    },
    buttonWrap: {
        marginTop: PxFit(20),
    },
    competeVs: {
        height: vsWidth,
        resizeMode: 'cover',
        width: (vsWidth * 214) / 128,
    },
    competitor: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    loading: {
        marginTop: PxFit(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: PxFit(20),
        color: '#fff',
        fontWeight: 'bold',
        fontSize: PxFit(20),
    },
    container: {
        flex: 1,
    },
    content: {
        paddingBottom: PxFit(Theme.HOME_INDICATOR_HEIGHT + Theme.itemSpace),
        paddingTop: PxFit(Theme.navBarContentHeight + Theme.itemSpace * 2),
    },
    gameResult: {
        marginTop: -PxFit(30),
    },
    gameResultBg: {
        height: ((SCREEN_WIDTH / 2) * 308) / 423,
        resizeMode: 'cover',
        width: SCREEN_WIDTH / 2,
    },
    header: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
    },
    iconImage: {
        height: PxFit(20),
        resizeMode: 'cover',
        width: PxFit(20),
    },
    itemText1: {
        color: '#fff',
        flex: 1,
        fontSize: PxFit(15),
        fontWeight: 'bold',
        textAlign: 'left',
    },
    itemText2: {
        color: '#F8CE4D',
        flex: 1,
        fontSize: PxFit(15),
        textAlign: 'right',
    },
    main: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navigatorBar: {
        backgroundColor: 'transparent',
    },
    orangeLine: {
        height: PxFit(1),
        marginVertical: PxFit(10),
        width: '100%',
    },
    playerAvatar: {
        height: avatarSize,
        resizeMode: 'cover',
        width: avatarSize,
    },
    playerBg: {
        alignItems: 'flex-end',
        height: competeBgHeight,
        padding: PxFit(6),
        paddingHorizontal: PxFit(10),
        paddingTop: fixCrownHeight + PxFit(6),
        resizeMode: 'cover',
        width: competeBgWidth,
    },
    score: {
        color: '#2AE2F3',
        fontSize: PxFit(19),
        fontWeight: 'bold',
    },
    statisticItem: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    statisticPanel: {
        marginTop: PxFit(40),
        width: SCREEN_WIDTH / 2,
    },
    titleStyle: {
        fontWeight: 'bold',
    },
    userInfo: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: PxFit(Theme.itemSpace),
    },
    userName: {
        color: '#fff',
        fontSize: PxFit(19),
        fontWeight: 'bold',
    },
});

export default over;
