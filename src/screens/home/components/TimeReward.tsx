import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Text, View, StyleSheet, Image, AppState } from 'react-native';
import { TouchFeedback, RewardOverlay, FeedOverlay } from 'components';
import { GQL, useMutation, useQuery } from 'apollo';
import { Tools, Theme } from 'utils';
import _ from 'lodash';

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
            setTime(data.systemConfig.next_time_hour_reward.time_unix - data.systemConfig.time_unix);
        }
        if (!loading && data && data.systemConfig) {
            AppState.addEventListener('change', handleAppStateChange);
        }
    }, [loading]);

    useEffect(() => {
        if (time === 600) {
            setReceived(false);
        }
        if (time === 0) {
            setTime(3600);
        }
    });

    const handleAppStateChange = (nextAppState: any) => {
        if (nextAppState === 'active') {
            let timeRemain =
                data.systemConfig.next_time_hour_reward.time_unix - Math.ceil(Date.now() / 1000) > 0
                    ? data.systemConfig.next_time_hour_reward.time_unix - Math.ceil(Date.now() / 1000)
                    : 3600;
            setTime(timeRemain);
        }
    };

    const countDown = () => {
        const timer = setInterval(() => {
            setTime((time: number) => time - 1);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    };

    const getReward = useCallback(async () => {
        try {
            const result = await timeReward();
            const reward = Tools.syncGetter('data.timeReward', result);
            console.log('result', result);
            // const reward = { gold_reward: 10, ticket_reward: 0, contribute_reward: 0 };
            showRewardTips(reward);
        } catch (e) {
            let str = e.toString().replace(/Error: GraphQL error: /, '');
            // Toast.show({ content: str });
            FeedOverlay.show({
                title: str,
            });
        }
        setReceived(true);
    }, []);

    const debounceHandler = useMemo(() => _.debounce(getReward, 1000), [getReward]);

    const showRewardTips = (reward: { gold_reward: any; ticket_reward: any; contribute_reward: any }) => {
        const rewardContent = {
            gold: reward.gold_reward,
            ticket: reward.ticket_reward,
            contribute: reward.contribute_reward,
        };

        const title = '时段奖励领取成功';

        RewardOverlay.show({ reward: rewardContent, navigation, title, type: 'TimeReward' });
    };

    const minute = Math.floor(time / 60) > 9 ? Math.floor(time / 60) : '0' + Math.floor(time / 60);
    const second = time % 60 > 9 ? time % 60 : '0' + (time % 60);

    if (loading || error) {
        return null;
    }

    return (
        <TouchFeedback style={styles.container} navigation={navigation} authenticated onPress={debounceHandler}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={require('../../../assets/images/time_reward.png')}
                    style={{ width: (24 * 357) / 150, height: 24, marginRight: -35 }}
                />
                {minute > 50 && !received ? (
                    <Text style={styles.received}>领取</Text>
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
        fontSize: 10,
        width: 35,
        color: Theme.white,
        textAlign: 'center',
    },
    time: {
        fontSize: 10,
        width: 35,
        paddingRight: 2,
        textAlign: 'center',
        color: Theme.white,
    },
});

export default TimeReward;
