import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
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

    const { data, loading, error } = useQuery(GQL.systemConfigQuery);

    useEffect(() => {
        countDown();
    }, []);

    useEffect(() => {
        if (data && data.systemConfig) {
            setTime(data.systemConfig.next_time_hour_reward.time_unix - Math.ceil(Date.now() / 1000));
        }
    }, [loading]);

    useEffect(() => {
        console.log('kkkkkkkkk');
        if (time === 60) {
            setReceived(false);
        }
    });

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
            console.log('eeero', e);
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
            <Image
                source={require('../../../assets/images/time_reward.png')}
                style={{ width: (24 * 568) / 251, height: 24, marginBottom: -16 }}></Image>
            {(minute < 1 || minute > 58) && !received ? (
                <Text
                    style={{
                        fontSize: 8,
                        height: 9,
                        paddingLeft: 14,
                        color: Theme.primaryColor,
                    }}>
                    领取奖励
                </Text>
            ) : (
                <Text
                    style={{
                        fontSize: 8,
                        height: 9,
                        textAlign: 'center',
                        paddingLeft: 14,
                        color: Theme.primaryColor,
                    }}>{`${minute}:${second}`}</Text>
            )}
        </TouchFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default TimeReward;
