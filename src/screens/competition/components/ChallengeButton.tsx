import React, { useMemo, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { Avatar, Row, Center, Iconfont, WaveView } from '@src/components';
import { Theme, PxFit, SCREEN_WIDTH } from '@src/utils';
import { throttle, useCountDown, syncGetter, useAppState } from '@src/common';
import { BoxShadow } from 'react-native-shadow';
import { GQL, useMutation, useQuery } from '@src/apollo';
import { observer, app } from 'store';

const challenge = observer(props => {
    const { onPress, matching, matched } = props;
    const [isLoading, setLoading] = useState(true);
    const [surplusMillisecond, setSurplusMillisecond] = useState(0);
    const showToast = useRef(true);
    // 检测是否在游戏中
    const { data: userGameQuery, loading, error, refetch } = useQuery(GQL.UserGameQuery, {
        variables: { user_id: app.me.id },
        fetchPolicy: 'network-only',
    });
    const onlineStatus = useMemo(() => syncGetter('userGame.online_status', userGameQuery), [userGameQuery]);
    const surplus_ms = useMemo(() => syncGetter('userGame.in_game.surplus_ms', userGameQuery), [userGameQuery]);
    console.log('onlineStatus===================================');
    console.log(surplus_ms);
    console.log('onlineAt===================================');
    // loading和倒计时的UI切换
    useEffect(() => {
        if (!loading) {
            setLoading(false);
            if (onlineStatus === 'PLAYING_STATUS' && surplus_ms > 0) {
                if (showToast.current) {
                    showToast.current = false;
                    Toast.show({ content: '上一场游戏未结束\n请稍后再试', layout: 'top', duration: 1800 });
                }
                setSurplusMillisecond(surplus_ms);
            } else {
                setSurplusMillisecond(0);
            }
        }
    }, [loading, onlineStatus, surplus_ms]);

    useAppState(refetch);

    const countDown = useCountDown({ expirationTime: surplusMillisecond });
    return (
        <BoxShadow setting={shadowOpt}>
            {isLoading || !countDown.isEnd ? (
                <View style={styles.matchingButton}>
                    {isLoading ? (
                        <ActivityIndicator color={Theme.watermelon} size={'large'} />
                    ) : (
                        <>
                            <Image style={styles.battle} source={require('@src/assets/images/count_down.png')} />
                            <Text style={styles.time}>{`${countDown.minutes}:${countDown.seconds}`}</Text>
                        </>
                    )}
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    {matching && <WaveView containerStyle={styles.waveContainer} style={styles.wave} />}
                    <TouchableOpacity
                        disabled={matching || matched}
                        onPress={throttle(onPress)}
                        style={styles.matchingButton}>
                        <Image style={styles.battle} source={require('@src/assets/images/battle.png')} />
                        <Text style={styles.text}>{matched ? '匹配成功' : matching ? '正在匹配' : '立即PK'}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </BoxShadow>
    );
});

const shadowOpt = {
    width: PxFit(120),
    height: PxFit(120),
    color: '#fff',
    border: PxFit(10),
    radius: PxFit(60),
    opacity: 0.5,
    x: 0,
    y: 0,
};

const styles = StyleSheet.create({
    battle: {
        height: PxFit(40),
        width: PxFit(40),
    },
    matchingButton: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: PxFit(60),
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(16),
        fontWeight: 'bold',
        marginTop: PxFit(10),
    },
    time: {
        color: Theme.watermelon,
        fontSize: PxFit(20),
        fontWeight: 'bold',
        marginTop: PxFit(10),
    },
    wave: {
        borderRadius: PxFit(100),
    },
    waveContainer: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
});

export default challenge;
