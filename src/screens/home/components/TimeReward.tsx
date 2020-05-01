import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Text, View, StyleSheet, Image, AppState } from 'react-native';
import { TouchFeedback, RewardOverlay, ErrorOverlay, VideoRewardOverlay } from 'components';
import { GQL, useMutation, useQuery } from 'apollo';
import { app, config } from '@src/store';
import AuditResultOverlay from '@src/screens/answer/components/AuditResultOverlay';
// import { config } from 'src/store';
import service from 'service';

interface Props {
    navigation: any;
}

const TimeReward = (props: Props) => {
    const [time, setTime] = useState(Date.now());
    const [received, setReceived] = useState(false);
    const { navigation } = props;
    const [systemConfig, setSystemConfig] = useState({});

    // const [timeReward] = useMutation(GQL.TimeRewardMutation, {
    //     variables: {
    //         reward_type: 'HOUR_REWARD',
    //     },
    //     // client: app.client,
    //     errorPolicy: 'all',
    //     refetchQueries: () => [
    //         {
    //             query: GQL.SignInsQuery,
    //         },
    //     ],
    // });

    // const { data, loading, error, refetch } = useQuery(GQL.systemConfigQuery);

    const systemConfigQuery = useCallback(() => {
        return app.client.query({
            query: GQL.systemConfigQuery,
            fetchPolicy: 'network-only',
        });
    }, [app.client]);

    const fetchData = useCallback(async () => {
        const [error, result] = await Helper.exceptionCapture(systemConfigQuery);
        // console.log('result :', result, error);
        // const systemConfig = Helper.syncGetter('data.systemConfig', result);
        setSystemConfig(Helper.syncGetter('data.systemConfig', result));
        // return systemConfig;
    }, [systemConfigQuery]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        countDown();
    }, []);

    useEffect(() => {
        if (
            Helper.syncGetter('time_unix', systemConfig) &&
            Helper.syncGetter('next_time_hour_reward.time_unix', systemConfig)
        ) {
            setTime(
                Helper.syncGetter('next_time_hour_reward.time_unix', systemConfig) -
                    Helper.syncGetter('time_unix', systemConfig),
            );
        }

        if (systemConfig && Helper.syncGetter('next_time_hour_reward', systemConfig)) {
            AppState.addEventListener('change', handleAppStateChange);
        }
    }, [systemConfig]);

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
                Helper.syncGetter('next_time_hour_reward.time_unix', systemConfig) - Math.ceil(Date.now() / 1000) > 0
                    ? Helper.syncGetter('next_time_hour_reward.time_unix', systemConfig) - Math.ceil(Date.now() / 1000)
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
        service.clientMutate({
            mutation: GQL.TimeRewardMutation,
            variables: {
                reward_type: 'HOUR_REWARD',
            },
            options: {
                refetchQueries: () => [
                    {
                        query: GQL.SignInsQuery,
                    },
                ],
            },
            dispatch: (result: any) => {
                const reward = Helper.syncGetter('data.timeReward', result);
                showRewardTips(reward);
            },
            showError: false,
            onFaild: error => {
                let str = error.toString().replace(/Error: GraphQL error: /, '');
                // Toast.show({ content: str });
                ErrorOverlay.show({
                    content: str,
                    type: 'TimeReward',
                });
            },
        });

        setReceived(true);
    }, []);

    const debounceHandler = useMemo(() => __.throttle(getReward, 5000), [getReward]);

    const showRewardTips = (reward: { gold_reward: any; ticket_reward: any; contribute_reward: any }) => {
        const rewardContent = {
            gold: reward.gold_reward,
            ticket: reward.ticket_reward,
            contribute: reward.contribute_reward,
        };

        const title = '每个整点都记得来领奖抢提现哦';

        VideoRewardOverlay.show({ reward: rewardContent, navigation, title, type: 'TimeReward' });
    };

    const minute = Math.floor(time / 60) > 9 ? Math.floor(time / 60) : '0' + Math.floor(time / 60);
    const second = time % 60 > 9 ? time % 60 : '0' + (time % 60);

    if (config.disabled) {
        return null;
    }

    return (
        <TouchFeedback style={styles.container} navigation={navigation} authenticated onPress={debounceHandler}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // justifyContent: 'center',
                    backgroundColor: '#FAFAFA',
                    borderRadius: PxFit(16.5),
                    height: PxFit(31),
                    width: PxFit(70),
                }}>
                <Image
                    source={require('@src/assets/images/ic_time_reward.png')}
                    style={{ width: PxFit(24), height: PxFit(24), marginLeft: PxFit(5) }}
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
        marginTop: PxFit(14),
    },
    received: {
        fontSize: Font(10),
        width: 35,
        color: Theme.grey,
        textAlign: 'center',
    },
    time: {
        fontSize: Font(10),
        // width: 35,
        paddingLeft: PxFit(5),
        textAlign: 'center',
        color: Theme.grey,
        fontWeight: 'bold',
    },
});

export default TimeReward;
