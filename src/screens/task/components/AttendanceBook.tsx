import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { Row, Iconfont } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, ISIOS, Tools } from 'utils';
import { GQL, useMutation, useQuery } from 'apollo';
import { app } from 'store';
import { BoxShadow } from 'react-native-shadow';
import { Overlay } from 'teaset';
import SignedReturn from './SignedReturn';

interface Sign {
    id: any;
    created_at: string;
    day: string | number;
    month: string | number;
    year: string | number;
    gold_reward: number;
    withdraw_lines: number;
    signed: boolean;
}

interface SignInReturns {
    id: any;
    gold_reward: string | number;
    contribute_reward: string | number;
}

const AttendanceBook = (props): JSX.Element => {
    const [boxShadowHeight, setBoxShadowHeight] = useState(150);

    const onLayoutEffect = useCallback(event => {
        setBoxShadowHeight(event.nativeEvent.layout.height);
    }, []);

    const overlayRef = useRef();

    const { data } = useQuery(GQL.SignInsQuery);
    const [createSignIn] = useMutation(GQL.CreateSignInMutation, {
        refetchQueries: (): array => [
            {
                query: GQL.SignInsQuery,
            },
            {
                query: GQL.UserMetaQuery,
                variables: { id: app.me.id },
            },
        ],
    });

    const signInData = useMemo(() => {
        return Tools.syncGetter('signIns', data) || {};
    }, [data]);
    // console.log('====================================');
    // console.log('signInDatasignInData', signInData, data);
    // console.log('====================================');
    const keep_signin_days = Tools.syncGetter('keep_signin_days', signInData);
    const today_signed = Tools.syncGetter('today_signed', signInData);
    const signIns = Tools.syncGetter('signs', signInData);

    const toDaySignIn = useCallback(
        Tools.throttle(async () => {
            if (!today_signed) {
                try {
                    const result = await createSignIn();
                    console.log('test result', result, signIns);
                    const todayReturns = Tools.syncGetter('data.createSignIn', result);
                    onSignInSuccess(todayReturns);
                } catch (e) {
                    Toast.show({ content: '签到失败' });
                }
            }
        }),
        [signIns, today_signed],
    );

    const onSignInSuccess = useCallback((returns: SignInReturns) => {
        Overlay.show(
            <Overlay.PopView
                style={{ alignItems: 'center', justifyContent: 'center' }}
                animated={true}
                ref={overlayRef}>
                <SignedReturn
                    gold={returns.gold_reward}
                    reward={returns.contribute_reward}
                    close={() => overlayRef.current.close()}
                />
            </Overlay.PopView>,
        );
    }, []);

    if (!signIns) {
        return null;
    }
    // console.log('====================================');
    // console.log('signIns', signIns);
    // console.log('====================================');
    return (
        <BoxShadow
            setting={Object.assign({}, shadowOpt, {
                height: boxShadowHeight,
            })}>
            <View style={styles.attendanceBook} onLayout={onLayoutEffect}>
                <View style={styles.header}>
                    <Text style={styles.signInText}>
                        已连续签到<Text style={styles.keepSignInText}>{`${keep_signin_days}/${signIns.length}`}</Text>天
                    </Text>
                    <TouchableWithoutFeedback onPress={() => Tools.navigate('Share')}>
                        <Row style={styles.shareButton}>
                            <Text style={styles.shareText}>去分享</Text>
                        </Row>
                    </TouchableWithoutFeedback>
                </View>
                <TouchableWithoutFeedback onPress={toDaySignIn}>
                    <View style={styles.attendance}>
                        {signIns.map((elem, index) => {
                            if (index === signIns.length - 1) {
                                return (
                                    <View style={styles.signItem} key={index}>
                                        {!elem.signed && (
                                            <Image
                                                style={styles.mysticGift}
                                                source={require('../../../assets/images/mystic_gift.png')}
                                            />
                                        )}
                                        <Image
                                            style={styles.giftImage}
                                            source={
                                                elem.signed
                                                    ? require('../../../assets/images/open_gift.png')
                                                    : require('../../../assets/images/gift.png')
                                            }
                                        />
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
                                                ? require('../../../assets/images/coin_grey.png')
                                                : require('../../../assets/images/coin_yellow.png')
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

const signItemWidth = (SCREEN_WIDTH - PxFit(Theme.itemSpace * 2)) / 7;
const coinImageWidth = signItemWidth * 0.8;

const shadowOpt = {
    width: SCREEN_WIDTH - PxFit(Theme.itemSpace * 2),
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
        paddingTop: PxFit(15),
    },
    attendanceBook: {
        backgroundColor: '#fff',
        borderRadius: PxFit(10),
        paddingVertical: PxFit(15),
        shadowColor: '#E8E8E8',
        shadowOffset: { width: PxFit(5), height: PxFit(5) },
        shadowOpacity: 0.8,
        shadowRadius: PxFit(10),
    },
    coinImage: {
        height: PxFit(20),
        marginRight: PxFit(4),
        width: PxFit(20),
    },
    coinImage: {
        alignItems: 'center',
        height: coinImageWidth,
        justifyContent: 'center',
        width: coinImageWidth,
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
        height: coinImageWidth,
        width: coinImageWidth,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: PxFit(10),
    },
    keepSignInText: {
        color: Theme.primaryColor,
        fontSize: PxFit(18),
    },
    mysticGift: {
        alignItems: 'center',
        height: (coinImageWidth * 86) / 164,
        justifyContent: 'center',
        width: coinImageWidth,
    },
    recordDayText: {
        color: Theme.secondaryTextColor,
        fontSize: PxFit(13),
    },
    rewardGoldText: {
        color: '#fff',
        fontSize: PxFit(12),
        marginBottom: coinImageWidth * 0.07,
    },
    shareButton: {
        backgroundColor: '#f4f4f4',
        borderRadius: PxFit(20),
        justifyContent: 'center',
        paddingHorizontal: PxFit(10),
        paddingVertical: PxFit(4),
    },
    shareText: {
        color: Theme.secondaryTextColor,
        fontSize: PxFit(13),
    },
    signInText: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(17),
        fontWeight: 'bold',
    },
    signItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: signItemWidth * 0.1,
    },
});

export default AttendanceBook;
