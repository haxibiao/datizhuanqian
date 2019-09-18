import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TouchFeedback, RewardTipsOverlay } from 'components';
import { GQL, useMutation, useQuery } from 'apollo';
import { Tools } from 'utils';
import { app } from 'store';

interface Props {
    navigation: Function;
}

const TimeReward = (props: Props) => {
    const [time, setTime] = useState(3600);
    const { navigation } = props;
    const userInfo = useQuery(GQL.UserMeansQuery, {
        variables: {
            id: app.me.id,
        },
    });

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

    useEffect(() => {
        countDown();
    }, []);

    const countDown = () => {
        let timer: any = null;
        // console.log('data', data);
        if (time > 0) {
            timer = setInterval(() => {
                setTime(time => time - 1);
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

    const minute = Math.floor(time / 60);
    const second = time % 60 > 0 ? time % 60 : '00';

    // if (loading || error) {
    //     return null;
    // }
    return (
        <TouchFeedback style={styles.container} onPress={getReward}>
            <View>
                <Text style={{ fontSize: 11, textAlign: 'center' }}>时段奖励</Text>
                {minute < 1 || minute > 58 ? (
                    <Text style={{ fontSize: 10, letterSpacing: 1 }}>领取奖励</Text>
                ) : (
                    <Text
                        style={{
                            fontSize: 10,
                            letterSpacing: 3,
                            textAlign: 'center',
                        }}>{`${minute}:${second}`}</Text>
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
});

export default TimeReward;
