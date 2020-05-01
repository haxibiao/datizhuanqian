import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, TouchableWithoutFeedback, Animated } from 'react-native';
import { GQL, useMutation, useQuery, useApolloClient } from 'apollo';
import { useCirculationAnimation } from '@src/common';
import { app, config } from 'store';
import { BoxShadow } from 'react-native-shadow';
import { Overlay } from 'teaset';
import { playVideo } from 'common';
import SignedReturn from './SignedReturn';
import * as SignedReturnOverlay from './SignedReturnOverlay';

interface SignInReturns {
    id: any;
    gold_reward: string | number;
    contribute_reward: string | number;
}

const AttendanceBook = (): JSX.Element => {
    const [boxShadowHeight, setBoxShadowHeight] = useState(150);
    const client = useApolloClient();

    const onLayoutEffect = useCallback(event => {
        setBoxShadowHeight(event.nativeEvent.layout.height);
    }, []);

    const overlayRef = useRef();

    const { data, refetch } = useQuery(GQL.SignInsQuery, {
        fetchPolicy: 'network-only',
    });
    const [createSignIn] = useMutation(GQL.CreateSignInMutation, {
        client: app.mutationClient,
        refetchQueries: (): array => [
            {
                query: GQL.SignInsQuery,
                fetchPolicy: 'network-only',
            },
            {
                query: GQL.UserMetaQuery,
                variables: { id: app.me.id },
            },
        ],
    });

    const signInData = useMemo(() => {
        return Helper.syncGetter('signIns', data) || {};
    }, [data]);
    const keep_signin_days = Helper.syncGetter('keep_signin_days', signInData);
    const today_signed = Helper.syncGetter('today_signed', signInData);
    const signIns = Helper.syncGetter('signs', signInData);

    useEffect(() => {
        if (today_signed === false) {
            toDaySignIn();
        }
    }, [signIns, keep_signin_days]);

    const toDaySignIn = useCallback(
        __.throttle(async () => {
            if (!today_signed) {
                try {
                    const result = await createSignIn();
                    const todayReturns = Helper.syncGetter('data.createSignIn', result);
                    onSignInSuccess(todayReturns);
                } catch (e) {
                    const str = e.toString().replace(/Error: GraphQL error: /, '');
                    Toast.show({ content: str || '签到失败' });
                }
            } else {
                // onSignInSuccess({
                //     gold_reward: 10,
                //     contribute_reward: 10,
                // });
                Toast.show({ content: '今天已经签到过了哦' });
            }
        }),
        [signIns, today_signed, keep_signin_days],
    );

    const onSignInSuccess = useCallback(
        (returns: SignInReturns) => {
            if (Device.IOS) {
                //避免ios过审有问题
                return;
            }
            console.log(' onSignInSuccess keep_signin_days :', keep_signin_days);
            SignedReturnOverlay.show({
                gold: returns.gold_reward,
                reward: returns.contribute_reward,
                client: client,
                signInDays: keep_signin_days + 1,
            });
        },
        [keep_signin_days],
    );

    const animation = useCirculationAnimation({ duration: 2000, start: true });
    const translateY = animation.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [-PxFit(2), -PxFit(5), 0, PxFit(5), -PxFit(2)],
    });

    const loadAd = useCallback(() => {
        playVideo({
            type: 'Sigin',
        });
    }, []);

    const doubleReward = useMemo(() => {
        return (
            <TouchableWithoutFeedback onPress={loadAd}>
                <View style={styles.signItem}>
                    <Animated.Image
                        source={require('@src/assets/images/double_signIn_reward.png')}
                        style={[styles.doubleRewardImage, { transform: [{ translateY }] }]}
                    />
                    <Image
                        style={styles.redEnvelop}
                        source={require('@src/assets/images/get_double_signIn_reward.gif')}
                    />
                    <Text style={styles.recordDayText}>领取</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }, [translateY]);

    if (!signIns) {
        return null;
    }

    return (
        <BoxShadow
            setting={Object.assign({}, shadowOpt, {
                height: boxShadowHeight,
            })}>
            <View style={styles.attendanceBook} onLayout={onLayoutEffect}>
                <View style={styles.header}>
                    <Text style={styles.signInText}>
                        已签到<Text style={styles.keepSignInText}>{` ${keep_signin_days}/${signIns.length} `}</Text>天
                    </Text>
                </View>
                <TouchableWithoutFeedback
                    onPress={() => {
                        toDaySignIn();
                        refetch();
                    }}>
                    <View style={styles.attendance}>
                        {signIns.map((elem, index) => {
                            if (
                                elem.signed &&
                                elem.reward_rate === 1 &&
                                keep_signin_days === index + 1 &&
                                !config.disableAd
                            ) {
                                return <View key={index}>{doubleReward}</View>;
                            }

                            if (index === signIns.length - 1) {
                                return (
                                    <View style={styles.signItem} key={index}>
                                        {!elem.signed && (
                                            <Animated.Image
                                                source={require('@src/assets/images/mystic_gift.png')}
                                                style={[styles.mysticGift, { transform: [{ translateY }] }]}
                                            />
                                        )}
                                        <View style={styles.giftImage}>
                                            <Image
                                                style={{ height: signItemWidth * 0.65, width: signItemWidth * 0.65 }}
                                                source={
                                                    elem.signed
                                                        ? require('@src/assets/images/ic_task_attendance_open_reward.png')
                                                        : require('@src/assets/images/ic_task_attendance_reward.png')
                                                }
                                            />
                                        </View>

                                        <Text style={styles.recordDayText}>
                                            {elem.signed ? '已签' : `${index + 1}天`}
                                        </Text>
                                    </View>
                                );
                            }

                            return (
                                <View style={styles.signItem} key={index}>
                                    <ImageBackground
                                        style={styles.coinImage}
                                        source={
                                            elem.signed
                                                ? require('@src/assets/images/coin_grey.png')
                                                : require('@src/assets/images/coin_yellow.png')
                                        }>
                                        <Text style={[styles.rewardGoldText, elem.signed && { color: '#a0a0a0' }]}>
                                            {elem.gold_reward || 0}
                                        </Text>
                                    </ImageBackground>
                                    <Text style={styles.recordDayText}>{elem.signed ? '已签' : `${index + 1}天`}</Text>
                                </View>
                            );
                        })}
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.footer} />
            </View>
        </BoxShadow>
    );
};

const signItemWidth = (Device.WIDTH - PxFit(Theme.itemSpace * 2) - PxFit(10)) / 7;
const coinImageWidth = signItemWidth * 0.9;
const mysticGiftHeight = (coinImageWidth * 0.9 * 86) / 164;
const doubleRewardHeight = mysticGiftHeight;

const shadowOpt = {
    width: Device.WIDTH - PxFit(Theme.itemSpace * 2),
    height: PxFit(150),
    color: '#E8E8E8',
    border: PxFit(10),
    radius: PxFit(10),
    opacity: 0.5,
    x: 0,
    y: 0,
    style: {
        margin: PxFit(Theme.itemSpace),
    },
};

const styles = StyleSheet.create({
    attendance: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        paddingTop: PxFit(10),
    },
    attendanceBook: {
        backgroundColor: '#fff',
        borderRadius: PxFit(10),
        paddingHorizontal: PxFit(5),
        paddingVertical: mysticGiftHeight,
        shadowColor: '#E8E8E8',
        shadowOffset: { width: PxFit(5), height: PxFit(5) },
        shadowOpacity: 0.8,
        shadowRadius: PxFit(10),
    },
    coinImage: {
        alignItems: 'center',
        height: coinImageWidth,
        justifyContent: 'center',
        width: coinImageWidth,
    },
    doubleRewardImage: {
        alignItems: 'center',
        height: doubleRewardHeight,
        justifyContent: 'center',
        left: signItemWidth * 0.09,
        position: 'absolute',
        top: signItemWidth * 0.02,
        width: coinImageWidth * 0.9,
    },
    redEnvelop: {
        height: coinImageWidth * 0.9,
        width: coinImageWidth * 0.9,
        margin: coinImageWidth * 0.05,
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: {
        color: '#9E6124',
        fontSize: PxFit(15),
    },
    giftImage: {
        height: signItemWidth * 0.9,
        width: signItemWidth * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: PxFit(10),
    },
    keepSignInText: {
        color: '#FF5733',
        fontSize: PxFit(18),
    },
    mysticGift: {
        alignItems: 'center',
        height: mysticGiftHeight,
        justifyContent: 'center',
        left: signItemWidth * 0.09,
        position: 'absolute',
        top: signItemWidth * 0.02,
        width: coinImageWidth * 0.9,
    },
    recordDayText: {
        color: '#888888',
        fontSize: PxFit(12),
    },
    rewardGoldText: {
        color: '#9F641A',
        fontSize: PxFit(11),
        fontWeight: 'bold',
        marginBottom: coinImageWidth * 0.07,
    },
    shareButton: {
        justifyContent: 'center',
        paddingLeft: PxFit(10),
        paddingVertical: PxFit(4),
    },
    shareText: {
        color: '#FF5733',
        fontSize: PxFit(13),
        marginRight: PxFit(2),
    },
    signInText: {
        color: Theme.defaultTextColor,
        fontSize: Font(18),
        fontWeight: 'bold',
    },
    signItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: signItemWidth * 0.05,
        paddingTop: mysticGiftHeight,
    },
});

export default AttendanceBook;
