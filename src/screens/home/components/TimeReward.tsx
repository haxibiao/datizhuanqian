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
            setTime(data.systemConfig.next_time_hour_reward.time_unix - data.systemConfig.time_unix);
        }
        if (!loading) {
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
        console.log('nextAppState', nextAppState);
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

    const getReward = async () => {
        try {
            const { result, error } = await timeReward();
            console.log('result', result);
            const reward = Tools.syncGetter('data.timeReward', result);
            console.log('reward', reward);
            showRewardTips(reward);
        } catch (e) {
            let str = e.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
        }
        setReceived(true);
    };

    const showRewardTips = (reward: { reward_type: any; reward_value: number }) => {
        const rewardContent = {
            gold: 0,
            ticket: 0,
            contribute: 0,
        };
        switch (reward.reward_type) {
            case 'gold':
                rewardContent.gold = reward.reward_value;
                break;
            case 'ticket':
                rewardContent.ticket = reward.reward_value;
                break;
            case 'contribute':
                rewardContent.contribute = reward.reward_value;
                break;
        }

        const title = '时段奖励领取成功';
        const isRewardVideo = true;
        RewardTipsOverlay.show(rewardContent, navigation, title, isRewardVideo);
    };

    const minute = Math.floor(time / 60) > 9 ? Math.floor(time / 60) : '0' + Math.floor(time / 60);
    const second = time % 60 > 9 ? time % 60 : '0' + (time % 60);

    if (loading || error) {
        return null;
    }

    return (
        <TouchFeedback style={styles.container} navigation={navigation} authenticated onPress={time > 600 && getReward}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={require('../../../assets/images/time_reward.png')}
                    style={{ width: (24 * 357) / 150, height: 24, marginRight: -35 }}></Image>
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
