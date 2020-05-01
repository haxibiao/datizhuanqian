import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, ImageBackground, View, Text } from 'react-native';

import { SubmitLoading, beginnerGuidance, TaskGuidance, Banner } from '@src/components';
import { GQL, useQuery } from 'apollo';
import { app, config, observer } from 'store';

import service from 'service';

import AttendanceBook from './AttendanceBook';
import TaskType from './TaskType';

const TaskBody = observer(props => {
    const [userTasks, setUserTasks] = useState();
    const { navigation } = props;
    const showGuidance = navigation.getParam('showGuidance', false);
    const TasksQuery = useQuery(GQL.TasksQuery, {
        variables: { offest: 0, limit: 100 },
    });

    const { data: userData, loading } = useQuery(GQL.UserQuery, {
        variables: { id: app.me.id },
    });

    //判断是否展示激励任务引导
    useEffect(() => {
        // 获取任务配置
        service.taskConfig({
            callback: (data: any) => {
                config.saveTaskConfig(data);
            },
        });
    }, []);

    useEffect(() => {
        // 更新缓存
        if (TasksQuery && TasksQuery.data && TasksQuery.data.tasks) {
            app.updateTaskCache(TasksQuery.data.tasks);
        }
        // 命中刷新
        const navDidFocusListener = navigation.addListener('didFocus', () => {
            TasksQuery.refetch();
        });
        return () => {
            navDidFocusListener.remove();
        };
    }, [TasksQuery.loading, TasksQuery.refetch, loading]);

    useEffect(() => {
        showGuidance &&
            beginnerGuidance({
                guidanceKey: 'Task',
                GuidanceView: TaskGuidance,
                dismissEnabled: true,
            });
    }, [showGuidance]);

    useEffect(() => {
        constructTask();
    }, [TasksQuery, app.taskCache]);

    const constructTask = () => {
        const { loading, error } = TasksQuery;

        let tasks = Helper.syncGetter('data.tasks', TasksQuery);

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
        if (tasks.length > 0 && taskConfig) {
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
                    name: '有趣小视频',
                    status: Helper.syncGetter('status', reward),
                    userTaskStatus: 4,
                    gold: Helper.syncGetter('gold', reward),
                    ticket: Helper.syncGetter('ticket', reward),
                    contribute: Helper.syncGetter('contribute', reward),
                    type: 4,
                    submit_name: '领奖励',
                    details: `看完视频才可获取精力点奖励,点击下载、查看详情才能够获取智慧点或贡献点奖励；小提示:小星星就是贡献值哦~`,
                    icon: require('@src/assets/images/ic_task_reward_ad.png'),
                },
                {
                    name: '在线出题',
                    status: Helper.syncGetter('status', chuti),
                    userTaskStatus: 5,
                    gold: Helper.syncGetter('gold', chuti) || '10' + '~40',
                    ticket: Helper.syncGetter('ticket', chuti),
                    contribute: Helper.syncGetter('contribute', chuti),
                    type: 5,
                    submit_name: '去出题',
                    details: `每次成功出题都要消耗1精力点,出题被审核通过才能获取奖励。出题添加更加详细的解析会获取最高的奖励哦，恶意刷题和乱出解析将会受到惩罚哦！`,
                    icon: require('@src/assets/images/ic_task_contribute.png'),
                },
                {
                    name: '分享领现金',
                    status: Helper.syncGetter('status', invitation),
                    userTaskStatus: 6,
                    gold: Helper.syncGetter('gold', invitation),
                    ticket: Helper.syncGetter('ticket', invitation),
                    contribute: Helper.syncGetter('contribute', invitation),
                    type: 6,
                    submit_name: '领现金',
                    details: '每成功分享一个用户注册登录，即可获取600智慧点和36贡献点奖励',
                },
                {
                    name: '采集抖音视频',
                    status: Helper.syncGetter('status', spider_video),
                    userTaskStatus: 7,
                    gold: Helper.syncGetter('gold', spider_video),
                    ticket: Helper.syncGetter('ticket', spider_video),
                    contribute: Helper.syncGetter('contribute', spider_video),
                    type: 7,
                    submit_name: '做任务',
                    details: `打开抖音视频点击分享按钮选择复制链接，回到答题APP即可触发视频采集，采集成功即可获取智慧点奖励,优质作者有机会获得更多贡献奖励`,
                    icon: require('@src/assets/images/ic_task_douyin.png'),
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
                    tasks: !Device.IOS ? growUpTask : [],
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
            <ImageBackground
                source={require('@src/assets/images/bg_task_cover.png')}
                style={{
                    width: Device.WIDTH,
                    height: (Device.WIDTH * 532) / 1125,
                    // marginTop: ,
                }}>
                <View
                    style={{
                        height: Device.NAVBAR_HEIGHT,
                        paddingTop: PxFit(Device.statusBarHeight),
                        // paddingBottom: PxFit(10),
                        paddingHorizontal: PxFit(20),
                        justifyContent: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: Font(20),
                            color: Theme.navBarTitleColor,
                            fontWeight: 'bold',
                            letterSpacing: 1.5,
                        }}>
                        任务中心
                    </Text>
                </View>
            </ImageBackground>
            <View style={{ flex: 1, marginTop: -PxFit(95) }}>
                <Banner backgroundColor={'transparent'} textColor={'#FFF'} />
                <AttendanceBook />
                {userTasks &&
                    userTasks.map((data: any, index: any) => {
                        return (
                            <TaskType
                                tasks={data.tasks}
                                typeName={data.typeName}
                                key={index}
                                userData={(userData && userData.user) || app.me}
                                navigation={props.navigation}
                            />
                        );
                    })}
            </View>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default TaskBody;
