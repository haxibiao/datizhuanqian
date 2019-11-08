import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, Platform } from 'react-native';

import { SubmitLoading, Banner, TouchFeedback, RewardTipsOverlay, TipsOverlay } from 'components';
import { Theme, SCREEN_WIDTH, Config, Tools, ISIOS, PxFit, ISAndroid } from 'utils';
import { Query, Mutation, graphql, withApollo, compose, GQL, useQuery } from 'apollo';
import { observer, app, config, keys, storage } from 'store';

import { ttad } from 'native';

import service from 'service';

import AttendanceBook from './AttendanceBook';
import TaskType from './TaskType';

const TaskBody = props => {
    const [userTasks, setUserTasks] = useState();
    const [isVisible, setIsVisible] = useState(false);

    const TasksQuery = useQuery(GQL.TasksQuery, {
        variables: { offest: 0, limit: 20 },
    });

    const { data: userData, refetch: refetchChatsQuery } = useQuery(GQL.UserQuery, {
        variables: { id: app.me.id },
    });

    useEffect(() => {
        // 获取任务配置
        service.taskConfig({
            callback: (data: any) => {
                config.saveTaskConfig(data);
            },
        });
    }, []);

    useEffect(() => {
        //构建tasklist
        constructTask();
        //更新缓存
        if (TasksQuery && TasksQuery.tasks) {
            app.updateTaskCache(TasksQuery.tasks);
        }
        //命中刷新
        const navDidFocusListener = props.navigation.addListener('didFocus', (payload: any) => {
            TasksQuery.refetch();
        });
        return () => {
            navDidFocusListener.remove();
        };
    }, [TasksQuery.loading, TasksQuery.refetch]);

    const constructTask = () => {
        const {
            data: { tasks },
            loading,
        } = TasksQuery;

        const {
            taskConfig: { chuti, reward, cpc, invitation },
            taskConfig,
        } = config;
        if (!loading && tasks.length > 0 && taskConfig) {
            // 新人任务
            const newUserTask = tasks.filter((elem, i) => {
                return elem.type == 0;
            });
            // 每日任务
            const dailyTask = tasks.filter((elem, i) => {
                return elem.type == 1;
            });
            //成长任务
            const growUpTask = tasks.filter((elem, i) => {
                return elem.type == 2;
            });

            //自定义任务模板
            const customTask = [
                {
                    name: '看视频赚钱',
                    status: Tools.syncGetter('status', reward),
                    taskStatus: 4,
                    gold: Tools.syncGetter('gold', reward),
                    ticket: Tools.syncGetter('ticket', reward),
                    contribute: Tools.syncGetter('contribute', reward),
                    type: 4,
                    submit_name: '看视频',
                    details: `看完视频才可获取精力点奖励,点击下载、查看详情才能够获取智慧点或贡献点奖励`,
                },
                {
                    name: '出题赚钱',
                    status: Tools.syncGetter('status', chuti),
                    taskStatus: 5,
                    gold: Tools.syncGetter('gold', chuti) + '~20',
                    ticket: Tools.syncGetter('ticket', chuti),
                    contribute: Tools.syncGetter('contribute', chuti),
                    type: 5,
                    submit_name: '去出题',
                    details: `出题被审核通过才能获取奖励。出题添加更加详细的解析会获取最高的奖励哦，没有解析将只能获得${Tools.syncGetter(
                        'gold',
                        chuti,
                    )}智慧点的奖励。恶意刷题和乱出解析将会受到惩罚哦！`,
                },
                {
                    name: '分享领现金',
                    status: Tools.syncGetter('status', invitation),
                    taskStatus: 6,
                    gold: Tools.syncGetter('gold', invitation),
                    ticket: Tools.syncGetter('ticket', invitation),
                    contribute: Tools.syncGetter('contribute', invitation),
                    type: 6,
                    submit_name: '去分享',
                    details: '每成功分享一个用户注册登录，即可获取600智慧点和36贡献点奖励',
                },
            ];

            // 任务列表
            const arry = [
                {
                    typeName: '激励任务',
                    tasks: customTask,
                    doTask: null,
                },
                {
                    typeName: '成长任务',
                    tasks: growUpTask,
                    doTask: null,
                },
                {
                    typeName: '每日任务',
                    tasks: dailyTask,
                    doTask: null,
                },
                {
                    typeName: '新人任务',
                    tasks: newUserTask,
                    doTask: null,
                },
            ];
            setUserTasks(arry);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <AttendanceBook />
            {userTasks &&
                userTasks.map((data: any, index: any) => {
                    return (
                        <TaskType
                            tasks={data.tasks}
                            typeName={data.typeName}
                            key={index}
                            userData={userData.user || app.me}
                            setLoading={() => setIsVisible(true)}
                            setUnLoading={() => setIsVisible(false)}
                        />
                    );
                })}

            <SubmitLoading isVisible={isVisible} content={'领取中'} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: PxFit(50),
    },
});

export default TaskBody;