import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, Platform } from 'react-native';

import { SubmitLoading, Banner, TouchFeedback, RewardTipsOverlay, TipsOverlay } from 'components';
import { Theme, SCREEN_WIDTH, Config, Tools, ISIOS, PxFit, ISAndroid, iPhone11 } from 'utils';
import { Query, Mutation, graphql, withApollo, compose, GQL, useQuery } from 'apollo';
import { observer, app, config, keys, storage } from 'store';

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
        if (TasksQuery && TasksQuery.data && TasksQuery.data.tasks) {
            app.updateTaskCache(TasksQuery.data.tasks);
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
        const { loading } = TasksQuery;

        let tasks = Tools.syncGetter('data.tasks', TasksQuery);
        if (!tasks) {
            if (app.taskCache) {
                tasks = app.taskCache;
            } else {
                return null;
            }
        }

        const {
            taskConfig: { chuti, reward, cpc, invitation, spider_video },
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
                    status: iPhone11() ? 0 : Tools.syncGetter('status', reward),
                    taskStatus: 4,
                    gold: Tools.syncGetter('gold', reward),
                    ticket: Tools.syncGetter('ticket', reward),
                    contribute: Tools.syncGetter('contribute', reward),
                    type: 4,
                    submit_name: '看视频',
                    details: `看完视频才可获取精力点奖励,点击下载、查看详情才能够获取智慧点或贡献点奖励`,
                },
                {
                    name: '出题目赚钱',
                    status: config.disableAd ? 0 : Tools.syncGetter('status', chuti),
                    taskStatus: 5,
                    gold: Tools.syncGetter('gold', chuti) + '~40',
                    ticket: Tools.syncGetter('ticket', chuti),
                    contribute: Tools.syncGetter('contribute', chuti),
                    type: 5,
                    submit_name: '去出题',
                    details: `每次成功出题都要消耗1精力点,出题被审核通过才能获取奖励。出题添加更加详细的解析会获取最高的奖励哦，恶意刷题和乱出解析将会受到惩罚哦！`,
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
                {
                    name: '玩抖音赚钱',
                    status: Tools.syncGetter('status', spider_video),
                    taskStatus: 7,
                    gold: Tools.syncGetter('gold', spider_video),
                    ticket: Tools.syncGetter('ticket', spider_video),
                    contribute: Tools.syncGetter('contribute', spider_video),
                    type: 7,
                    submit_name: '去采集',
                    details: `打开抖音视频点击分享按钮选择复制链接，回到答题赚钱即可触发视频采集，采集成功即可获取智慧点奖励,优质作者有机会获得更多贡献奖励`,
                },
                // {
                //     name: '试玩点墨阁',
                //     status: Tools.syncGetter('status', spider_video),
                //     taskStatus: 8,
                //     gold: Tools.syncGetter('gold', spider_video),
                //     ticket: Tools.syncGetter('ticket', spider_video),
                //     contribute: Tools.syncGetter('contribute', spider_video),
                //     type: 8,
                //     submit_name: '去试玩',
                //     details: `打开抖音视频点击分享按钮选择复制链接，回到答题赚钱即可触发视频采集，采集成功即可获取智慧点奖励,优质作者有机会获得更多贡献奖励`,
                // },
            ];

            // 任务列表
            const arry = [
                {
                    typeName: '贡献任务',
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
                            userData={(userData && userData.user) || app.me}
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
