import React, { useMemo, useRef, useEffect, useCallback, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import { PageContainer, NavigatorBar, Row } from '@src/components';
import { Theme, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit } from '@src/utils';
import { Query, useQuery, GQL } from '@src/apollo';
import { useLinearAnimation, syncGetter } from '@src/common';
import { observer, app } from 'store';
import localStore from './store';
import ChallengeButton from './components/ChallengeButton';
import MatchTheUser from './components/MatchTheUser';
import Guide from './components/Guide';
import { useNavigation } from 'react-navigation-hooks';
import { Overlay } from 'teaset';
import service from 'service';
import Sound from 'react-native-sound';
import { playSound } from './playSound';
import _ from 'lodash';

export default observer(props => {
    const navigation = useNavigation();
    const [animation, startAnimation] = useLinearAnimation({ initValue: 0, duration: 2000 });
    const store = useRef(new localStore()).current;
    const overlayRef = useRef();
    const timer = useRef();
    const canceling = useRef(false);
    const [disableCancel, setDisableCancel] = useState(true);
    const cancelDisable = useCallback(() => {
        setDisableCancel(false);
    }, []);
    const cancelMatch = useCallback(async () => {
        if (canceling.current) {
            return;
        }
        canceling.current = true;
        await store.cancelMatch();
        canceling.current = false;
    }, []);

    // 开始匹配后执行按钮动画
    useEffect(() => {
        if (store.matching) {
            startAnimation(0, 1, cancelDisable);
        } else {
            setDisableCancel(true);
        }
    }, [store.matching]);
    const animateStyles = useMemo(
        () => ({
            opacity: animation,
        }),
        [animation],
    );

    // 匹配成功，出现遮罩禁用UI，随即跳转PK
    useEffect(() => {
        if (store.rival.id) {
            console.log(' 匹配成功 :');
            playSound('match_success.mp3');
            Overlay.show(
                <Overlay.PopView modal={true} style={styles.overlay} ref={ref => (overlayRef.current = ref)}>
                    <View style={styles.modal} />
                </Overlay.PopView>,
            );
            timer.current = setTimeout(() => {
                timer.current = 0;
                overlayRef.current && overlayRef.current.close();
                navigation.replace('Compete', { game: store.game, store });
            }, 500);
        } else {
            clearTimeout(timer.current);
        }
    }, [store.rival.id]);

    // 退出界面业务逻辑
    useEffect(() => {
        const navWillBlurListener = navigation.addListener('willBlur', () => {
            if (store.rival.id && timer.current) {
                store.leaveGame();
            }
            if (!store.rival.id && store.matching) {
                cancelMatch();
            }
        });

        return () => {
            navWillBlurListener.remove();
        };
    }, []);

    const showGuide = useCallback(() => {
        let overlayRef;
        Overlay.show(
            <Overlay.View modal animated ref={ref => (overlayRef = ref)}>
                <View style={styles.overlayInner}>
                    <Guide hide={() => overlayRef.close()} />
                </View>
            </Overlay.View>,
        );
    }, []);

    const rightView = useMemo(() => {
        return (
            <TouchableOpacity style={styles.rightView} activeOpacity={1} onPress={showGuide}>
                <Image style={styles.medal} source={require('@src/assets/images/medal.png')} />
            </TouchableOpacity>
        );
    }, []);

    useEffect(() => {
        if (!app.competitionGuide) {
            app.recordCompetitionGuide(true);
            showGuide();
        }
    }, []);

    useEffect(() => {
        service.dataReport({
            data: {
                category: '用户行为',
                action: 'user_click_compete_screen',
                name: '用户进入答题PK页',
            },
            callback: (result: any) => {
                console.warn('result', result);
            },
        });
    }, []);

    //背景音乐
    useEffect(() => {
        const music = playSound('competition_bg.mp3', true);
        return () => {
            music.stop();
        };
    }, []);

    // const guideText = useMemo(() => {
    //     if (app.gameConfig.ticket_loss && app.gameConfig.gold_loss) {
    //         return `匹配成功消耗${app.gameConfig.ticket_loss}精力点，答题失败将扣除${app.gameConfig.gold_loss}智慧点(中途离场视为失败)，`;
    //     } else if (app.gameConfig.ticket_loss) {
    //         return `匹配成功消耗${app.gameConfig.ticket_loss}精力点，`;
    //     } else if (app.gameConfig.gold_loss) {
    //         return `答题失败将扣除${app.gameConfig.gold_loss}智慧点(中途离场视为失败)，`;
    //     }
    // }, [app.gameConfig]);

    return (
        <PageContainer hiddenNavBar>
            <ImageBackground style={styles.background} source={require('@src/assets/images/matching_bg.png')}>
                <View style={styles.container}>
                    <View style={styles.competitorLeft}>
                        <MatchTheUser fadeIn={store.rival.id} user={store.me} theLeft={true} />
                    </View>
                    <View style={styles.challengeWrap}>
                        <ChallengeButton
                            matching={store.matching}
                            matched={!!store.rival.id}
                            onPress={() => {
                                playSound('start_match.mp3');
                                store.matchGame();
                            }}
                        />
                    </View>
                    <View style={styles.competitorRight}>
                        <MatchTheUser fadeIn={store.rival.id} user={store.rival} />
                    </View>
                    {store.matching && !store.rival.id && (
                        <Animated.View style={[styles.cancelMatchWrap, animateStyles]}>
                            <TouchableOpacity style={styles.cancelMatch} onPress={cancelMatch} disabled={disableCancel}>
                                <Text style={styles.cancelMatchText}>取消匹配</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </View>
            </ImageBackground>
            <View style={styles.header}>
                <NavigatorBar
                    navigation={navigation}
                    style={styles.navigatorBar}
                    titleStyle={styles.titleStyle}
                    title="双人对战"
                    rightView={rightView}
                />
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    background: {
        height: '100%',
        resizeMode: 'cover',
        width: '100%',
    },
    cancelMatch: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: PxFit(6),
        height: PxFit(42),
        justifyContent: 'center',
        position: 'absolute',
        width: PxFit(180),
    },
    cancelMatchText: {
        color: Theme.watermelon,
        fontSize: PxFit(16),
        fontWeight: 'bold',
    },
    cancelMatchWrap: {
        position: 'absolute',
        alignItems: 'center',
        height: PxFit(42),
        width: PxFit(180),
        top: SCREEN_HEIGHT * 0.5 + PxFit(120),
    },
    challengeWrap: {
        marginVertical: PxFit(50),
    },
    competitorLeft: {
        alignItems: 'flex-start',
        width: SCREEN_WIDTH,
    },
    competitorRight: {
        alignItems: 'flex-end',
        width: SCREEN_WIDTH,
    },
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    medal: {
        height: (PxFit(22) * 75) / 56,
        marginRight: PxFit(5),
        width: PxFit(22),
    },
    modal: {
        backgroundColor: 'rgba(255,255,255,0)',
        flex: 1,
    },
    navigatorBar: {
        backgroundColor: 'transparent',
    },
    rightView: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center',
    },
    titleStyle: {
        fontWeight: 'bold',
    },
    overlayInner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tips: {
        margin: PxFit(Theme.itemSpace),
    },
    tipsTitle: {
        color: Theme.watermelon,
        fontSize: PxFit(15),
        fontWeight: 'bold',
        marginBottom: PxFit(10),
    },
    tipsText: {
        color: Theme.watermelon,
        fontSize: PxFit(14),
    },
});
