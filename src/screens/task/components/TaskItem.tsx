import React, { Fragment, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Animated, Linking, AppState } from 'react-native';

import { Button, Row, TouchFeedback, FeedOverlay, RewardOverlay, Avatar, Loading } from '@src/components';
import { useMutation, GQL } from 'apollo';
import { app } from 'store';
import { AppUtil } from 'native';
import service from 'service';
import { Overlay } from 'teaset';
import { taskTrack } from '@src/common';
import * as ReceiveTaskOverlay from './ReceiveTaskOverlay';

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
    const { task, handler } = props;
    const [taskDetailVisiable] = useState(false);
    const [] = useState(new Animated.Value(0));
    const [fadeValue] = useState(new Animated.Value(0));

    const refetchQuery = () => [
        {
            query: GQL.TasksQuery,
            variables: { offest: 0, limit: 100 },
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
        client: app.mutationClient,
        refetchQueries: refetchQuery,
    });

    const [taskReward] = useMutation(GQL.TaskRewardMutation, {
        variables: {
            task_id: task.id,
        },
        client: app.mutationClient,
        refetchQueries: refetchQuery,
    });

    //领取任务奖励
    const getReward = async () => {
        Loading.show('领取中');
        const [error, res] = await Helper.exceptionCapture(taskReward);
        if (error) {
            let str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
        }
        Loading.hide();
        if (res.data.taskReward == 1) {
            RewardOverlay.show({
                reward: {
                    gold: task.gold,
                    ticket: task.ticket,
                    contribute: 0,
                },
                title: '领取任务奖励成功',
            });
            // Toast.show({ content: '领取成功' });
        } else {
            Toast.show({ content: '已经领取该奖励了哦~' });
        }
    };

    //领取任务
    const getTask = async () => {
        Loading.show('领取中');
        const [error, res] = await Helper.exceptionCapture(receiveTask);
        if (error) {
            let str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
        }
        Loading.hide();
        if (res.data.receiveTask == 1) {
            if (task.type == 2 && task.package) {
                // Helper.middlewareNavigate('任务详情', { task: task });
                viewTask();
            } else {
                ReceiveTaskOverlay.show({
                    handler: handler,
                });
            }
        } else {
            Toast.show({ content: '已经领取该任务了哦~' });
        }
    };

    // 完成任务
    const completeTask = () => {
        const { task } = props;
        app.mutationClient
            .mutate({
                mutation: GQL.CompleteTask,
                variables: {
                    task_id: task.id,
                },
                refetchQueries: refetchQuery,
            })
            .then((data: any) => {
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
                const post = Helper.syncGetter('data.post', result);
                if (post) {
                    Helper.middlewareNavigate('VideoPost', { medium: [post], isPost: true });
                }
            })
            .catch(() => {});
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
                            source={require('@src/assets/images/heart.png')}
                            style={{ width: PxFit(17), height: PxFit(17) }}
                        />
                        <Text style={styles.rewordText}>{`+${task.ticket}`}</Text>
                    </Row>
                )}
                {task.gold ? (
                    <Row style={styles.reword}>
                        <Image
                            source={require('@src/assets/images/diamond.png')}
                            style={{ width: PxFit(17), height: PxFit(17) }}
                        />
                        <Text style={styles.rewordText}>{`+${task.gold}`}</Text>
                    </Row>
                ) : null}
                {task.contribute > 0 && (
                    <Row style={styles.reword}>
                        <Image
                            source={require('@src/assets/images/gongxian.png')}
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
        let backgroundColor = '#2FC6FC';
        let disabled = false;

        switch (task.userTaskStatus) {
            case -1:
                name = '任务失败';
                backgroundColor = Theme.themeRed;
                doTask = () => {
                    Helper.middlewareNavigate('失败详情', {
                        task: task,
                    });
                };
                break;
            case 0:
                if (task.type == 2 && task.package) {
                    name = '去下载';
                    doTask = () => {
                        Linking.openURL(`market://details?id=${task.package}`);
                        taskTrack({
                            name: `点击做${task.name}任务`,
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
                backgroundColor = '#FCDB09';
                break;
            case 3:
                name = '已完成';
                doTask = taskReward;
                disabled = true;
                textColor = Theme.grey;
                backgroundColor = Theme.borderColor;
                break;
            case 4:
                backgroundColor = '#FCDB09';
                break;
            //TODO: 前端自定义任务扩充项  需逐步由tasksQuery控制
        }

        return (
            <Button
                title={name}
                style={{
                    borderRadius: PxFit(16),
                    height: PxFit(32),
                    width: PxFit(76),
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
                            width: Device.WIDTH - PxFit(70),
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
                        <Button title={'知道了'} onPress={() => Overlay.hide(OverlayKey)} style={styles.buttonText} />
                    </View>
                </View>
            </Overlay.View>
        );
        const OverlayKey = Overlay.show(overlayView);
    };

    return (
        <Fragment>
            <TouchFeedback
                style={styles.container}
                onPress={() => {
                    if (task.details.length > 0) {
                        showTaskDetail();
                    }
                }}>
                <Avatar
                    source={task.icon || Helper.getTaskIcon(task)}
                    style={{ marginRight: PxFit(5), marginLeft: PxFit(15) }}
                    size={PxFit(42)}
                />

                <Row
                    style={{
                        width: Device.WIDTH - PxFit(65),
                        justifyContent: 'space-between',
                        paddingRight: PxFit(15),
                        paddingVertical: PxFit(15),
                        borderBottomColor: Theme.borderColor,
                        borderBottomWidth: PxFit(0.5),
                    }}>
                    <View>
                        <Row>
                            <Text style={styles.name}>{task.name}</Text>
                            {task.details ? (
                                <TouchFeedback onPress={task.details.length > 0 && showTaskDetail}>
                                    <Image
                                        source={require('@src/assets/images/question.png')}
                                        style={{ width: PxFit(14), height: PxFit(14), marginHorizontal: PxFit(4) }}
                                    />
                                </TouchFeedback>
                            ) : null}
                        </Row>

                        {RewardContent()}
                    </View>

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
        color: '#333333',
        fontSize: Font(14),
    },
    taskRight: {
        paddingVertical: PxFit(5),
        paddingLeft: 5,
        paddingRight: 15,
    },
    reword: {
        marginRight: PxFit(8),
        marginTop: PxFit(5),
    },
    rewordText: {
        color: Theme.primaryColor,
        fontSize: Font(11),
        // fontWeight: '200',
        marginLeft: PxFit(1),
        // fontFamily: '',
    },
    taskDetail: {
        marginHorizontal: PxFit(20),
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
        width: Device.WIDTH,
        height: Device.HEIGHT,
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
