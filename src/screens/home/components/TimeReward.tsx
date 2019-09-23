import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, AppState } from 'react-native';
import { TouchFeedback, RewardTipsOverlay } from 'components';
import { GQL, useMutation, useQuery } from 'apollo';
import { Tools, Theme } from 'utils';

interface Props {
    navigation: Function;
}

const TimeReward = (props: Props) => {
    const [time, setTime] = useState(Date.now());
    const [received, setReceived] = useState(false);
    const { navigation } = props;
    const [timeReward] = useMutation(GQL.TimeRewardMutation, {
        variables: {
            reward_type: 'HOUR_REWARD',
        },
        errorPolicy: 'all',
        refetchQueries: () => [
            {
                query: GQL.SignInsQuery,
            },
        ],
    });

    const { data, loading, error, refetch } = useQuery(GQL.systemConfigQuery);

    useEffect(() => {
        countDown();
    }, []);

    useEffect(() => {
        if (data && data.systemConfig) {
            setTime(data.systemConfig.next_time_hour_reward.time_unix - Math.ceil(Date.now() / 1000));
        }
        if (!loading) {
            AppState.addEventListener('change', handleAppStateChange);
        }
    }, [loading]);

    useEffect(() => {
        if (time === 60) {
            setReceived(false);
        }
        if (time === 0) {
            setTime(3600);
        }
    });

    const handleAppStateChange = (nextAppState: any) => {
        console.log('nextAppState', nextAppState);
        if (nextAppState === 'active') {
            refetch();
            setTime(data.systemConfig.next_time_hour_reward.time_unix - Math.ceil(Date.now() / 1000));
        }
    };

    const countDown = () => {
        let timer: any = null;
        if (time > 0) {
            timer = setInterval(() => {
                setTime((time: number) => time - 1);
            }, 1000);
        }
        return () => {
            clearInterval(timer);
        };
    };

    const getReward = async () => {
        try {
            const { result, error } = await timeReward();
            const goldReward = Tools.syncGetter('data.timeReward', result);
            showRewardTips(goldReward);
            setReceived(true);
        } catch (e) {
            Toast.show({ content: '领取失败' });
        }
    };

    const showRewardTips = (goldReward: number) => {
        const reward = {
            gold: goldReward,
        };
        const title = '时段奖励领取成功';
        const isRewardVideo = true;
        RewardTipsOverlay.show(reward, navigation, title, isRewardVideo);
    };

    const minute = Math.floor(time / 60) > 9 ? Math.floor(time / 60) : '0' + Math.floor(time / 60);
    const second = time % 60 > 9 ? time % 60 : '0' + (time % 60);

    if (loading || error) {
        return null;
    }

    return (
        <TouchFeedback style={styles.container} onPress={getReward}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={require('../../../assets/images/time_reward.png')}
                    style={{ width: (24 * 568) / 251, height: 24, marginRight: -35 }}></Image>
                {(minute < 1 || minute > 58) && !received ? (
                    <Text style={styles.received}>领取奖励</Text>
                ) : (
                    <Text style={styles.time}>{`${minute}:${second}`}</Text>
                )}
            </View>
        </TouchFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    received: {
        fontSize: 8,
        width: 35,
        color: Theme.theme,
        textAlign: 'center',
    },
    time: {
        fontSize: 8,
        width: 35,
        paddingRight: 2,
        textAlign: 'center',
        color: Theme.theme,
    },
});

export default TimeReward;
