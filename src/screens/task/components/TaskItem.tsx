import React, { Fragment, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image, Animated, Linking, AppState } from 'react-native';

import { Button, Row, Iconfont, TouchFeedback, FeedOverlay, RewardTipsOverlay } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, Tools } from 'utils';

import { Mutation, compose, useMutation, GQL } from 'apollo';
import { exceptionCapture } from 'common';
import { app } from 'store';
import { ad, AppUtil } from 'native';
import service from 'service';
import { Overlay } from 'teaset';

interface Props {
    handler: Function;
    task: Task;
    setLoading: Function;
    setUnLoading: Function;
}

interface Task {
    id: Number;
    name: String;
    gold: Number;
    ticket: Number;
    contribute: Number;
    taskAction: Number;
    userTaskStatus: Number;
    submit_name: string;
    details: string;
    type: Number;
    route: String;
    package: String;
    post_id: Number;
    icon: String;
}

const TaskItem = (props: Props) => {
    const { handler, task, setLoading, setUnLoading } = props;
    const [taskDetailVisiable, setTaskDetailVisiable] = useState(false);
    const [rotateValue, setRotateValue] = useState(new Animated.Value(0));
    const [fadeValue, setFadeValue] = useState(new Animated.Value(0));

    const refetchQuery = () => [
        {
            query: GQL.TasksQuery,
        },
        {
            query: GQL.UserQuery,
            variables: { id: app.me.id },
        },
    ];

    const [receiveTask] = useMutation(GQL.ReceiveTaskMutation, {
        variables: {
            task_id: task.id,
        },
        refetchQueries: refetchQuery,
    });

    const [taskReward] = useMutation(GQL.TaskRewardMutation, {
        variables: {
            task_id: task.id,
        },
        refetchQueries: refetchQuery,
    });

    //领取任务奖励
    const getReward = async () => {
        setLoading();
        const [error, res] = await exceptionCapture(taskReward);
        if (error) {
            let str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
        }
        setUnLoading();
        if (res.data.taskReward == 1) {
            RewardTipsOverlay.show({
                reward: {
                    gold: task.gold,
                    ticket: task.ticket,
                    contribute: 0,
                },
                title: '领取任务奖励成功',
                rewardVideo: true,
            });
            // Toast.show({ content: '领取成功' });
        } else {
            Toast.show({ content: '已经领取该奖励了哦~' });
        }
    };

    //领取任务
    const getTask = async () => {
        setLoading();
        const [error, res] = await exceptionCapture(receiveTask);
        if (error) {
            let str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
        }
        setUnLoading();
        if (res.data.receiveTask == 1) {
            FeedOverlay.show({
                title: '领取任务成功',
            });

            if (task.type == 2 && task.package) {
                // Tools.navigate('任务详情', { task: task });
                viewTask();
            }
        } else {
            Toast.show({ content: '已经领取该任务了哦~' });
        }
    };

    // 完成任务
    const completeTask = () => {
        const { task } = props;
        app.client
            .mutate({
                mutation: GQL.CompleteTask,
                variables: {
                    task_id: task.id,
                },
                refetchQueries: refetchQuery,
            })
            .then((data: any) => {
                console.log('data :', data);
                Toast.show({
                    content: '任务完成',
                });
            })
            .catch((err: any) => {
                console.log('err :', err);
            });
    };

    // 查看任务
    const viewTask = () => {
        const { task } = props;
        app.client
            .query({
                query: GQL.PostQuery,
                variables: { id: task.post_id || 10667 },
                fetchPolicy: 'network-only',
            })
            .then((result: any) => {
                console.log('result :', result);
                const post = Tools.syncGetter('data.post', result);
                if (post) {
                    Tools.navigate('VideoPost', { medium: [post], isPost: true });
                }
            })
            .catch((error: any) => {});
    };

    //处理下载任务
    const stateChangeHandle = (event: any) => {
        const { task } = props;

        if (event === 'active' && task.package && task.userTaskStatus == 0) {
            AppUtil.CheckApkExist(task.package, (data: any) => {
                if (data) {
                    completeTask();
                }
            });
        }
    };

    useEffect(() => {
        AppState.addEventListener('change', stateChangeHandle);
        return () => {
            AppState.removeEventListener('change', stateChangeHandle);
        };
    }, [stateChangeHandle]);

    const RewardContent = () => {
        return (
            <Row>
                {task.ticket > 0 && (
                    <Row style={styles.reword}>
                        <Image
                            source={require('../../../assets/images/heart.png')}
                            style={{ width: PxFit(17), height: PxFit(17) }}
                        />
                        <Text style={styles.rewordText}>{`+${task.ticket}`}</Text>
                    </Row>
                )}
                {task.gold ? (
                    <Row style={styles.reword}>
                        <Image
                            source={require('../../../assets/images/diamond.png')}
                            style={{ width: PxFit(17), height: PxFit(17) }}
                        />
                        <Text style={styles.rewordText}>{`+${task.gold}`}</Text>
                    </Row>
                ) : null}
                {task.contribute > 0 && (
                    <Row style={styles.reword}>
                        <Image
                            source={require('../../../assets/images/gongxian.png')}
                            style={{ width: PxFit(13), height: PxFit(13) }}
                        />
                        <Text style={styles.rewordText}>{`+${task.contribute}`}</Text>
                    </Row>
                )}
            </Row>
        );
    };

    //

    const TaskButton = () => {
        let { handler, task } = props;

        let name = task.submit_name;
        let textColor = Theme.white;
        let doTask = handler;
        let backgroundColor = Theme.primaryColor;
        let disabled = false;

        switch (task.userTaskStatus) {
            case -1:
                name = '任务失败';
                backgroundColor = Theme.themeRed;
                doTask = () => {
                    Tools.navigate('失败详情', {
                        task: task,
                    });
                };
                break;
            case 0:
                if (task.type == 2 && task.package) {
                    name = '去下载';
                    doTask = () => {
                        Linking.openURL(`market://details?id=${task.package}`);
                        service.dataReport({
                            data: {
                                category: '用户行为',
                                action: 'user_click_try_play_task',
                                name: `用户点击${task.name}任务`,
                            },
                            callback: (result: any) => {
                                console.warn('result', result);
                            },
                        });
                    };
                }
                break;
            case null:
                name = '领取';
                doTask = getTask;
                break;
            case 1:
                name = '审核中';
                doTask = () => {
                    Toast.show({
                        content: '正在努力审核中。。',
                    });
                };
                break;
            case 2:
                name = '领奖励';
                doTask = getReward;
                break;
            case 3:
                name = '已完成';
                doTask = taskReward;
                disabled = true;
                textColor = Theme.grey;
                backgroundColor = Theme.borderColor;
                break;
            //TODO: 前端自定义任务扩充项  需逐步由tasksQuery控制
            case 7:
                backgroundColor = '#FF5267';
                break;
        }

        return (
            <Button
                title={name}
                style={{
                    borderRadius: PxFit(15),
                    height: PxFit(30),
                    width: PxFit(78),
                    backgroundColor: backgroundColor,
                }}
                textColor={textColor}
                onPress={doTask}
                disabled={disabled}
            />
        );
    };

    const TaskDetail = () => {
        if (taskDetailVisiable) {
            return (
                <Animated.View style={[styles.taskDetail, { opacity: fadeValue }]}>
                    <Text style={styles.taskDetailText}>{task.details}</Text>
                </Animated.View>
            );
        }
        // 任务详情由后端控制
    };

    /*激励视频任务弹窗解释*/
    const showTaskDetail = () => {
        let overlayView = (
            <Overlay.View animated>
                <View style={styles.overlayInner}>
                    <View
                        style={{
                            width: SCREEN_WIDTH - PxFit(70),
                            paddingHorizontal: PxFit(25),
                            paddingVertical: PxFit(20),
                            borderRadius: PxFit(10),
                            backgroundColor: '#fff',
                        }}>
                        <Text style={{ color: Theme.defaultTextColor, fontSize: PxFit(16), textAlign: 'center' }}>
                            {task.name}
                        </Text>

                        <View style={{ marginVertical: 10 }}>
                            <Text style={{ lineHeight: PxFit(20) }}>{task.details}</Text>
                        </View>
                        <Button title={'确定'} onPress={() => Overlay.hide(OverlayKey)} style={styles.buttonText} />
                    </View>
                </View>
            </Overlay.View>
        );
        const OverlayKey = Overlay.show(overlayView);
    };

    return (
        <Fragment>
            <TouchFeedback style={styles.container} onPress={task.details.length > 0 && showTaskDetail}>
                <Image
                    source={task.icon || require('@src/assets/images/task_money_icon.png')}
                    style={{ width: PxFit(42), height: PxFit(42), marginRight: PxFit(5), marginLeft: PxFit(15) }}
                />

                <Row
                    style={{
                        width: SCREEN_WIDTH - PxFit(65),
                        justifyContent: 'space-between',
                        paddingRight: PxFit(15),
                        paddingVertical: PxFit(15),
                        borderBottomColor: Theme.borderColor,
                        borderBottomWidth: PxFit(0.5),
                    }}>
                    <Row>
                        <Text style={styles.name}>{task.name}</Text>
                        {task.details ? (
                            <TouchFeedback onPress={task.details.length > 0 && showTaskDetail}>
                                <Image
                                    source={require('@src/assets/images/question.png')}
                                    style={{ width: PxFit(14), height: PxFit(14), marginHorizontal: PxFit(2) }}
                                />
                            </TouchFeedback>
                        ) : null}
                        {RewardContent()}
                    </Row>
                    {TaskButton()}
                </Row>
            </TouchFeedback>
            {TaskDetail()}
        </Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        // paddingVertical: PxFit(12),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        color: '#3c3c3c',
        fontSize: PxFit(14),
    },
    taskRight: {
        paddingVertical: PxFit(5),
        paddingLeft: 5,
        paddingRight: 15,
    },
    reword: {
        marginLeft: PxFit(2),
    },
    rewordText: {
        color: Theme.primaryColor,
        fontSize: PxFit(12),
        fontWeight: '200',
        // fontFamily: '',
    },
    taskDetail: {
        marginHorizontal: PxFit(15),
        paddingVertical: PxFit(10),
        paddingHorizontal: PxFit(10),
        marginBottom: PxFit(10),
        borderRadius: PxFit(10),
        backgroundColor: Theme.borderColor,
    },
    taskDetailText: {
        fontSize: PxFit(12),
        color: Theme.primaryFont,
        letterSpacing: 1,
        lineHeight: 18,
    },
    overlayInner: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        height: PxFit(38),
        borderRadius: PxFit(19),
        marginTop: PxFit(10),
        backgroundColor: '#45C3FF',
    },
});

export default TaskItem;
