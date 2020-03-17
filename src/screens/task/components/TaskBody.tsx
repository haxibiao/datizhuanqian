import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import { SubmitLoading, beginnerGuidance, TaskGuidance } from 'components';
import { Tools, ISIOS, PxFit, iPhone11 } from 'utils';
import { GQL, useQuery } from 'apollo';
import { app, config } from 'store';

import service from 'service';

import AttendanceBook from './AttendanceBook';
import TaskType from './TaskType';

const TaskBody = props => {
    const [userTasks, setUserTasks] = useState();
    const [isVisible, setIsVisible] = useState(false);

    const TasksQuery = useQuery(GQL.TasksQuery, {
        variables: { offest: 0, limit: 100 },
    });

    const { data: userData, loading } = useQuery(GQL.UserQuery, {
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
        // 构建tasklist
        constructTask();
        // 更新缓存
        if (TasksQuery && TasksQuery.data && TasksQuery.data.tasks) {
            app.updateTaskCache(TasksQuery.data.tasks);
        }
        // 命中刷新
        const navDidFocusListener = props.navigation.addListener('didFocus', () => {
            TasksQuery.refetch();
            !config.disableAd && Tools.syncGetter('user.wallet.total_withdraw_amount', userData) == 1;
            beginnerGuidance({
                guidanceKey: 'Task',
                GuidanceView: TaskGuidance,
                dismissEnabled: true,
            });
        });
        return () => {
            navDidFocusListener.remove();
        };
    }, [TasksQuery.loading, TasksQuery.refetch, loading]);

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
            taskConfig: { chuti, reward, invitation, spider_video },
            taskConfig,
        } = config;
        if (!loading && tasks.length > 0 && taskConfig) {
            // 新人任务
            const newUserTask = tasks.filter(elem => {
                return elem.type == 0;
            });
            // 每日任务
            const dailyTask = tasks.filter(elem => {
                return elem.type == 1;
            });
            //成长任务
            const growUpTask = tasks.filter(elem => {
                return elem.type == 2;
            });

            //自定义任务模板
            const customTask = [
                {
                    name: '看视频赚钱',
                    status: iPhone11() || config.disableAd ? 0 : Tools.syncGetter('status', reward),
                    userTaskStatus: 4,
                    gold: Tools.syncGetter('gold', reward),
                    ticket: Tools.syncGetter('ticket', reward),
                    contribute: Tools.syncGetter('contribute', reward),
                    type: 4,
                    submit_name: '领奖励',
                    details: `看完视频才可获取精力点奖励,点击下载、查看详情才能够获取智慧点或贡献点奖励`,
                    icon: require('@src/assets/images/task_video_icon.png'),
                },
                {
                    name: '出题目赚钱',
                    status: Tools.syncGetter('status', chuti),
                    userTaskStatus: 5,
                    gold: Tools.syncGetter('gold', chuti) + '~40',
                    ticket: Tools.syncGetter('ticket', chuti),
                    contribute: Tools.syncGetter('contribute', chuti),
                    type: 5,
                    submit_name: '去出题',
                    details: `每次成功出题都要消耗1精力点,出题被审核通过才能获取奖励。出题添加更加详细的解析会获取最高的奖励哦，恶意刷题和乱出解析将会受到惩罚哦！`,
                    icon: require('@src/assets/images/task_answer_icon.png'),
                },
                {
                    name: '分享领现金',
                    status: Tools.syncGetter('status', invitation),
                    userTaskStatus: 6,
                    gold: Tools.syncGetter('gold', invitation),
                    ticket: Tools.syncGetter('ticket', invitation),
                    contribute: Tools.syncGetter('contribute', invitation),
                    type: 6,
                    submit_name: '领现金',
                    details: '每成功分享一个用户注册登录，即可获取600智慧点和36贡献点奖励',
                },
                {
                    name: '玩抖音赚钱',
                    status: Tools.syncGetter('status', spider_video),
                    userTaskStatus: 7,
                    gold: Tools.syncGetter('gold', spider_video),
                    ticket: Tools.syncGetter('ticket', spider_video),
                    contribute: Tools.syncGetter('contribute', spider_video),
                    type: 7,
                    submit_name: '领奖励',
                    details: `打开抖音视频点击分享按钮选择复制链接，回到答题APP即可触发视频采集，采集成功即可获取智慧点奖励,优质作者有机会获得更多贡献奖励`,
                    icon: require('@src/assets/images/task_money_icon.png'),
                },
            ];

            // 任务列表
            const arry = [
                {
                    typeName: '贡献任务',
                    tasks: !config.disableAd ? customTask : [],
                    doTask: null,
                },
                {
                    typeName: '成长任务',
                    tasks: !ISIOS ? growUpTask : [],
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
                            navigation={props.navigation}
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
