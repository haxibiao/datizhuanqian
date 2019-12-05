import React, { Fragment, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image, Animated, Linking, AppState } from 'react-native';

import { Button, Row, Iconfont, TouchFeedback } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, ISIOS, Tools } from 'utils';

import { Mutation, compose, useMutation, GQL } from 'apollo';
import { exceptionCapture } from 'common';
import { app } from 'store';
import { ttad, AppUtil } from 'native';
import service from 'service';

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
    taskStatus: Number;
    submit_name: string;
    details: string;
    type: Number;
    route: String;
    package: String;
    post_id: Number;
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
            Toast.show({ content: '领取成功' });
        } else {
            Toast.show({ content: '已经领取该任务了哦~' });
        }
    };

    //领取任务
    const getTask = async () => {
        const {
            task: { type },
        } = props;
        setLoading();
        const [error, res] = await exceptionCapture(receiveTask);
        if (error) {
            let str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
        }
        setUnLoading();
        if (res.data.receiveTask == 1) {
            Toast.show({ content: '领取成功' });

            if (task.type == 2 && task.package) {
                Tools.navigate('任务详情', { task: task });
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
                variables: { id: task.post_id },
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
        console.log('task :', task);
        if (event === 'active' && task.package && task.taskStatus == 0) {
            AppUtil.CheckApkExist(task.package, (data: any) => {
                console.log('CheckApkExist data :', data);
                completeTask();
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
                            style={{ width: PxFit(18), height: PxFit(18) }}
                        />
                        <Text style={styles.rewordText}>{`+${task.ticket}`}</Text>
                    </Row>
                )}
                {task.gold && (
                    <Row style={styles.reword}>
                        <Image
                            source={require('../../../assets/images/diamond.png')}
                            style={{ width: PxFit(18), height: PxFit(18) }}
                        />
                        <Text style={styles.rewordText}>{`+${task.gold}`}</Text>
                    </Row>
                )}
                {task.contribute > 0 && (
                    <Row style={styles.reword}>
                        <Image
                            source={require('../../../assets/images/gongxian.png')}
                            style={{ width: PxFit(14), height: PxFit(14) }}
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

        switch (task.taskStatus) {
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
                                name: '用户点击试玩任务',
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
                name = '领取奖励';
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
                    borderRadius: PxFit(16),
                    height: PxFit(32),
                    width: PxFit(84),
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
        //任务详情由后端控制
    };

    const showTaskDetail = () => {
        if (taskDetailVisiable) {
            rotateValue.setValue(180);
            Animated.timing(rotateValue, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start();
            setTaskDetailVisiable(false);
        } else {
            rotateValue.setValue(0);
            fadeValue.setValue(0);
            Animated.timing(rotateValue, {
                toValue: 180,
                duration: 400,
                useNativeDriver: true,
            }).start();
            Animated.timing(fadeValue, {
                toValue: 1,
                duration: 400,
            }).start();
            setTaskDetailVisiable(true);
        }
    };

    return (
        <Fragment>
            <TouchFeedback
                style={styles.container}
                onPress={() => {
                    if (!(task.taskStatus === 1 || 3)) {
                        handler();
                    }
                }}>
                <Row>
                    <Text style={styles.name}>{task.name}</Text>
                    {RewardContent()}
                </Row>
                <Row>
                    {TaskButton()}
                    <TouchFeedback onPress={showTaskDetail} style={styles.taskRight}>
                        <Animated.Image
                            style={{
                                width: 20,
                                height: 20,
                                transform: [
                                    {
                                        rotate: rotateValue.interpolate({
                                            inputRange: [0, 180],
                                            outputRange: ['0deg', '180deg'],
                                        }),
                                    },
                                ],
                            }}
                            source={require('../../../assets/images/down.png')}
                        />
                    </TouchFeedback>
                </Row>
            </TouchFeedback>
            {TaskDetail()}
        </Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: PxFit(12),
        paddingVertical: PxFit(12),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        color: '#3c3c3c',
        fontSize: PxFit(15),
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
        fontSize: PxFit(13),
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
});

export default TaskItem;
